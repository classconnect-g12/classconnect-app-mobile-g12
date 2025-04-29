import React, { useState } from "react";
import { Picker } from "@react-native-picker/picker";
import {
  DateTimePickerAndroid,
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import {
  View,
  Text,
  KeyboardAvoidingView,
  ScrollView,
  Pressable,
} from "react-native";
import { TextInput, Button } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";

import { colors } from "@theme/colors";
import { AppSnackbar } from "@components/AppSnackbar";
import { validateCourse } from "@utils/validators";
import { createCourseStyles as styles } from "@styles/createCourseStyles";
import { useSnackbar } from "@hooks/useSnackbar";
import { SNACKBAR_VARIANTS } from "@constants/snackbarVariants";
import { createCourse } from "@services/CourseService";

export default function CreateCourse() {
  const [courseName, setCourseName] = useState("");
  const [description, setDescription] = useState("");
  const [capacity, setCapacity] = useState("");
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [modality, setModality] = useState<"ONLINE" | "ONSITE" | "HYBRID">(
    "ONLINE"
  );

  const {
    snackbarVisible,
    snackbarMessage,
    snackbarVariant,
    showSnackbar,
    hideSnackbar,
  } = useSnackbar();

  const handleCreateCourse = async () => {
    const error = validateCourse(courseName);
    if (error) {
      showSnackbar(error, SNACKBAR_VARIANTS.ERROR);
      return;
    }

    const parsedCapacity = parseInt(capacity, 10);
    if (isNaN(parsedCapacity) || parsedCapacity <= 0) {
      showSnackbar(
        "Capacity must be a valid positive number",
        SNACKBAR_VARIANTS.ERROR
      );
      return;
    }

    if (
      description.length < 0 ||
      description.length < 50 ||
      description.length > 255
    ) {
      showSnackbar(
        "Description must be between 50 and 255 characters",
        SNACKBAR_VARIANTS.ERROR
      );
      return;
    }

    if (startDate >= endDate) {
      showSnackbar(
        "End date must be after start date",
        SNACKBAR_VARIANTS.ERROR
      );
      return;
    }

    const teacherId = 123;

    try {
      const courseData = {
        title: courseName,
        description,
        teacherId,
        capacity: parsedCapacity,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        modality,
      };
      await createCourse(courseData);
      showSnackbar("Course created successfully!", SNACKBAR_VARIANTS.SUCCESS);
      router.back();
    } catch (err: any) {
      console.error("Error completo:", err);
      const errorMessage = err.message || "Server error";
      showSnackbar(errorMessage, SNACKBAR_VARIANTS.ERROR);
    }
  };

  const onChangeStart = (event: DateTimePickerEvent, date?: Date) => {
    if (date) {
      setStartDate(date);
    }
  };

  const onChangeEnd = (event: DateTimePickerEvent, date?: Date) => {
    if (date) {
      setEndDate(date);
    }
  };

  const openStartDatePickerAndroid = () => {
    DateTimePickerAndroid.open({
      value: startDate,
      onChange: onChangeStart,
      mode: "date",
      display: "spinner",
      minimumDate: new Date(),
      positiveButton: { label: "Confirmar", textColor: colors.primary },
      negativeButton: { label: "Cancelar", textColor: colors.text },
    });
  };

  const openEndDatePickerAndroid = () => {
    DateTimePickerAndroid.open({
      value: endDate,
      onChange: onChangeEnd,
      mode: "date",
      display: "spinner",
      minimumDate: new Date(),
      positiveButton: { label: "Confirmar", textColor: colors.primary },
      negativeButton: { label: "Cancelar", textColor: colors.text },
    });
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="height">
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Create New Course</Text>
        <Text style={styles.subtitle}>Fill in the course details</Text>

        <View style={styles.inputContainer}>
          <TextInput
            label="Course Name"
            value={courseName}
            onChangeText={setCourseName}
            mode="outlined"
            style={styles.input}
            theme={{ colors: { primary: colors.primary } }}
          />

          <TextInput
            label="Description"
            value={description}
            onChangeText={setDescription}
            mode="outlined"
            multiline
            numberOfLines={4}
            style={styles.input}
            theme={{ colors: { primary: colors.primary } }}
          />

          <TextInput
            label="Capacity"
            value={capacity}
            onChangeText={setCapacity}
            mode="outlined"
            style={styles.input}
            keyboardType="numeric"
          />

          <View style={styles.datePickerContainer}>
            <Text style={styles.dateLabel}>Start Date</Text>
            <Pressable
              onPress={openStartDatePickerAndroid}
              style={styles.datePicker}
            >
              <Text style={styles.datePickerText}>
                {startDate.toISOString().split("T")[0]}
              </Text>
              <MaterialIcons
                name="calendar-today"
                size={24}
                color={colors.primary}
                style={styles.datePickerIcon}
              />
            </Pressable>

            <Text style={styles.dateLabel}>End Date</Text>
            <Pressable
              onPress={openEndDatePickerAndroid}
              style={styles.datePicker}
            >
              <Text style={styles.datePickerText}>
                {endDate.toISOString().split("T")[0]}
              </Text>
              <MaterialIcons
                name="calendar-today"
                size={24}
                color={colors.primary}
                style={styles.datePickerIcon}
              />
            </Pressable>
          </View>

          <View style={styles.input}>
            <Picker
              selectedValue={modality}
              onValueChange={(itemValue) =>
                setModality(itemValue as "ONLINE" | "ONSITE" | "HYBRID")
              }
              style={{ color: colors.text }}
            >
              <Picker.Item label="Online" value="ONLINE" />
              <Picker.Item label="Onsite" value="ONSITE" />
              <Picker.Item label="Hybrid" value="HYBRID" />
            </Picker>
          </View>

          <Button
            mode="contained"
            onPress={handleCreateCourse}
            style={styles.button}
            labelStyle={{ color: colors.buttonText }}
          >
            Create Course
          </Button>
        </View>
      </ScrollView>

      <AppSnackbar
        visible={snackbarVisible}
        message={snackbarMessage}
        onDismiss={hideSnackbar}
        variant={snackbarVariant}
      />
    </KeyboardAvoidingView>
  );
}
