import { useEffect, useState } from "react";
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

  const [joiningStatus, setJoiningStatus] = useState<
    "idle" | "joining" | "redirecting"
  >("idle");

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
    setJoiningStatus("joining");
    try {
      await enrollInCourse(courseId);
      showSnackbar(
        "Successfully joined the course!",
        SNACKBAR_VARIANTS.SUCCESS
      );

      setJoiningStatus("redirecting");
      setTimeout(() => {
        router.replace(`/course/myCourses`);
      }, 2000);
    } catch (error) {
      handleApiError(error, showSnackbar, "Could not join the course.", logout);
      setJoiningStatus("idle");
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
      <Text style={styles.title}>{course.title}</Text>
      <Text style={styles.description}>{course.description}</Text>
      <View style={styles.divider} />
      {renderSection("Objectives", course.objectives)}
      <View style={styles.divider} />
      {renderSection("Syllabus", course.syllabus)}
      <View style={styles.divider} />

      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.cardTitle}>Teacher Information</Text>

          <View style={styles.teacherInfoContainer}>
            {teacher.banner && (
              <Image
                source={{ uri: teacher.banner }}
                style={styles.bannerImage}
              />
            )}
            <View style={styles.teacherTextContainer}>
              <Text style={styles.sectionText}>
                {teacher.first_name || teacher.last_name
                  ? `${teacher.first_name || ""} ${
                      teacher.last_name || ""
                    }`.trim()
                  : "Unnamed teacher"}
              </Text>
              <Text style={styles.sectionText}>
                {teacher.description?.trim()
                  ? teacher.description
                  : "No information available."}
              </Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.cardTitle}>Correlatives</Text>
          {course.correlatives.length > 0 ? (
            course.correlatives.map(
              (correlative: { id: string; title: string }) => (
                <Text key={correlative.id} style={styles.sectionText}>
                  • {correlative.title}
                </Text>
              )
            )
          ) : (
            <Text style={styles.sectionEmptyText}>
              No prerequisites required.
            </Text>
          )}
        </Card.Content>
      </Card>

      {/* Botón para unirse al curso (solo para alumnos) */}
      {!isEnrolled && (
        <Button
          mode="contained"
          onPress={(e) => {
            e.stopPropagation();
            if (joiningStatus === "idle") {
              handleJoinCourse(course.id);
            }
          }}
          style={styles.joinButton}
          disabled={joiningStatus !== "idle"}
        >
          {joiningStatus === "joining" && <ActivityIndicator color="white" />}
          {joiningStatus === "redirecting" && (
            <Text style={{ color: "white" }}>Redirecting...</Text>
          )}
          {joiningStatus === "idle" && "Join Course"}
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

const renderSection = (title: string, content: string) => {
  const isEmpty = !content?.trim();

  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Text
        style={isEmpty ? styles.sectionEmptyText : styles.sectionText}
      >
        {isEmpty ? "No information available." : content}
      </Text>
    </View>
  );
};
