import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  TouchableWithoutFeedback,
  ActivityIndicator,
} from "react-native";
import { TextInput, Button, Card } from "react-native-paper";
import { router } from "expo-router";
import { colors } from "@theme/colors";
import { findCourseStyles as styles } from "@styles/findCourseStyles";
import { useSnackbar } from "@context/SnackbarContext";
import { fetchCourses } from "@services/CourseService";
import { ApiCourse } from "@src/types/course";
import { handleApiError } from "@utils/handleApiError";
import CourseFilter from "@components/CourseFilter";
import { useAuth } from "@context/authContext";
import Spinner from "@components/Spinner";

export default function FindCourse() {
  const [searchQuery, setSearchQuery] = useState("");
  const [courses, setCourses] = useState<ApiCourse[]>([]);
  const [isLoadingInitial, setIsLoadingInitial] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [dateFilter, setDateFilter] = useState<
    "all" | "active" | "upcoming" | "finished"
  >("all");

  const { logout } = useAuth();

  const { showSnackbar } = useSnackbar();

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

      // Fetch courses with title filter if searchQuery exists
      const response = await fetchCourses(pageNumber, 10, {
        title: searchQuery,
      });

      // Apply client-side filtering
      let filteredCourses = response.courses.filter((course) => {
        // Filter by availability
        if (!course.available) return false;

        // Filter by searchQuery in description (since backend only filters title)
        if (searchQuery) {
          return (
            course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            course.description.toLowerCase().includes(searchQuery.toLowerCase())
          );
        }
        return true;
      });

      // Apply date filter
      if (dateFilter !== "all") {
        const now = new Date();
        filteredCourses = filteredCourses.filter((course) => {
          const start = new Date(course.startDate);
          const end = new Date(course.endDate);
          if (dateFilter === "active") return start <= now && end >= now;
          if (dateFilter === "upcoming") return start > now;
          if (dateFilter === "finished") return end < now;
          return true;
        });
      }

      setCourses((prev) =>
        pageNumber === 0 ? filteredCourses : [...prev, ...filteredCourses]
      );
      setTotalPages(response.pagination.totalPages);
    } catch (error) {
      handleApiError(error, showSnackbar, "Error fetching courses", logout);
    } finally {
      if (pageNumber === 0) {
        setIsLoadingInitial(false);
      } else {
        setIsLoadingMore(false);
      }
    }
  };

  useEffect(() => {
    loadCourses(0, true);
  }, [dateFilter]);

  const handleSearch = () => {
    setIsSearching(true);
    loadCourses(0, true).finally(() => setIsSearching(false));
  };

  const loadMore = () => {
    if (!isSearching && !isLoadingMore && page + 1 < totalPages) {
      const nextPage = page + 1;
      loadCourses(nextPage);
      setPage(nextPage);
    }
  };

  const renderCourse = ({ item }: { item: ApiCourse }) => {
    // Check for limited capacity (5 or fewer spots)
    const isLimitedCapacity = item.capacity <= 5;
    // Check if course is about to start (within 3 days)
    const now = new Date();
    const startDate = new Date(item.startDate);
    const endDate = new Date(item.endDate);
    const daysUntilStart =
      (startDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
    const isStartingSoon = daysUntilStart <= 3 && daysUntilStart >= 0;
    const hasStarted = startDate < now;
    const hasEnded = endDate < now;

    return (
      <TouchableWithoutFeedback
        onPress={() => router.push(`/course/${item.id}` as any)}
      >
        <View>
          <Card style={styles.courseCard}>
            <Card.Content>
              <Text style={styles.courseName}>{item.title}</Text>
              <Text style={styles.courseDescription}>{item.description}</Text>
              <Text style={styles.courseDetails}>
                Starts: {new Date(item.startDate).toLocaleDateString()} | Ends:{" "}
                {new Date(item.endDate).toLocaleDateString()}
              </Text>
              {isLimitedCapacity && (
                <Text style={styles.limitIndicator}>
                  Limited spots remaining
                </Text>
              )}
              {isStartingSoon && (
                <Text style={styles.limitIndicator}>
                  Last days to register
                </Text>
              )}
              {hasEnded ? (
                <Text style={styles.finishIndicator}>Finished</Text>
              ) : hasStarted ? (
                <Text style={styles.availabilityIndicator}>
                  Already started
                </Text>
              ) : null}
            </Card.Content>
            <Card.Actions>
              <Button
                mode="contained"
                onPress={(e) => {
                  e.stopPropagation();
                  router.push(`/course/${item.id}` as any);
                }}
                style={styles.joinButton}
                labelStyle={{ color: colors.buttonText }}
              >
                View course
              </Button>
            </Card.Actions>
          </Card>
        </View>
      </TouchableWithoutFeedback>
    );
  };

  if (isLoadingInitial) {
    return <Spinner />;
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View>
        <Text style={styles.subtitle}>Search for courses to join</Text>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          label="Search by Title or Description"
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
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

      <CourseFilter dateFilter={dateFilter} setDateFilter={setDateFilter} />

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
            {searchQuery || dateFilter !== "all"
              ? "No courses found. Try different search terms or filters."
              : "Search for courses to join"}
          </Text>
        )}
      />
    </KeyboardAvoidingView>
  );
}
