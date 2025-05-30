import { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { TouchableOpacity } from "react-native";
import * as WebBrowser from "expo-web-browser";
import Spinner from "@components/Spinner";
import { getUserAssessmentDetails } from "@services/AssessmentService";
import { useSnackbar } from "@context/SnackbarContext";
import { SNACKBAR_VARIANTS } from "@constants/snackbarVariants";
import { handleApiError } from "@utils/handleApiError";
import { useAuth } from "@context/authContext";

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
  const [userProfile, setUserProfile] = useState<any>(null);
  const { showSnackbar } = useSnackbar();
  const [isLoading, setIsLoading] = useState(true);
  const { logout } = useAuth();

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const data = await getUserAssessmentDetails(assessmentId, userId);
        console.log(data);
        setAssessment(data.assessment);
        setUserProfile(data.userProfile);
      } catch (error) {
        console.error("Error fetching assessment details", error);
        handleApiError(error, showSnackbar, "Failed to fetch grades", logout);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetails();
  }, [assessmentId, userId]);

  if (isLoading) return <Spinner />;

  if (!isLoading && !assessment) {
    return (
      <View
        style={{
          alignItems: "center",
          padding: 32,
          backgroundColor: "white",
          flex: 1,
        }}
      >
        <Text style={{ fontSize: 24, marginBottom: 12 }}>🔒</Text>
        <Text style={{ fontSize: 16, color: "#555", textAlign: "center" }}>
          This assessment is currently unavailable.
          {"\n"}Please check back later or contact your instructor.
        </Text>
      </View>
    );
  }

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

          {/* Answers */}
          {question.answers.map((answer: any) => (
            <View key={answer.id} style={{ marginTop: 8 }}>
              {question.type === "WRITTEN_ANSWER" && (
                <>
                  <Text style={{ fontStyle: "italic", marginBottom: 12 }}>
                    📝 Written Answer:
                  </Text>
                  <Text style={{ marginBottom: 6 }}>{answer.answerText}</Text>
                </>
              )}

              {question.type === "MULTIPLE_CHOICE" && (
                <>
                  <Text style={{ fontStyle: "italic", marginBottom: 4 }}>
                    ✅ Multiple Choice:
                  </Text>
                  {question.options.map((option: string, optIndex: number) => {
                    const isSelected = option === answer.selectedOption;
                    return (
                      <Text
                        key={optIndex}
                        style={{
                          color: isSelected ? "#2563eb" : "#000",
                          fontWeight: isSelected ? "bold" : "normal",
                        }}
                      >
                        {optIndex + 1}. {option} {isSelected ? "✓" : ""}
                      </Text>
                    );
                  })}
                </>
              )}

              {question.type === "FILE_ATTACHMENT" && (
                <>
                  <Text style={{ fontStyle: "italic", marginBottom: 4 }}>
                    📎 File Attachment:
                  </Text>
                  <TouchableOpacity
                    onPress={() => WebBrowser.openBrowserAsync(answer.filePath)}
                  >
                    <Text
                      style={{ color: "blue", textDecorationLine: "underline" }}
                    >
                      View File
                    </Text>
                  </TouchableOpacity>
                </>
              )}

              <Text style={{ marginTop: 8 }}>🏅 Score: {answer.score}</Text>
              {answer.comment && (
                <Text style={{ color: "#555" }}>
                  💬 Comment: {answer.comment}
                </Text>
              )}
            </View>
          ))}
        </View>
      ))}

      {assessment.generalComment && (
        <View
          style={{
            marginTop: 16,
            padding: 12,
            backgroundColor: "#eef2ff",
            borderRadius: 8,
          }}
        >
          <Text style={{ fontWeight: "bold", marginBottom: 4 }}>
            💡 General Comment:
          </Text>
          <Text>{assessment.generalComment}</Text>
        </View>
      )}

      <Text style={{ fontSize: 18, marginTop: 16, fontWeight: "bold" }}>
        Total Score: {totalScore}
      </Text>
    </ScrollView>
  );
}
