import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { TextInput, Button, Card } from "react-native-paper";
import { router } from "expo-router";
import { colors } from "@theme/colors";
import { findCourseStyles as styles } from "@styles/findCourseStyles";
import { AppSnackbar } from "@components/AppSnackbar";
import { useSnackbar } from "@hooks/useSnackbar";
import { SNACKBAR_VARIANTS } from "@constants/snackbarVariants";
import { fetchCourses } from "@services/CourseService";
import { ApiCourse } from "@types/course";

export default function FindCourse() {
  const [searchQuery, setSearchQuery] = useState("");
  const [courses, setCourses] = useState<ApiCourse[]>([]);
  const [isLoadingInitial, setIsLoadingInitial] = useState(true);
  const [isSearching, setIsSearching] = useState(false);

  const {
    snackbarVisible,
    snackbarMessage,
    snackbarVariant,
    showSnackbar,
    hideSnackbar,
  } = useSnackbar();

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const response = await fetchCourses();
        const availableCourses = response.courses.filter(
          (course) => course.available
        );
        setCourses(availableCourses);
      } catch (error) {
        console.error(error);
        showSnackbar("Error fetching courses", SNACKBAR_VARIANTS.ERROR);
      } finally {
        setIsLoadingInitial(false);
      }
    };

    loadCourses();
  }, []);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      showSnackbar("Please enter a search term", SNACKBAR_VARIANTS.INFO);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetchCourses();
      const availableCourses = response.courses.filter(
        (course) => course.available
      );
      setCourses(availableCourses);
    } catch (error) {
      console.error(error);
      showSnackbar("Error fetching courses", SNACKBAR_VARIANTS.ERROR);
    } finally {
      setIsSearching(false);
    }
  };

  const handleJoinCourse = (courseId: string) => {
    showSnackbar("Successfully joined the course!", SNACKBAR_VARIANTS.SUCCESS);
    router.back();
  };

  const renderCourse = ({ item }: { item: ApiCourse }) => (
    <Card style={styles.courseCard}>
      <Card.Content>
        <Text style={styles.courseName}>{item.title}</Text>
        <Text style={styles.courseDescription}>{item.description}</Text>
      </Card.Content>
      <Card.Actions>
        <Button
          mode="contained"
          onPress={() => handleJoinCourse(item.id)}
          style={styles.joinButton}
          labelStyle={{ color: colors.buttonText }}
        >
          Join Course
        </Button>
      </Card.Actions>
    </Card>
  );

  if (isLoadingInitial) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Find a Course</Text>
        <Text style={styles.subtitle}>Search for courses to join</Text>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          label="Search Courses"
          value={searchQuery}
          onChangeText={setSearchQuery}
          mode="outlined"
          style={styles.searchInput}
          theme={{ colors: { primary: colors.primary } }}
        />
        <Button
          mode="contained"
          onPress={handleSearch}
          style={styles.searchButton}
          labelStyle={{ color: colors.buttonText }}
          loading={isSearching}
        >
          Search
        </Button>
      </View>

      <FlatList
        data={courses}
        renderItem={renderCourse}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.courseList}
        ListEmptyComponent={() => (
          <Text style={styles.emptyText}>
            {searchQuery
              ? "No courses found. Try a different search term."
              : "Search for courses to join"}
          </Text>
        )}
      />

      <AppSnackbar
        visible={snackbarVisible}
        message={snackbarMessage}
        onDismiss={hideSnackbar}
        variant={snackbarVariant}
      />
    </KeyboardAvoidingView>
  );
}
