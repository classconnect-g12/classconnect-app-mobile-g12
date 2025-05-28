import { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { TouchableOpacity } from "react-native";
import * as WebBrowser from "expo-web-browser";
import Spinner from "@components/Spinner";
import { getUserAssessmentDetails } from "@services/AssessmentService";
import { useSnackbar } from "@context/SnackbarContext";
import { SNACKBAR_VARIANTS } from "@constants/snackbarVariants";

interface Props {
  assessmentId: string;
  userId: string;
  onBack?: () => void;
}

export default function AssessmentResultView({
  assessmentId,
  userId,
  onBack,
}: Props) {
  const [assessment, setAssessment] = useState<any>(null);
  const { showSnackbar } = useSnackbar();

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const data = await getUserAssessmentDetails(assessmentId, userId);
        setAssessment(data);
        console.log(data);
      } catch (error) {
        console.error("Error fetching assessment details", error);
        showSnackbar(
          "Error loading assessment details",
          SNACKBAR_VARIANTS.ERROR
        );
      }
    };

    fetchDetails();
  }, [assessmentId, userId]);

  if (!assessment) return <Spinner />;

  const totalScore = assessment.questions.reduce((sum: number, q: any) => {
    const answerScore = q.answers?.reduce(
      (qSum: number, a: any) => qSum + (parseFloat(a.score) || 0),
      0
    );
    return sum + answerScore;
  }, 0);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#fff" }}
      contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
    >
      <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 12 }}>
        {assessment.title}
      </Text>
      <Text style={{ marginBottom: 8 }}>{assessment.description}</Text>
      <Text style={{ marginBottom: 16 }}>{assessment.instructions}</Text>

      {assessment.questions.map((question: any, index: number) => (
        <View
          key={question.id}
          style={{
            marginBottom: 20,
            padding: 12,
            backgroundColor: "#f9f9f9",
            borderRadius: 8,
          }}
        >
          <Text style={{ fontWeight: "bold", marginBottom: 4 }}>
            {index + 1}. {question.text} ({question.score} pts)
          </Text>

          {question.answers.map((answer: any) => (
            <View key={answer.id} style={{ marginTop: 8 }}>
              {question.type === "WRITTEN_ANSWER" && (
                <Text>Response: {answer.answerText}</Text>
              )}
              {question.type === "MULTIPLE_CHOICE" && (
                <Text>Selected Option: {answer.selectedOption}</Text>
              )}
              {question.type === "FILE_ATTACHMENT" && (
                <TouchableOpacity
                  onPress={() => WebBrowser.openBrowserAsync(answer.filePath)}
                >
                  <Text
                    style={{ color: "blue", textDecorationLine: "underline" }}
                  >
                    View File
                  </Text>
                </TouchableOpacity>
              )}
              <Text>Score: {answer.score}</Text>
              {answer.comment ? <Text>Comment: {answer.comment}</Text> : null}
            </View>
          ))}
        </View>
      ))}

      {assessment.generalComment ? (
        <View
          style={{
            marginTop: 16,
            padding: 12,
            backgroundColor: "#eef2ff",
            borderRadius: 8,
          }}
        >
          <Text style={{ fontWeight: "bold", marginBottom: 4 }}>
            General Comment:
          </Text>
          <Text>{assessment.generalComment}</Text>
        </View>
      ) : null}

      <Text style={{ fontSize: 18, marginTop: 16, fontWeight: "bold" }}>
        Total Score: {totalScore}
      </Text>
    </ScrollView>
  );
}
