import { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, ScrollView } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { fetchCourseDetail } from "@services/CourseService"; // Simulación que hicimos
import { findCourseStyles as styles } from "@styles/findCourseStyles";
import { colors } from "@theme/colors";

export default function CourseDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [courseDetail, setCourseDetail] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const loadCourse = async () => {
      try {
        const data = await fetchCourseDetail(id);
        setCourseDetail(data);
      } catch (error) {
        console.error(error);
        router.back();
      } finally {
        setLoading(false);
      }
    };

    loadCourse();
  }, [id]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!courseDetail) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Error loading course</Text>
      </View>
    );
  }

  const { course, teacher } = courseDetail;

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <Text style={styles.title}>{course.title}</Text>
      <Text style={styles.description}>{course.description}</Text>

      <Text style={styles.sectionTitle}>Objectives</Text>
      <Text style={styles.sectionText}>{course.objectives}</Text>

      <Text style={styles.sectionTitle}>Syllabus</Text>
      <Text style={styles.sectionText}>{course.syllabus}</Text>

      <Text style={styles.sectionTitle}>Prerequisites</Text>
      <Text style={styles.sectionText}>{course.prerequisites}</Text>

      <Text style={styles.sectionTitle}>Teacher</Text>
      <Text style={styles.sectionText}>
        {teacher.first_name} {teacher.last_name}
      </Text>
      <Text style={styles.sectionText}>{teacher.email}</Text>
    </ScrollView>
  );
}
