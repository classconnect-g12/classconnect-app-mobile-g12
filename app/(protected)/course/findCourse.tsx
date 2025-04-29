import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  ActivityIndicator,
  TouchableWithoutFeedback,
} from "react-native";
import { TextInput, Button, Card } from "react-native-paper";
import { router } from "expo-router";
import { colors } from "@theme/colors";
import { findCourseStyles as styles } from "@styles/findCourseStyles";
import { AppSnackbar } from "@components/AppSnackbar";
import { useSnackbar } from "@hooks/useSnackbar";
import { SNACKBAR_VARIANTS } from "@constants/snackbarVariants";
import { fetchCourses } from "@services/CourseService";
import { ApiCourse } from "@src/types/course";

export default function FindCourse() {
  const [searchQuery, setSearchQuery] = useState("");
  const [courses, setCourses] = useState<ApiCourse[]>([]);
  const [isLoadingInitial, setIsLoadingInitial] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const {
    snackbarVisible,
    snackbarMessage,
    snackbarVariant,
    showSnackbar,
    hideSnackbar,
  } = useSnackbar();

  const loadCourses = async (pageNumber = 0, reset = false) => {
    if (reset) {
      setCourses([]);
      setPage(0);
      setTotalPages(1);
    }

    try {
      if (pageNumber === 0) {
        setIsLoadingInitial(true);
      } else {
        setIsLoadingMore(true);
      }

      const response = await fetchCourses(pageNumber, 10);
      const availableCourses = response.courses.filter(
        (course) => course.available
      );

      setCourses((prev) =>
        pageNumber === 0 ? availableCourses : [...prev, ...availableCourses]
      );
      setTotalPages(response.pagination.totalPages);
    } catch (error) {
      console.error(error);
      showSnackbar("Error fetching courses", SNACKBAR_VARIANTS.ERROR);
    } finally {
      if (pageNumber === 0) {
        setIsLoadingInitial(false);
      } else {
        setIsLoadingMore(false);
      }
    }
  };

  useEffect(() => {
    loadCourses(0);
  }, []);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadCourses(0, true);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetchCourses(0, 10);
      const availableCourses = response.courses.filter(
        (course) =>
          course.available &&
          course.title.toLowerCase().includes(searchQuery.toLowerCase())
      );

      setCourses(availableCourses);
      setTotalPages(1);
    } catch (error) {
      console.error(error);
      showSnackbar("Error fetching courses", SNACKBAR_VARIANTS.ERROR);
    } finally {
      setIsSearching(false);
    }
  };

  const loadMore = () => {
    if (!isSearching && !isLoadingMore && page + 1 < totalPages) {
      const nextPage = page + 1;
      loadCourses(nextPage);
      setPage(nextPage);
    }
  };

  const handleJoinCourse = (courseId: string) => {
    showSnackbar("Successfully joined the course!", SNACKBAR_VARIANTS.SUCCESS);
    router.back();
  };

  const renderCourse = ({ item }: { item: ApiCourse }) => (
    <TouchableWithoutFeedback
      onPress={() => router.push(`/course/${item.id}` as any)}
    >
      <View>
        <Card style={styles.courseCard}>
          <Card.Content>
            <Text style={styles.courseName}>{item.title}</Text>
            <Text style={styles.courseDescription}>{item.description}</Text>
          </Card.Content>
          <Card.Actions>
            <Button
              mode="contained"
              onPress={(e) => {
                e.stopPropagation();
                handleJoinCourse(item.id);
              }}
              style={styles.joinButton}
              labelStyle={{ color: colors.buttonText }}
            >
              Join Course
            </Button>
          </Card.Actions>
        </Card>
      </View>
    </TouchableWithoutFeedback>
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
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          isLoadingMore ? <ActivityIndicator color={colors.primary} /> : null
        }
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
