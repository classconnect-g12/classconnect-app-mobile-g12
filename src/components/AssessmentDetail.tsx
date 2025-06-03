import { ScrollView, View, Alert } from "react-native";
import { Text, Card, Button } from "react-native-paper";
import Spinner from "@components/Spinner";
import { colors } from "@theme/colors";
import { router } from "expo-router";
import { useCourse } from "@context/CourseContext";
import { useEffect, useState } from "react";
import { toggleAssessmentVisibility } from "@services/AssessmentService";
import { handleDownload } from "@utils/downloadAssessment";

const SUBMISSION_STATUS = {
  GRADED: "GRADED",
  PENDING_REVIEW: "PENDING_REVIEW",
  LATE_SUBMISSION: "LATE_SUBMISSION",
  SUBMITTED: "SUBMITTED",
};

const STATUS_LABELS: Record<string, string> = {
  [SUBMISSION_STATUS.GRADED]: "Graded",
  [SUBMISSION_STATUS.PENDING_REVIEW]: "Pending Review",
  [SUBMISSION_STATUS.LATE_SUBMISSION]: "Late Submission",
  [SUBMISSION_STATUS.SUBMITTED]: "Submitted",
};

export default function AssessmentDetail({
  assessment,
  assessmentId,
  loading,
  typeAssessment,
}: {
  assessment: any;
  assessmentId: string;
  loading: boolean;
  typeAssessment: string;
}) {
  const { courseId } = useCourse();
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (assessment?.isVisible) {
      setIsVisible(assessment.isVisible);
    }
  }, [assessment]);

  useEffect(() => {
    if (assessment?.submissions) {
      setSubmissions(assessment.submissions);
    }
  }, [assessment]);

  const handleToggleVisibility = async (
    assessmentId: string,
    visible: boolean
  ) => {
    try {
      await toggleAssessmentVisibility(assessmentId, !visible);
      setIsVisible(!visible);
    } catch (err) {
      Alert.alert("Error", "Could not change visibility.");
    }
  };

  if (loading) return <Spinner />;

  if (!assessment || submissions.length === 0) {
    return (
      <View style={{ padding: 32, backgroundColor: "white", flex: 1 }}>
        <Text
          style={{
            fontStyle: "italic",
            color: "#888",
            fontSize: 16,
            textAlign: "center",
          }}
        >
          No submissions found.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={{ padding: 16, backgroundColor: "white", flex: 1 }}
    >
      {submissions.map((sub: any, index: number) => {
        const status = sub.status;
        const user = sub.userProfile;
        const submissionDate = new Date(sub.submissionTime);

        const isLate =
          status === SUBMISSION_STATUS.LATE_SUBMISSION ||
          (assessment.endDate && submissionDate > new Date(assessment.endDate));

        return (
          <Card
            key={`${sub.studentId}-${sub.submissionTime}`}
            style={{
              padding: 16,
              borderRadius: 8,
              marginBottom: 16,
              backgroundColor: "white",
            }}
          >
            <Text style={{ fontWeight: "bold", fontSize: 18, marginBottom: 8 }}>
              🧑‍🎓 {user.first_name} {user.last_name} ({user.user_name})
            </Text>

            <Text style={{ fontSize: 16, marginBottom: 6 }}>
              <Text style={{ fontWeight: "bold" }}>Submitted: </Text>
              {submissionDate.toLocaleString()}
            </Text>

            {isLate && (
              <Text
                style={{
                  color: "red",
                  fontWeight: "bold",
                  fontSize: 16,
                  marginBottom: 6,
                }}
              >
                ⚠️ Late Submission
              </Text>
            )}

            <Text style={{ fontSize: 16, marginBottom: 6 }}>
              <Text style={{ fontWeight: "bold" }}>Status: </Text>
              {STATUS_LABELS[status] ?? "Unknown"}
            </Text>

            {status === SUBMISSION_STATUS.GRADED && (
              <Text style={{ fontSize: 16, marginBottom: 6 }}>
                <Text style={{ fontWeight: "bold" }}>Score: </Text>
                {sub.score}
              </Text>
            )}

            {status === SUBMISSION_STATUS.PENDING_REVIEW || status == SUBMISSION_STATUS.GRADED && (
              <View
                style={{
                  marginTop: 10,
                  flexDirection: "row",
                  overflow: "hidden",
                }}
              >
                <Button
                  mode="contained"
                  style={{
                    flex: 1,
                    borderTopRightRadius: 0,
                    borderBottomRightRadius: 0,
                    borderRadius: 6,
                    backgroundColor: "#2ECC71",
                  }}
                  labelStyle={{ color: "white" }}
                  onPress={() =>
                    handleDownload(sub.assessmentId, sub.studentId)
                  }
                >
                  Download
                </Button>
                <Button
                  mode="contained"
                  style={{
                    flex: 1,
                    borderTopLeftRadius: 0,
                    borderBottomLeftRadius: 0,
                    borderRadius: 6,
                    backgroundColor: colors.secondary,
                  }}
                  labelStyle={{ color: "white" }}
                  onPress={() => {
                    router.push(
                      `/course/${courseId}/${typeAssessment}/view/${sub.assessmentId}/${sub.studentId}`
                    );
                  }}
                >
                  Review
                </Button>
              </View>
            )}
          </Card>
        );
      })}
      <Button
        icon={isVisible ? "eye-off" : "eye"}
        style={{ borderRadius: 6, backgroundColor: colors.secondary }}
        mode="contained"
        onPress={() => {
          if (assessmentId) {
            handleToggleVisibility(assessmentId, isVisible);
          }
        }}
      >
        {isVisible ? "Unpublish Feedback" : "Publish Feedback"}
      </Button>
    </ScrollView>
  );
}
