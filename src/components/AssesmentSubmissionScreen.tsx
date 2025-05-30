import { useEffect, useState } from "react";
import {
  ScrollView,
  TextInput,
  Alert,
  Image,
  View,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { Text, Button, Card } from "react-native-paper";
import { handleApiError } from "@utils/handleApiError";
import { useAuth } from "@context/authContext";
import { useSnackbar } from "@context/SnackbarContext";
import {
  completeAssessment,
  getAssessmentById,
} from "@services/AssessmentService";
import { useRouter } from "expo-router";
import Spinner from "./Spinner";
import { colors } from "@theme/colors";

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
  const [timeLeft, setTimeLeft] = useState<{
    minutes: number;
    seconds: number;
  }>({
    minutes: 0,
    seconds: 0,
  });

  const calculateRemainingTime = (endTime: number) => {
    const diff = Math.max(0, endTime - Date.now());
    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    return { minutes, seconds };
  };

  useEffect(() => {
    if (!assessment) return;

    const durationMs = assessment.remainingMinutes * 60000;
    const endTime = Date.now() + durationMs;

    const interval = setInterval(() => {
      const { minutes, seconds } = calculateRemainingTime(endTime);
      setTimeLeft({ minutes, seconds });

      if (minutes === 0 && seconds === 0) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [assessment]);

  useEffect(() => {
    const fetchAssessment = async () => {
      try {
        const data = await getAssessmentById(courseId, assessmentId);
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

  if (loading) return <Spinner />;
  if (!assessment)
    return (
      <Text>
        The assignment or exam is not available yet.
      </Text>
    );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card style={styles.card}>
        <Text variant="titleLarge" style={styles.title}>
          {assessment.title}
        </Text>

        <Text style={styles.text}>
          <Text style={styles.label}>Instructions:</Text>{" "}
          {assessment.instructions}
        </Text>

        <Text style={styles.text}>
          <Text style={styles.label}>Start:</Text>{" "}
          {new Date(assessment.startDate).toLocaleString()}
        </Text>

        <Text style={styles.timer}>
          ⏳ Time remaining: {timeLeft.minutes.toString().padStart(2, "0")}:
          {timeLeft.seconds.toString().padStart(2, "0")}
        </Text>
      </Card>

      {assessment.questions.map((question: any, index: number) => (
        <Card key={question.id} style={styles.questionCard}>
          <Text style={styles.questionText}>
            {index + 1}. {question.text}
          </Text>

          {question.imageUrl && (
            <Image
              source={{ uri: question.imageUrl }}
              style={styles.image}
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
              style={styles.input}
            />
          )}

          {question.type === "MULTIPLE_CHOICE" &&
            question.options?.length > 0 && (
              <View style={styles.optionsContainer}>
                {question.options.map((option: string, i: number) => {
                  const selected = answers[question.id] === option;
                  const letter = String.fromCharCode(65 + i);
                  return (
                    <TouchableOpacity
                      key={i}
                      onPress={() => handleAnswerChange(question.id, option)}
                      style={[
                        styles.optionButton,
                        selected && {
                          backgroundColor: colors.secondary,
                          borderColor: "#fff",
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.optionText,
                          selected && { color: "white", fontWeight: "bold" },
                        ]}
                      >
                        {letter}. {option}
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
                style={[
                  styles.fileStatus,
                  { color: answers[question.id] ? "green" : "gray" },
                ]}
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
        style={styles.submitButton}
      >
        Submit answers
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  card: {
    padding: 16,
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: "#f9f9f9",
    elevation: 2,
  },
  title: {
    marginBottom: 8,
    fontWeight: "bold",
    color: "#333",
  },
  text: {
    marginBottom: 6,
    color: "#555",
  },
  label: {
    fontWeight: "600",
  },
  timer: {
    marginTop: 12,
    fontWeight: "bold",
    fontSize: 16,
    color: "#d32f2f",
  },
  message: {
    padding: 16,
  },
  questionCard: {
    padding: 12,
    marginBottom: 16,
  },
  questionText: {
    fontWeight: "bold",
  },
  image: {
    width: "100%",
    height: 180,
    marginVertical: 12,
  },
  input: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    textAlignVertical: "top",
  },
  optionsContainer: {
    marginTop: 8,
  },
  optionButton: {
    padding: 10,
    marginBottom: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
  },
  optionText: {
    color: "#000",
  },
  fileStatus: {
    marginTop: 4,
    fontStyle: "italic",
  },
  submitButton: {
    backgroundColor: colors.primary,
    borderColor: "white",
    borderRadius: 6,
    marginTop: 16,
  },
});
