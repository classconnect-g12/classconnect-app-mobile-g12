import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Button } from "react-native-paper";
import * as WebBrowser from "expo-web-browser";

import {
  getUserAssessmentDetails,
  gradeAssessmentSubmission,
} from "@services/AssessmentService";
import { useSnackbar } from "@context/SnackbarContext";
import { SNACKBAR_VARIANTS } from "@constants/snackbarVariants";
import Spinner from "@components/Spinner";
import { handleApiError } from "@utils/handleApiError";
import { useAuth } from "@context/authContext";
import { colors } from "@theme/colors";

interface Props {
  assessmentId: string;
  userId: string;
  onBack?: () => void;
}

export default function AssessmentReview({
  assessmentId,
  userId,
  onBack,
}: Props) {
  const [assessment, setAssessment] = useState<any>(null);
  const [feedback, setFeedback] = useState<{
    [answerId: number]: { score: string; comment: string };
  }>({});
  const [globalComment, setGlobalComment] = useState("");
  const [loading, setLoading] = useState(false);

  const { showSnackbar } = useSnackbar();
  const { logout } = useAuth();

  useEffect(() => {
    if (!assessmentId || !userId) return;

    const loadData = async () => {
      try {
        const data = await getUserAssessmentDetails(assessmentId, userId);
        setAssessment(data);

        const initialFeedback: any = {};
        data.questions.forEach((q: any) => {
          q.answers?.forEach((a: any) => {
            initialFeedback[a.id] = {
              score: a.score?.toString() || "",
              comment: a.comment || "",
            };
          });
        });
        setFeedback(initialFeedback);
      } catch (error) {
        console.error("Error fetching assessment", error);
      }
    };

    loadData();
  }, [assessmentId, userId]);

  const handleScoreChange = (answerId: number, value: string) => {
    setFeedback((prev) => ({
      ...prev,
      [answerId]: { ...prev[answerId], score: value },
    }));
  };

  const handleCommentChange = (answerId: number, value: string) => {
    setFeedback((prev) => ({
      ...prev,
      [answerId]: { ...prev[answerId], comment: value },
    }));
  };

  const handleSubmit = async () => {
    if (!assessmentId || !userId) return;

    const invalidScores = assessment.questions.flatMap((question: any) =>
      question.answers
        .map((answer: any) => {
          const scoreStr = feedback[answer.id]?.score;
          const score = parseFloat(scoreStr);
          if (isNaN(score) || score < 0 || score > question.score) {
            return {
              answerId: answer.id,
              questionId: question.id,
              maxScore: question.score,
              score: scoreStr,
            };
          }
          return null;
        })
        .filter(Boolean)
    );

    if (invalidScores.length > 0) {
      showSnackbar(
        "Each score must be a number between 0 and the question's max score.",
        SNACKBAR_VARIANTS.ERROR
      );
      return;
    }

    const answers = Object.entries(feedback).map(
      ([id, { score, comment }]) => ({
        answerId: parseInt(id),
        score: parseFloat(score),
        comment: comment.trim(),
      })
    );

    setLoading(true);
    try {
      await gradeAssessmentSubmission(
        assessmentId,
        userId,
        answers,
        globalComment.trim()
      );
      showSnackbar(
        "Assessment graded successfully!",
        SNACKBAR_VARIANTS.SUCCESS
      );
      setFeedback({});
      setGlobalComment("");
      setLoading(false);
      if (onBack) onBack();
    } catch (error) {
      handleApiError(error, showSnackbar, "Error grading assessment", logout);
      setLoading(false);
    }
  };

  const totalScore = Object.values(feedback).reduce((sum, f) => {
    const s = parseFloat(f.score);
    return sum + (isNaN(s) ? 0 : s);
  }, 0);

  if (!assessment) return <Spinner />;

  return (
    <ScrollView style={{ flex: 1, padding: 16, backgroundColor: "#fff" }}>
      <View style={{ marginBottom: 40 }}>
        <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 4 }}>
          {assessment.title}
        </Text>
        <Text style={{ marginBottom: 4 }}>
          📄 Description: {assessment.description}
        </Text>
        <Text style={{ marginBottom: 12 }}>
          📝 Instructions: {assessment.instructions}
        </Text>

        <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 12 }}>
          Student:
        </Text>

        <Text
          style={{
            fontSize: 18,
            fontWeight: "bold",
            marginBottom: 12,
            textDecorationLine: "underline",
          }}
        >
          Answers
        </Text>

        {assessment.questions.map((question: any, index: number) => (
          <View
            key={question.id}
            style={{
              marginBottom: 24,
              backgroundColor: "#f0f0f0",
              padding: 12,
              borderRadius: 8,
              elevation: 2,
            }}
          >
            <Text style={{ fontWeight: "bold", textAlign: "right" }}>
              {question.type === "MULTIPLE_CHOICE"
                ? "Multiple Choice"
                : question.type === "WRITTEN_ANSWER"
                ? "Written Answer"
                : "File Attachment"}
            </Text>

            <Text style={{ fontWeight: "bold" }}>
              {index + 1}. {question.text}{" "}
              <Text style={{ fontStyle: "italic" }}>
                ({question.score} pts)
              </Text>
            </Text>

            {question.type === "MULTIPLE_CHOICE" && (
              <View>
                <Text
                  style={{ fontWeight: "bold", marginTop: 8, marginBottom: 4 }}
                >
                  Options:
                </Text>
                {question.options.map((opt: string, i: number) => (
                  <Text key={i} style={{ marginLeft: 8 }}>
                    {String.fromCharCode(65 + i)}. {opt}
                  </Text>
                ))}
                <Text style={{ marginTop: 12 }}>
                  <Text style={{ fontWeight: "bold" }}>Correct:</Text>{" "}
                  {question.correctOption}
                </Text>
              </View>
            )}

            {question.type === "WRITTEN_ANSWER" && (
              <Text style={{ marginTop: 8 }}>
                Example answer: {question.sampleAnswer}
              </Text>
            )}

            {question.answers.map((answer: any) => (
              <View
                key={answer.id}
                style={{
                  padding: 10,
                  backgroundColor: "#f2f2f2",
                  borderRadius: 8,
                }}
              >
                {question.type === "WRITTEN_ANSWER" && (
                  <Text>
                    <Text style={{ fontWeight: "bold" }}>Response:</Text>{" "}
                    {answer.answerText}
                  </Text>
                )}
                {question.type === "MULTIPLE_CHOICE" && (
                  <Text>
                    <Text style={{ fontWeight: "bold" }}>Selected:</Text>{" "}
                    {answer.selectedOption}
                  </Text>
                )}
                {question.type === "FILE_ATTACHMENT" && (
                  <TouchableOpacity
                    onPress={async () => {
                      try {
                        await WebBrowser.openBrowserAsync(answer.filePath);
                        showSnackbar(
                          "Abriendo archivo...",
                          SNACKBAR_VARIANTS.INFO
                        );
                      } catch {
                        showSnackbar(
                          "No se pudo abrir el archivo",
                          SNACKBAR_VARIANTS.ERROR
                        );
                      }
                    }}
                  >
                    <Text
                      style={{
                        color: "blue",
                        textDecorationLine: "underline",
                        marginBottom: 8,
                      }}
                    >
                      View attached file
                    </Text>
                  </TouchableOpacity>
                )}

                <TextInput
                  placeholder="Score"
                  keyboardType="numeric"
                  value={feedback[answer.id]?.score}
                  onChangeText={(text) => handleScoreChange(answer.id, text)}
                  style={{
                    backgroundColor: "white",
                    padding: 8,
                    marginTop: 8,
                    borderRadius: 4,
                    borderWidth: 1,
                    borderColor: "#ccc",
                  }}
                />
                <TextInput
                  placeholder="Comment"
                  value={feedback[answer.id]?.comment}
                  onChangeText={(text) => handleCommentChange(answer.id, text)}
                  style={{
                    backgroundColor: "white",
                    padding: 8,
                    marginTop: 6,
                    borderRadius: 4,
                    borderWidth: 1,
                    borderColor: "#ccc",
                  }}
                />
              </View>
            ))}
          </View>
        ))}

        <Text style={{ fontWeight: "bold", fontSize: 16, marginTop: 12 }}>
          🗒 Global Comment:
        </Text>
        <TextInput
          placeholder="Global Comment"
          value={globalComment}
          onChangeText={setGlobalComment}
          multiline
          style={{
            backgroundColor: "white",
            padding: 10,
            marginVertical: 12,
            borderRadius: 6,
            borderWidth: 1,
            borderColor: "#ccc",
            minHeight: 60,
          }}
        />

        <Text style={{ fontSize: 18, marginBottom: 16 }}>
          <Text style={{ fontWeight: "bold" }}>Total score: </Text>
          {totalScore}
        </Text>

        <Button
          mode="contained"
          style={{
            backgroundColor: colors.primary,
            borderRadius: 6,
          }}
          loading={loading}
          onPress={handleSubmit}
          disabled={loading}
        >
          Submit Corrections
        </Button>
      </View>
    </ScrollView>
  );
}
