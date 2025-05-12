import { use, useEffect, useState } from "react";
import { View, Text, ActivityIndicator, ScrollView, Image } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { fetchCourseDetail } from "@services/CourseService";
import { detailCourseStyles as styles } from "@styles/detailCourseStyles";
import { colors } from "@theme/colors";
import { Card, Button } from "react-native-paper";
import { useSnackbar } from "@hooks/useSnackbar";
import { SNACKBAR_VARIANTS } from "@constants/snackbarVariants";
import { handleApiError } from "@utils/handleApiError";
import { enrollInCourse } from "@services/EnrollmentService";
import { AppSnackbar } from "@components/AppSnackbar";
import { useCourse } from "@context/CourseContext";
import { useAuth } from "@context/authContext";

export default function CourseDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const {
    snackbarVisible,
    snackbarMessage,
    snackbarVariant,
    showSnackbar,
    hideSnackbar,
  } = useSnackbar();
  const { logout } = useAuth();

  const router = useRouter();
  const [courseDetail, setCourseDetail] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const isEnrolled = useCourse().isEnrolled;

  useEffect(() => {
    if (!id) return;

    const loadCourse = async () => {
      try {
        const data = await fetchCourseDetail(id);
        setCourseDetail(data);
      } catch (error) {
        handleApiError(
          error,
          showSnackbar,
          "Failed to load course data.",
          logout
        );
        router.back();
      } finally {
        setLoading(false);
      }
    };

    loadCourse();
  }, [id]);

  const handleJoinCourse = async (courseId: string) => {
    try {
      await enrollInCourse(courseId);
      showSnackbar(
        "Successfully joined the course!",
        SNACKBAR_VARIANTS.SUCCESS
      );
    } catch (error) {
      handleApiError(error, showSnackbar, "Could not join the course.", logout);
    }
  };

  if (loading) {
    return (
      <View>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!courseDetail) {
    return (
      <View>
        <Text>Course not found.</Text>
      </View>
    );
  }

  const { course, teacher } = courseDetail;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {teacher.banner ? (
        <View style={styles.bannerContainer}>
          <Image source={{ uri: teacher.banner }} style={styles.bannerImage} />
        </View>
      ) : null}

      <Text style={styles.title}>{course.title}</Text>

      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.cardTitle}>Course Description</Text>
          <Text style={styles.description}>{course.description}</Text>
        </Card.Content>
      </Card>

      {renderSection("Objectives", course.objectives)}
      {renderSection("Syllabus", course.syllabus)}
      {course.correlatives.length > 0 && (
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.cardTitle}>Correlatives</Text>
            {course.correlatives.map((correlative: { id: string; title: string }) => (
              <Text key={correlative.id} style={styles.sectionText}>
                • {correlative.title}
              </Text>
            ))}
          </Card.Content>
        </Card>
      )}

      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.cardTitle}>Teacher Information</Text>
          <Text style={styles.sectionText}>
            {teacher.first_name} {teacher.last_name}
          </Text>
          <Text style={styles.sectionText}>{teacher.email}</Text>
          <Text style={styles.sectionText}>{teacher.description}</Text>
        </Card.Content>
      </Card>

      {/* Botón para unirse al curso (solo para alumnos) */}
      {!isEnrolled && (
        <Button
          mode="contained"
          onPress={(e) => {
            e.stopPropagation();
            handleJoinCourse(course.id);
          }}
          style={styles.joinButton}
        >
          Join Course
        </Button>
      )}

      <AppSnackbar
        visible={snackbarVisible}
        message={snackbarMessage}
        onDismiss={hideSnackbar}
        variant={snackbarVariant}
      />
    </ScrollView>
  );
}

const renderSection = (title: string, content: string) => (
  <View style={styles.sectionContainer}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <Text style={styles.sectionText}>{content}</Text>
  </View>
);
