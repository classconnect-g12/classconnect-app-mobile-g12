import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  SectionList,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { deleteCourse, getMyCourses, markOrUnmarkFavorite, getFavoriteCourses } from "@services/CourseService";
import { getMyEnrollments } from "@services/EnrollmentService";
import { colors } from "@theme/colors";
import { ApiCourse } from "@src/types/course";
import Tab from "@components/Tab";
import CourseItem from "@components/CourseItem";
import SectionHeader from "@components/SectionHeader";
import MyCourseFilter from "@components/MyCoursesFilter";
import { useSnackbar } from "@hooks/useSnackbar";
import { handleApiError } from "@utils/handleApiError";
import { SNACKBAR_VARIANTS } from "@constants/snackbarVariants";
import { useAuth } from "@context/authContext";

export default function MyCourses() {
  const now = new Date();
  const router = useRouter();
  const [tab, setTab] = useState<"created" | "enrolled" | "favorites">("created");

  const { showSnackbar } = useSnackbar();
  const { logout } = useAuth();

  const [createdCourses, setCreatedCourses] = useState<ApiCourse[]>([]);
  const [enrolledCourses, setEnrolledCourses] = useState<ApiCourse[]>([]);
  const [favoriteCourses, setFavoriteCourses] = useState<ApiCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<{
    name: string;
    state: "all" | "active" | "upcoming" | "finished";
  }>({
    name: "",
    state: "all",
  });

  const fetchCreatedCourses = async () => {
    try {
      setLoading(true);
      const data = await getMyCourses(0, 10);
      setCreatedCourses(data.courses);
    } catch (error) {
      handleApiError(
        error,
        showSnackbar,
        "Error loading your created courses",
        logout
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchEnrolledCourses = async () => {
    try {
      setLoading(true);
      const data = await getMyEnrollments(0, 10);
      setEnrolledCourses(data.courses);
    } catch (error) {
      handleApiError(
        error,
        showSnackbar,
        "Error loading your enrolled courses",
        logout
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchFavoriteCourses = async () => {
    try {
      setLoading(true);
      const data = await getFavoriteCourses(0, 10, filters.name);
      setFavoriteCourses(data.courses);
    } catch (error) {
      handleApiError(
        error,
        showSnackbar,
        "Error loading your favorite courses",
        logout
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeletion = (courseId: string) => {
    Alert.alert(
      "Confirm deletion",
      "Are you sure you want to delete this course?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteCourse(courseId);
              showSnackbar(
                "Course deleted successfully",
                SNACKBAR_VARIANTS.SUCCESS
              );
              setCreatedCourses((prev) =>
                prev.filter((course) => course.id !== courseId)
              );
            } catch (error) {
              handleApiError(
                error,
                showSnackbar,
                "An error occurred while deleting the course",
                logout
              );
            }
          },
        },
      ]
    );
  };

  const handleToggleFavorite = async (course: ApiCourse) => {
    try {
      await markOrUnmarkFavorite(course.id, !course.isFavorite);
      setEnrolledCourses((prev) =>
        prev.map((c) =>
          c.id === course.id ? { ...c, isFavorite: !c.isFavorite } : c
        )
      );
      if (tab === "favorites") {
        fetchFavoriteCourses();
      }
    } catch (error) {
      showSnackbar("Error updating favorite", SNACKBAR_VARIANTS.ERROR);
    }
  };

  useEffect(() => {
    if (tab === "created") {
      fetchCreatedCourses();
    } else if (tab === "enrolled") {
      fetchEnrolledCourses();
    } else if (tab === "favorites") {
      fetchFavoriteCourses();
    }
  }, [tab, filters.state]);


  const categorizeCourses = (courses: ApiCourse[]) => {
    const filteredByName = filters.name
      ? courses.filter((c) =>
          c.title.toLowerCase().includes(filters.name.toLowerCase())
        )
      : courses;

    let filtered = filteredByName;

    if (filters.state !== "all") {
      filtered = filteredByName.filter((c) => {
        const start = new Date(c.startDate);
        const end = new Date(c.endDate);
        if (filters.state === "active") return start <= now && end >= now;
        if (filters.state === "upcoming") return start > now;
        if (filters.state === "finished") return end < now;
        return true;
      });
    }

    const active = filtered.filter(
      (c) => new Date(c.startDate) <= now && new Date(c.endDate) >= now
    );
    const upcoming = filtered.filter((c) => new Date(c.startDate) > now);
    const finished = filtered.filter((c) => new Date(c.endDate) < now);

    const sections = [];
    if (active.length) sections.push({ title: "Active", data: active });
    if (upcoming.length) sections.push({ title: "Upcoming", data: upcoming });
    if (finished.length) sections.push({ title: "Finished", data: finished });

    return sections;
  };

  const sections =
    tab === "favorites"
      ? categorizeCourses(favoriteCourses)
      : categorizeCourses(tab === "created" ? createdCourses : enrolledCourses);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Tab
        tab={tab}
        setTab={setTab}
        options={[
          { key: "created", label: "Created" },
          { key: "enrolled", label: "Enrolled" },
          { key: "favorites", label: "Favorites" },
        ]}
      />

      {loading ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <>
          <MyCourseFilter filters={filters} setFilters={setFilters} />
          {sections.length === 0 ? (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={{ color: colors.text, opacity: 0.7 }}>
                {filters.name || filters.state !== "all"
                  ? "No courses found. Try different search terms or filters."
                  : "No courses available"}
              </Text>
            </View>
          ) : (
            <SectionList
              contentContainerStyle={{ padding: 16 }}
              sections={sections}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }: { item: ApiCourse }) => (
                <CourseItem
                  item={item}
                  tab={tab === "favorites" ? "enrolled" : tab}
                  router={router}
                  showActions={tab === "created"}
                  onEdit={() => router.push(`/course/editCourse/${item.id}`)}
                  onDelete={() => {
                    handleDeletion(item.id);
                  }}
                  isFavorite={Boolean(item.isFavorite)}
                  onToggleFavorite={() => handleToggleFavorite(item)}
                />
              )}
              renderSectionHeader={({ section: { title } }) => (
                <SectionHeader title={title} />
              )}
            />
          )}
        </>
      )}
    </View>
  );
}