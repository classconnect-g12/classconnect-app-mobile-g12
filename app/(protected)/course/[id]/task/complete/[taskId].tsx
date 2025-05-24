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
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  getAssessmentById,
  completeAssessment,
} from "@services/AssessmentService";
import { handleApiError } from "@utils/handleApiError";
import { useAuth } from "@context/authContext";
import { useSnackbar } from "@context/SnackbarContext";

export default function CompleteTaskScreen() {
  const { id, taskId } = useLocalSearchParams<{ taskId: string; id: string }>();
  const { logout } = useAuth();
  const { showSnackbar } = useSnackbar();
  const router = useRouter();

  const [task, setTask] = useState<any>(null);
  const [answers, setAnswers] = useState<{ [questionId: number]: string }>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const data = await getAssessmentById(id as string, taskId);
        setTask(data);
        const initialAnswers: { [id: number]: string } = {};
        data.questions.forEach((q: any) => {
          initialAnswers[q.id] = "";
        });
        setAnswers(initialAnswers);
      } catch (error) {
        handleApiError(error, showSnackbar, "Error loading task", logout);
      } finally {
        setLoading(false);
      }
    };

    if (taskId && id) {
      fetchTask();
    }
  }, [taskId, id]);

  const handleAnswerChange = (questionId: number, text: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: text }));
  };

  const handleFilePick = async (questionId: number) => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*",
        copyToCacheDirectory: true,
      });

      if (result.assets && result.assets.length > 0) {
        const fileUri = result.assets[0].uri;
        setAnswers((prev) => ({ ...prev, [questionId]: fileUri }));
      }
    } catch (error) {
      showSnackbar("Error al seleccionar el archivo", "error");
    }
  };

  const handleSubmit = async () => {
    if (!task.availableForSubmission) {
      Alert.alert(
        "Submission not allowed",
        "This task is no longer available for submission."
      );
      return;
    }
    const emptyAnswers = task.questions.some((q: any) => {
      const answer = answers[q.id];
      if (q.type === "FILE_ATTACHMENT") {
        return !answer;
      } else {
        return !answer || !answer.trim();
      }
    });

    if (emptyAnswers) {
      Alert.alert(
        "Missing answers",
        "Please complete all questions before submitting."
      );
      return;
    }

    const remainingMinutes = task.remainingMinutes;
    const graceMinutes = task.gracePeriodMinutes ?? 0;

    const isOutsideGracePeriod = remainingMinutes < -graceMinutes;
    const isLate = remainingMinutes < 0;

    if (isOutsideGracePeriod && !task.allowLateSubmission) {
      Alert.alert(
        "Submission not allowed",
        "The deadline has passed and late submissions are not allowed, even with grace period."
      );
      return;
    }

    const confirmMessage = isLate
      ? `You are submitting late. A penalty of ${task.latePenaltyPercentage}% will be applied. Do you want to continue?`
      : "Do you want to submit your answers?";

    Alert.alert("Confirm submission", confirmMessage, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Submit",
        onPress: async () => {
          try {
            setSubmitting(true);
            await completeAssessment(task.id, task.questions, answers);
            showSnackbar("Answers submitted successfully", "success");

            setTimeout(() => {
              router.back();
            }, 1500);
          } catch (error) {
            handleApiError(
              error,
              showSnackbar,
              "Error submitting your answers",
              logout
            );
          } finally {
            setSubmitting(false);
          }
        },
      },
    ]);
  };

  if (loading) return <ActivityIndicator style={{ marginTop: 32 }} />;

  if (!task) return <Text style={{ padding: 16 }}>Task not found.</Text>;

  if (!task.availableForSubmission) {
    return (
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Card style={{ padding: 16 }}>
          <Text variant="titleMedium">{task.title}</Text>
          <Text style={{ marginTop: 8, color: "red" }}>
            This task is no longer available for submission.
          </Text>
        </Card>
      </ScrollView>
    );
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Card style={{ padding: 16, marginBottom: 16 }}>
        <Text variant="titleMedium" style={{ marginBottom: 8 }}>
          {task.title}
        </Text>
        <Text style={{ marginBottom: 4 }}>
          Instructions: {task.instructions}
        </Text>
        <Text style={{ marginBottom: 4 }}>
          Deadline: {new Date(task.startDate).toLocaleString()}
        </Text>
      </Card>

      {task ? (
        <>
          {task.questions.map((question: any, index: number) => (
            <Card key={question.id} style={{ padding: 12, marginBottom: 16 }}>
              <Text style={{ fontWeight: "bold", marginBottom: 4 }}>
                {index + 1}. {question.text}
              </Text>

              {question.imageUrl && (
                <Image
                  source={{ uri: question.imageUrl }}
                  style={{ width: "100%", height: 180, marginBottom: 12 }}
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
                    {question.options.map(
                      (option: string, optIndex: number) => {
                        const selected = answers[question.id] === option;
                        return (
                          <TouchableOpacity
                            key={optIndex}
                            onPress={() =>
                              handleAnswerChange(question.id, option)
                            }
                            style={{
                              padding: 10,
                              marginBottom: 6,
                              borderRadius: 8,
                              borderWidth: 1,
                              borderColor: selected ? "#6200ee" : "#ccc",
                              backgroundColor: selected ? "#e3d7fc" : "#fff",
                            }}
                          >
                            <Text
                              style={{ color: selected ? "#6200ee" : "#000" }}
                            >
                              {option}
                            </Text>
                          </TouchableOpacity>
                        );
                      }
                    )}
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
                  {answers[question.id] ? (
                    <Text
                      style={{
                        marginTop: 4,
                        fontStyle: "italic",
                        color: "green",
                      }}
                    >
                      File selected: {answers[question.id].split("/").pop()}
                    </Text>
                  ) : (
                    <Text
                      style={{
                        marginTop: 4,
                        fontStyle: "italic",
                        color: "gray",
                      }}
                    >
                      No file selected.
                    </Text>
                  )}
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
        </>
      ) : (
        <Text style={{ marginTop: 8 }}>
          You have already submitted this task.
        </Text>
      )}
    </ScrollView>
  );
}
