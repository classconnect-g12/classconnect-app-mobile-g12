import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, SectionList } from "react-native";
import { useRouter } from "expo-router";
import { getMyCourses } from "@services/CourseService";
import { getMyEnrollments } from "@services/EnrollmentService";
import { colors } from "@theme/colors";
import { ApiCourse } from "@src/types/course";
import Tab from "@components/Tab";
import CourseItem from "@components/CourseItem";
import SectionHeader from "@components/SectionHeader";
import CourseFilter from "@components/CourseFilter";
import { SNACKBAR_VARIANTS } from "@constants/snackbarVariants";
import { useSnackbar } from "@hooks/useSnackbar";
import { ApiError } from "@src/types/apiError";
import { handleApiError } from "@utils/handleApiError";

export default function MyCourses() {
  const router = useRouter();
  const [tab, setTab] = useState<"created" | "enrolled">("created");

  const { showSnackbar } = useSnackbar();

  const [createdCourses, setCreatedCourses] = useState<ApiCourse[]>([]);
  const [enrolledCourses, setEnrolledCourses] = useState<ApiCourse[]>([]);
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
      handleApiError(error, showSnackbar, "Error loading your created courses");
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
        "Error loading your enrolled courses"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    tab === "created" ? fetchCreatedCourses() : fetchEnrolledCourses();
  }, [tab]);

  const now = new Date();

  const categorizeCourses = (courses: ApiCourse[]) => {
    const filteredByName = filters.name
      ? courses.filter((c) =>
          c.title.toLowerCase().includes(filters.name.toLowerCase())
        )
      : courses;

    const now = new Date();

    let filtered = filteredByName;

    if (filters.state !== "all") {
      filtered = filteredByName.filter((c) => {
        const start = new Date(c.startDate);
        const end = new Date(c.endDate);
        if (filters.state === "active") return start <= now && end >= now;
        if (filters.state === "upcoming") return start > now;
        if (filters.state === "finished") return end < now;
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

  const sections = categorizeCourses(
    tab === "created" ? createdCourses : enrolledCourses
  );

  return (
    <View style={{ flex: 1 }}>
      <Tab tab={tab} setTab={setTab} />

      {loading ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <>
          <CourseFilter filters={filters} setFilters={setFilters} />
          {sections.length === 0 ? (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text>No courses found</Text>
            </View>
          ) : (
            <SectionList
              contentContainerStyle={{ padding: 16 }}
              sections={sections}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }: { item: ApiCourse }) => (
                <CourseItem item={item} tab={tab} router={router} />
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
