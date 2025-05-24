import { useEffect, useState } from "react";
import {
  ScrollView,
  TextInput,
  Alert,
  Image,
  View,
  TouchableOpacity,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { Text, Button, ActivityIndicator, Card } from "react-native-paper";
import { handleApiError } from "@utils/handleApiError";
import { useAuth } from "@context/authContext";
import { useSnackbar } from "@context/SnackbarContext";
import {
  completeAssessment,
  getAssessmentById,
} from "@services/AssessmentService";
import { useRouter } from "expo-router";

type Props = {
  courseId: string;
  assessmentId: string;
};

export default function AssessmentSubmissionScreen({
  courseId,
  assessmentId,
}: Props) {
  const { logout } = useAuth();
  const { showSnackbar } = useSnackbar();
  const router = useRouter();

  const [assessment, setAssessment] = useState<any>(null);
  const [answers, setAnswers] = useState<{ [questionId: number]: string }>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchAssessment = async () => {
      try {
        const data = await getAssessmentById(courseId, assessmentId);
        console.log(data);

        setAssessment(data);
        const initialAnswers: { [id: number]: string } = {};
        data.questions.forEach((q: any) => {
          initialAnswers[q.id] = "";
        });
        setAnswers(initialAnswers);
      } catch (error) {
        handleApiError(error, showSnackbar, "Error loading assessment", logout);
      } finally {
        setLoading(false);
      }
    };

    fetchAssessment();
  }, [assessmentId, courseId]);

  const handleAnswerChange = (questionId: number, text: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: text }));
  };

  const handleFilePick = async (questionId: number) => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*",
        copyToCacheDirectory: true,
      });

      if (result.assets?.length) {
        const fileUri = result.assets[0].uri;
        setAnswers((prev) => ({ ...prev, [questionId]: fileUri }));
      }
    } catch (error) {
      showSnackbar("Error picking file", "error");
    }
  };

  const handleSubmit = async () => {
    if (!assessment.availableForSubmission) {
      Alert.alert(
        "Submission not allowed",
        "This assessment is no longer available."
      );
      return;
    }

    const missing = assessment.questions.some((q: any) => {
      const a = answers[q.id];
      return q.type === "FILE_ATTACHMENT" ? !a : !a?.trim?.();
    });

    if (missing) {
      Alert.alert("Missing answers", "Please answer all questions.");
      return;
    }

    const {
      remainingMinutes,
      gracePeriodMinutes = 0,
      allowLateSubmission,
    } = assessment;
    const isLate = remainingMinutes < 0;
    const isOutsideGrace = remainingMinutes < -gracePeriodMinutes;

    if (isOutsideGrace && !allowLateSubmission) {
      Alert.alert("Submission not allowed", "Deadline has passed.");
      return;
    }

    Alert.alert(
      "Confirm submission",
      isLate
        ? `You are submitting late. A penalty of ${assessment.latePenaltyPercentage}% will apply. Continue?`
        : "Do you want to submit your answers?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Submit",
          onPress: async () => {
            try {
              setSubmitting(true);
              await completeAssessment(
                assessment.id,
                assessment.questions,
                answers
              );
              showSnackbar("Assessment submitted successfully", "success");
              setTimeout(() => router.back(), 1500);
            } catch (error) {
              handleApiError(
                error,
                showSnackbar,
                "Error submitting answers",
                logout
              );
            } finally {
              setSubmitting(false);
            }
          },
        },
      ]
    );
  };

  if (loading) return <ActivityIndicator style={{ marginTop: 32 }} />;
  if (!assessment)
    return <Text style={{ padding: 16 }}>Assessment not found.</Text>;

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Card style={{ padding: 16, marginBottom: 16 }}>
        <Text variant="titleMedium">{assessment.title}</Text>
        <Text>Instructions: {assessment.instructions}</Text>
        <Text>Deadline: {new Date(assessment.startDate).toLocaleString()}</Text>
      </Card>

      {assessment.questions.map((question: any, index: number) => (
        <Card key={question.id} style={{ padding: 12, marginBottom: 16 }}>
          <Text style={{ fontWeight: "bold" }}>
            {index + 1}. {question.text}
          </Text>

          {question.imageUrl && (
            <Image
              source={{ uri: question.imageUrl }}
              style={{ width: "100%", height: 180, marginVertical: 12 }}
              resizeMode="contain"
            />
          )}

          {question.type === "WRITTEN_ANSWER" && (
            <TextInput
              placeholder="Written answer..."
              multiline
              numberOfLines={4}
              value={answers[question.id]}
              onChangeText={(text) => handleAnswerChange(question.id, text)}
              style={{
                borderColor: "#ccc",
                borderWidth: 1,
                borderRadius: 8,
                padding: 10,
                textAlignVertical: "top",
              }}
            />
          )}

          {question.type === "MULTIPLE_CHOICE" &&
            question.options?.length > 0 && (
              <View style={{ marginTop: 8 }}>
                {question.options.map((option: string, i: number) => {
                  const selected = answers[question.id] === option;
                  return (
                    <TouchableOpacity
                      key={i}
                      onPress={() => handleAnswerChange(question.id, option)}
                      style={{
                        padding: 10,
                        marginBottom: 6,
                        borderRadius: 8,
                        borderWidth: 1,
                        borderColor: selected ? "#6200ee" : "#ccc",
                        backgroundColor: selected ? "#e3d7fc" : "#fff",
                      }}
                    >
                      <Text style={{ color: selected ? "#6200ee" : "#000" }}>
                        {option}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}

          {question.type === "FILE_ATTACHMENT" && (
            <View>
              <Button
                mode="outlined"
                onPress={() => handleFilePick(question.id)}
                style={{ marginTop: 8 }}
              >
                Select file
              </Button>
              <Text
                style={{
                  marginTop: 4,
                  fontStyle: "italic",
                  color: answers[question.id] ? "green" : "gray",
                }}
              >
                {answers[question.id]
                  ? `File selected: ${answers[question.id].split("/").pop()}`
                  : "No file selected."}
              </Text>
            </View>
          )}
        </Card>
      ))}

      <Button
        mode="contained"
        onPress={handleSubmit}
        loading={submitting}
        disabled={submitting}
      >
        Submit answers
      </Button>
    </ScrollView>
  );
}
