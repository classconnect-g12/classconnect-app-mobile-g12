import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { fetchCourseDetail, updateCourse } from "@services/CourseService";
import { CourseRequestBody, FullCourse, Modality } from "@src/types/course";
import { AppSnackbar } from "@components/AppSnackbar";
import { useSnackbar } from "@hooks/useSnackbar";
import { SNACKBAR_VARIANTS } from "@constants/snackbarVariants";
import { handleApiError } from "@utils/handleApiError";
import { useAuth } from "@context/authContext";
import { CourseForm } from "@components/CourseForm";
import { View, Text, StyleSheet } from "react-native";

type CourseOption = { id: string; title: string };

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

  const [isLoading, setIsLoading] = useState(false);
  const [allCourses, setAllCourses] = useState<CourseOption[]>([]);
  const [selectedCourses, setSelectedCourses] = useState<CourseOption[]>([]);
  const { logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [initialCourse, setInitialCourse] = useState<CourseRequestBody>({});
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [objectives, setObjectives] = useState("");
  const [syllabus, setSyllabus] = useState("");
  const [modality, setModality] = useState<Modality>("HYBRID");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
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
        setSelectedCourses(
          course.correlatives?.map((c) => ({ id: c.id, title: c.title })) || []
        );
        setModality(course.modality);

        const parsedStartDate = new Date(course.startDate);
        const parsedEndDate = new Date(course.endDate);

        if (!isNaN(parsedStartDate.getTime())) {
          setStartDate(parsedStartDate);
        } else {
          console.warn("Invalid startDate, using default");
        }

        if (!isNaN(parsedEndDate.getTime())) {
          setEndDate(parsedEndDate);
        } else {
          console.warn("Invalid endDate, using default");
        }

        setInitialCourse(course);
      } catch (error) {
        handleApiError(
          error,
          showSnackbar,
          "Error loading course data",
          logout
        );
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
    const selectedIds = selectedCourses.map((c) => c.id);
    if (
      JSON.stringify(selectedIds.sort()) !==
      JSON.stringify((initialCourse.correlativeCourseIds ?? []).sort())
    ) {
      updatedFields.correlativeCourseIds = selectedIds;
    }

    if (modality !== initialCourse.modality) updatedFields.modality = modality;

    if (Object.keys(updatedFields).length === 0) {
      showSnackbar("No changes to save.", SNACKBAR_VARIANTS.ERROR);
      return;
    }

    try {
      setIsLoading(true);
      const parsedId = Array.isArray(id) ? id[0] : id;
      await updateCourse(parsedId, updatedFields);

      showSnackbar("Course updated successfully!", SNACKBAR_VARIANTS.SUCCESS);
      setTimeout(() => {
        router.replace("/(protected)/course/myCourses");
      }, 1500);
    } catch (error) {
      handleApiError(error, showSnackbar, "Error updating course", logout);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <View>
        <Text style={styles.title}>Edit Course</Text>
        <Text style={styles.subtitle}>Update the course details</Text>
      </View>
      <CourseForm
        courseName={title}
        setCourseName={setTitle}
        description={description}
        setDescription={setDescription}
        objectives={objectives}
        setObjectives={setObjectives}
        syllabus={syllabus}
        setSyllabus={setSyllabus}
        capacity={null}
        setCapacity={null}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        modality={modality}
        setModality={setModality}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        allCourses={allCourses}
        setAllCourses={setAllCourses}
        selectedCourses={selectedCourses}
        setSelectedCourses={setSelectedCourses}
        handleCreateCourse={handleSave}
        isLoading={isLoading}
        buttonMessageActive="Saving..."
        buttonMessageInactive="Save Course"
      />

      <AppSnackbar
        visible={snackbarVisible}
        message={snackbarMessage}
        onDismiss={hideSnackbar}
        variant={snackbarVariant}
      />
    </>
  );
}

const styles = StyleSheet.create({
  title: {
    marginTop: 20,
    textAlign: "center",
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 8,
  },
  subtitle: {
    textAlign: "center",
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
  },
});