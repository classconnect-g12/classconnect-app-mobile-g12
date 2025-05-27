import { ScrollView, View, Alert } from "react-native";
import { Text, Card, Button } from "react-native-paper";
import Spinner from "@components/Spinner";
import { colors } from "@theme/colors";
import { router } from "expo-router";
import { useCourse } from "@context/CourseContext";
import { useState } from "react";
import axios from "axios";
import { toggleAssessmentVisibility } from "@services/AssessmentService";

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
  loading,
  typeAssessment,
}: {
  assessment: any;
  loading: boolean;
  typeAssessment: string;
}) {
  const { courseId } = useCourse();
  const [submissions, setSubmissions] = useState(assessment?.submissions || []);

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

  const handleToggleVisibility = async (
    assessmentId: string,
    visible: boolean,
    index: number
  ) => {
    try {
      await toggleAssessmentVisibility(assessmentId, !visible);

      const updated = [...submissions];
      updated[index].visible = !visible;
      setSubmissions(updated);
    } catch (err) {
      Alert.alert("Error", "Could not change visibility.");
    }
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
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

            {status === SUBMISSION_STATUS.PENDING_REVIEW && (
              <View style={{ marginTop: 10 }}>
                <Button
                  style={{
                    borderRadius: 6,
                    backgroundColor: colors.primary,
                    marginBottom: 8,
                  }}
                  mode="contained"
                  onPress={() => {
                    router.push(
                      `/course/${courseId}/${typeAssessment}/view/${sub.assessmentId}/${sub.studentId}`
                    );
                  }}
                >
                  Review Submission
                </Button>
              </View>
            )}

            <Button
              style={{ borderRadius: 6, backgroundColor: colors.secondary }}
              mode="contained"
              onPress={() =>
                handleToggleVisibility(sub.assessmentId, sub.visible, index)
              }
            >
              {sub.visible ? "Make Invisible" : "Make Visible"}
            </Button>
          </Card>
        );
      })}
    </ScrollView>
  );
}
