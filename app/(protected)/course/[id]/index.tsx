import { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, ScrollView, Image } from "react-native";
import { useRouter } from "expo-router";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { isSendFeedback } from "@services/CourseService";
import { detailCourseStyles as styles } from "@styles/detailCourseStyles";
import { colors } from "@theme/colors";
import {
  Card,
  Button,
  Portal,
  Dialog,
  IconButton,
  TextInput,
} from "react-native-paper";
import { useSnackbar } from "@context/SnackbarContext";
import { SNACKBAR_VARIANTS } from "@constants/snackbarVariants";
import { handleApiError } from "@utils/handleApiError";
import { enrollInCourse } from "@services/EnrollmentService";
import { useCourse } from "@context/CourseContext";
import { useAuth } from "@context/authContext";
import { sendFeedbackStudentToCourse } from "@services/feedbackService";

const FINISHED_COURSE_STATUS = "FINISHED";

export default function CourseDetail() {
  const { courseId, courseStatus, courseDetail, isLoading } = useCourse();

  const { showSnackbar } = useSnackbar();
  const { logout, userId } = useAuth();

  const router = useRouter();

  const [joiningStatus, setJoiningStatus] = useState<
    "idle" | "joining" | "redirecting"
  >("idle");

  const isEnrolled = useCourse().isEnrolled;

  const [sendFeedback, setSendFeedback] = useState(false);
  const [feedbackModalVisible, setFeedbackModalVisible] = useState(false);
  const [feedbackComment, setFeedbackComment] = useState("");
  const [feedbackRating, setFeedbackRating] = useState(0);
  const [sendingFeedback, setSendingFeedback] = useState(false);
  const [feedbackTarget] = useState<any>(courseId);
  const [isLoadingFeedback, setIsLoadingFeedback] = useState(false);

  const confirmSendFeedback = async () => {
    if (!courseId) {
      showSnackbar("Course ID is missing.", SNACKBAR_VARIANTS.ERROR);
      return;
    }
    if (!feedbackComment.trim()) {
      showSnackbar("Please enter a comment.", SNACKBAR_VARIANTS.ERROR);
      return;
    }
    if (feedbackRating < 1 || feedbackRating > 5) {
      showSnackbar("Please select a rating between 1 and 5.", SNACKBAR_VARIANTS.ERROR);
      return;
    }
    try {
      setSendingFeedback(true);
      await sendFeedbackStudentToCourse(
        courseId,
        feedbackComment,
        feedbackRating
      );
      showSnackbar("Feedback sent!", SNACKBAR_VARIANTS.SUCCESS);
      setSendFeedback(true);
      setFeedbackModalVisible(false);
    } catch (error) {
      handleApiError(error, showSnackbar, "Could not send feedback.", logout);
    } finally {
      setSendingFeedback(false);
    }
  };

  useEffect(() => {
    if (!courseId || sendFeedback) return;

    const loadFeedback = async () => {
      setIsLoadingFeedback(true);
      try {
        if (
          courseStatus === FINISHED_COURSE_STATUS &&
          !courseDetail?.course?.isTeacher &&
          courseDetail?.course?.isEnrolled
        ) {
          if (!courseId || !userId) return;
          const result = await isSendFeedback(courseId, userId);
          setSendFeedback(result.sent);
        }
      } catch (error) {
        handleApiError(
          error,
          showSnackbar,
          "Failed to load course data.",
          logout
        );
        router.back();
      } finally {
        setIsLoadingFeedback(false);
      }
    };

    loadFeedback();
  }, [courseId, courseStatus, courseDetail, userId]);

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

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
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
      {courseStatus === FINISHED_COURSE_STATUS &&
        course.isEnrolled &&
        !course.isTeacher && (
          <View style={styles.feedbackContainer}>
            <View style={styles.iconTitleRow}>
              <Icon
                name="information-outline"
                size={24}
                color={colors.success}
              />
              <Text style={styles.finishedTitle}>Course Finished</Text>
            </View>
            <Text style={styles.finishedMessage}>
              This course has ended. You can still revisit its modules and
              resources to reinforce what you've learned or review any topic at
              your own pace.
            </Text>

            {isLoadingFeedback && (
              <ActivityIndicator
                size="small"
                color={colors.primary}
                style={{ marginTop: 8 }}
              />
            )}

            {!isLoadingFeedback && !sendFeedback && (
              <Button
                mode="contained"
                icon="message-text-outline"
                onPress={() => setFeedbackModalVisible(true)}
                style={styles.feedbackButton}
                labelStyle={styles.feedbackButtonLabel}
              >
                Send Feedback
              </Button>
            )}
          </View>
        )}

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
      {!isEnrolled && courseStatus !== FINISHED_COURSE_STATUS && (
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

      {/* Feedback Modal */}
      <Portal>
        <Dialog
          visible={feedbackModalVisible}
          onDismiss={() => setFeedbackModalVisible(false)}
          style={styles.confirmModalBox}
        >
          <Dialog.Title>
            Send feedback
          </Dialog.Title>
          <Dialog.Content>
            <TextInput
              mode="outlined"
              label="Comment"
              value={feedbackComment}
              maxLength={255}
              onChangeText={setFeedbackComment}
              multiline
              outlineColor="transparent"
              activeOutlineColor={colors.primary}
              style={{
                marginBottom: 10,
                backgroundColor: "white",
                borderTopWidth: 0,
                borderLeftWidth: 0,
                borderRightWidth: 0,
                borderBottomWidth: 1,
              }}
            />

            <View style={{ flexDirection: "row", marginBottom: 8 }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <IconButton
                  key={star}
                  icon={feedbackRating >= star ? "star" : "star-outline"}
                  iconColor="#fbc02d"
                  size={28}
                  onPress={() => setFeedbackRating(star)}
                />
              ))}
            </View>
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              onPress={() => setFeedbackModalVisible(false)}
              style={styles.cancelButton}
            >
              Cancel
            </Button>
            <Button
              mode="contained"
              onPress={confirmSendFeedback}
              disabled={sendingFeedback}
              loading={sendingFeedback}
              style={styles.confirmButton}
            >
              Send
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </ScrollView>
  );
}

const renderSection = (title: string, content: string) => {
  const isEmpty = !content?.trim();

  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Text style={isEmpty ? styles.sectionEmptyText : styles.sectionText}>
        {isEmpty ? "No information available." : content}
      </Text>
    </View>
  );
};
