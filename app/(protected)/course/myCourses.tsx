import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, SectionList } from "react-native";
import { useRouter } from "expo-router";
import { getMyCourses, getMyEnrollments } from "@services/CourseService";
import { colors } from "@theme/colors";
import { ApiCourse } from "@src/types/course";
import Tab from "@components/Tab";
import CourseItem from "@components/CourseItem";
import SectionHeader from "@components/SectionHeader";

export default function MyCourses() {
  const router = useRouter();
  const [tab, setTab] = useState<"created" | "enrolled">("created");

  const [createdCourses, setCreatedCourses] = useState<ApiCourse[]>([]);
  const [enrolledCourses, setEnrolledCourses] = useState<ApiCourse[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCreatedCourses = async () => {
    try {
      setLoading(true);
      const data = await getMyCourses(0, 10);
      setCreatedCourses(data.courses);
    } catch (err) {
      alert("Error loading your created courses");
    } finally {
      setLoading(false);
    }
  };

  const fetchEnrolledCourses = async () => {
    try {
      setLoading(true);
      const data = await getMyEnrollments(0, 10);
      setEnrolledCourses(data.courses);
    } catch (err) {
      alert("Error loading your enrolled courses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    tab === "created" ? fetchCreatedCourses() : fetchEnrolledCourses();
  }, [tab]);

  const now = new Date();

  const categorizeCourses = (courses: ApiCourse[]) => {
    const active = courses.filter(
      (c) => new Date(c.startDate) <= now && new Date(c.endDate) >= now
    );
    const upcoming = courses.filter((c) => new Date(c.startDate) > now);
    const finished = courses.filter((c) => new Date(c.endDate) < now);

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
      ) : sections.length === 0 ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
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
    </View>
  );
}
