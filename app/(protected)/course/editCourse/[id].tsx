import React, { useEffect, useState } from "react";
import { View, Text, TextInput, ScrollView, Pressable } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { fetchCourseDetail, updateCourse } from "@services/CourseService";
import { CourseRequestBody, FullCourse } from "@src/types/course";
import { Picker } from "@react-native-picker/picker";
import {
  DateTimePickerAndroid,
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { MaterialIcons } from "@expo/vector-icons";
import { colors } from "@theme/colors";
import { editCourseStyles as styles } from "@styles/editCourseStyles";
import { Button } from "react-native-paper";
import { AppSnackbar } from "@components/AppSnackbar";
import { useSnackbar } from "@hooks/useSnackbar";
import { SNACKBAR_VARIANTS } from "@constants/snackbarVariants";

export default function EditCourse() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const {
    snackbarVisible,
    snackbarMessage,
    snackbarVariant,
    showSnackbar,
    hideSnackbar,
  } = useSnackbar();

  const [initialCourse, setInitialCourse] = useState<CourseRequestBody>({});
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [objectives, setObjectives] = useState("");
  const [syllabus, setSyllabus] = useState("");
  const [prerequisites, setPrerequisites] = useState("");
  const [modality, setModality] =
    useState<CourseRequestBody["modality"]>("HYBRID");
  const [startDate, setStartDate] = useState(new Date().toISOString());
  const [endDate, setEndDate] = useState(
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
  );

  useEffect(() => {
    const loadCourse = async () => {
      try {
        const courseData: { course: FullCourse; teacher: any } =
          await fetchCourseDetail(id as string);
        const course = courseData.course;

        setTitle(course.title);
        setDescription(course.description);
        setObjectives(course.objectives);
        setSyllabus(course.syllabus);
        setPrerequisites(course.prerequisites);
        setModality(course.modality);

        const parsedStartDate = new Date(course.startDate);
        const parsedEndDate = new Date(course.endDate);

        if (!isNaN(parsedStartDate.getTime())) {
          setStartDate(parsedStartDate.toISOString());
        } else {
          console.warn("Invalid startDate, using default");
        }

        if (!isNaN(parsedEndDate.getTime())) {
          setEndDate(parsedEndDate.toISOString());
        } else {
          console.warn("Invalid endDate, using default");
        }

        setInitialCourse(course);
      } catch (error) {
        console.error("Error loading course details:", error);
        showSnackbar("Error loading course details.", SNACKBAR_VARIANTS.ERROR);
      }
    };

    if (id) {
      loadCourse();
    }
  }, [id]);

  const handleSave = async () => {
    if (!title.trim()) {
      showSnackbar("Title is required.", SNACKBAR_VARIANTS.ERROR);
      return;
    }

    if (description.trim().length < 50 || description.trim().length > 255) {
      showSnackbar(
        "Description must have between 50 and 255 characters",
        SNACKBAR_VARIANTS.ERROR
      );
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (start < today) {
      showSnackbar(
        "Start date cannot be in the past.",
        SNACKBAR_VARIANTS.ERROR
      );
      return;
    }

    if (end <= start) {
      showSnackbar(
        "End date must be after start date.",
        SNACKBAR_VARIANTS.ERROR
      );
      return;
    }

    const updatedFields: Partial<typeof initialCourse> = {};

    if (title !== initialCourse.title) updatedFields.title = title;
    if (description !== initialCourse.description)
      updatedFields.description = description;
    if (objectives !== initialCourse.objectives)
      updatedFields.objectives = objectives;
    if (syllabus !== initialCourse.syllabus) updatedFields.syllabus = syllabus;
    if (prerequisites !== initialCourse.prerequisites)
      updatedFields.prerequisites = prerequisites;
    if (modality !== initialCourse.modality) updatedFields.modality = modality;
    if (startDate !== initialCourse.startDate)
      updatedFields.startDate = startDate;
    if (endDate !== initialCourse.endDate) updatedFields.endDate = endDate;

    if (Object.keys(updatedFields).length === 0) {
      showSnackbar("No changes to save.", SNACKBAR_VARIANTS.ERROR);
      return;
    }

    try {
      const parsedId = Array.isArray(id) ? id[0] : id;
      await updateCourse(parsedId, updatedFields);

      showSnackbar("Course updated successfully!", SNACKBAR_VARIANTS.SUCCESS);
      router.back();
    } catch (error) {
      console.error("Error updating course:", error);
      showSnackbar(
        "An error occurred while updating the course.",
        SNACKBAR_VARIANTS.ERROR
      );
    }
  };

  const onChangeStart = (event: DateTimePickerEvent, date?: Date) => {
    if (date && !isNaN(date.getTime())) {
      setStartDate(date.toISOString());
    }
  };

  const onChangeEnd = (event: DateTimePickerEvent, date?: Date) => {
    if (date && !isNaN(date.getTime())) {
      setEndDate(date.toISOString());
    }
  };

  const openStartDatePickerAndroid = () => {
    try {
      DateTimePickerAndroid.open({
        value: new Date(startDate),
        onChange: onChangeStart,
        mode: "date",
        display: "spinner",
        minimumDate: new Date(),
        positiveButton: { label: "Confirm", textColor: colors.primary },
        negativeButton: { label: "Cancel", textColor: colors.text },
      });
    } catch (error) {
      console.error("Error opening start date picker:", error);
    }
  };

  const openEndDatePickerAndroid = () => {
    try {
      DateTimePickerAndroid.open({
        value: new Date(endDate),
        onChange: onChangeEnd,
        mode: "date",
        display: "spinner",
        minimumDate: new Date(),
        positiveButton: { label: "Confirm", textColor: colors.primary },
        negativeButton: { label: "Cancel", textColor: colors.text },
      });
    } catch (error) {
      console.error("Error opening end date picker:", error);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return !isNaN(date.getTime())
      ? date.toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0];
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Title</Text>
      <TextInput value={title} onChangeText={setTitle} style={styles.input} />

      <Text style={styles.label}>Description</Text>
      <TextInput
        value={description}
        onChangeText={setDescription}
        style={styles.input}
        multiline
      />

      <Text style={styles.label}>Objectives</Text>
      <TextInput
        value={objectives}
        onChangeText={setObjectives}
        style={styles.input}
        multiline
      />

      <Text style={styles.label}>Syllabus</Text>
      <TextInput
        value={syllabus}
        onChangeText={setSyllabus}
        style={styles.input}
        multiline
      />

      <Text style={styles.label}>Prerequisites</Text>
      <TextInput
        value={prerequisites}
        onChangeText={setPrerequisites}
        style={styles.input}
        multiline
      />

      <Picker
        selectedValue={modality}
        onValueChange={(itemValue) => setModality(itemValue)}
        style={styles.input}
      >
        <Picker.Item label="Hybrid" value="HYBRID" />
        <Picker.Item label="Online" value="ONLINE" />
        <Picker.Item label="Onsite" value="ONSITE" />
      </Picker>

      <Text style={styles.label}>Start Date</Text>
      <Pressable onPress={openStartDatePickerAndroid} style={styles.datePicker}>
        <Text style={styles.datePickerText}>{formatDate(startDate)}</Text>
        <MaterialIcons
          name="calendar-today"
          size={24}
          color={colors.primary}
          style={styles.datePickerIcon}
        />
      </Pressable>

      <Text style={styles.label}>End Date</Text>
      <Pressable onPress={openEndDatePickerAndroid} style={styles.datePicker}>
        <Text style={styles.datePickerText}>{formatDate(endDate)}</Text>
        <MaterialIcons
          name="calendar-today"
          size={24}
          color={colors.primary}
          style={styles.datePickerIcon}
        />
      </Pressable>

      <View style={{ marginTop: 20 }}>
        <Button mode="contained" onPress={handleSave} buttonColor="#007bff">
          Save Changes
        </Button>
      </View>

      <AppSnackbar
        visible={snackbarVisible}
        message={snackbarMessage}
        onDismiss={hideSnackbar}
        variant={snackbarVariant}
      />
    </ScrollView>
  );
}
