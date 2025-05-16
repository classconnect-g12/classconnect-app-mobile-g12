import React, { useEffect, useState } from "react";
import { router } from "expo-router";
import { AppSnackbar } from "@components/AppSnackbar";
import { validateCourse } from "@utils/validators";
import { useSnackbar } from "@hooks/useSnackbar";
import { SNACKBAR_VARIANTS } from "@constants/snackbarVariants";
import { createCourse, getMyCourses } from "@services/CourseService";
import { handleApiError } from "@utils/handleApiError";
import { useAuth } from "@context/authContext";
import { CourseForm } from "@components/CourseForm";
import { View, Text, StyleSheet } from "react-native";

type CourseOption = { id: string; title: string };

export default function CreateCourse() {
  const [courseName, setCourseName] = useState("");
  const [description, setDescription] = useState("");
  const [capacity, setCapacity] = useState("");
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [modality, setModality] = useState<"ONLINE" | "ONSITE" | "HYBRID">(
    "ONLINE"
  );
  const [allCourses, setAllCourses] = useState<CourseOption[]>([]);
  const [selectedCourses, setSelectedCourses] = useState<CourseOption[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { logout } = useAuth();

  const {
    snackbarVisible,
    snackbarMessage,
    snackbarVariant,
    showSnackbar,
    hideSnackbar,
  } = useSnackbar();

  const fetchCourses = async (query = "") => {
    try {
      const data = await getMyCourses(0, 10, query);
      setAllCourses(data.courses);
    } catch (error) {
      handleApiError(error, showSnackbar, "Error fetching courses", logout);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleCreateCourse = async () => {
    if (isLoading) return; // Evita spameo

    const error = validateCourse(courseName);
    if (error) {
      showSnackbar(error, SNACKBAR_VARIANTS.ERROR);
      return;
    }

    if (description.length > 255) {
      showSnackbar(
        "Description must be at most 255 characters",
        SNACKBAR_VARIANTS.ERROR
      );
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

    if (startDate >= endDate) {
      showSnackbar(
        "End date must be after start date",
        SNACKBAR_VARIANTS.ERROR
      );
      return;
    }

    const teacherId = 123;
    const courseData = {
      title: courseName,
      description,
      teacherId,
      capacity: parsedCapacity,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      modality,
      correlativeCourseIds: selectedCourses.map((c) => c.id),
    };

    try {
      setIsLoading(true);
      await createCourse(courseData);
      showSnackbar("Course created successfully!", SNACKBAR_VARIANTS.SUCCESS);
      setTimeout(() => {
        router.back();
      }, 1500);
    } catch (error) {
      handleApiError(error, showSnackbar, "Error creating the course", logout);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <CourseForm
        courseName={courseName}
        setCourseName={setCourseName}
        description={description}
        setDescription={setDescription}
        capacity={capacity}
        setCapacity={setCapacity}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        modality={modality}
        setModality={setModality}
        objectives={null}
        setObjectives={null}
        syllabus={null}
        setSyllabus={null}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        allCourses={allCourses}
        setAllCourses={setAllCourses}
        selectedCourses={selectedCourses}
        setSelectedCourses={setSelectedCourses}
        handleCreateCourse={handleCreateCourse}
        isLoading={isLoading}
        buttonMessageActive={"Creating..."}
        buttonMessageInactive={"Create Course"}
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
