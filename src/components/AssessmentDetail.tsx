import { ScrollView, View, Image } from "react-native";
import { Text, Card, Divider } from "react-native-paper";
import Spinner from "@components/Spinner";

export default function AssessmentDetail({
  assessment,
  loading,
}: {
  assessment: any;
  loading: boolean;
}) {
  if (loading || !assessment) return <Spinner />;

  const getReadableType = (type: string) => {
    switch (type) {
      case "MULTIPLE_CHOICE":
        return "Multiple Choice";
      case "WRITTEN_ANSWER":
        return "Written Answer";
      case "FILE_ATTACHMENT":
        return "File Attachment";
      default:
        return type;
    }
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Card
        style={{
          padding: 16,
          borderRadius: 6,
          marginBottom: 16,
          backgroundColor: "white",
        }}
      >
        <Text
          variant="titleLarge"
          style={{ fontWeight: "bold", marginBottom: 4 }}
        >
          {assessment.title}
        </Text>
        <Text style={{ color: "#555", marginBottom: 6 }}>
          {assessment.description}
        </Text>
        <Text style={{ marginBottom: 6 }}>
          <Text style={{ fontWeight: "600" }}>Instructions:</Text>{" "}
          {assessment.instructions}
        </Text>
        <Text style={{ marginBottom: 4 }}>
          ⏱️ Duration: {assessment.duration} minutes
        </Text>
        <Text style={{ marginBottom: 4 }}>
          📅 Start: {new Date(assessment.startDate).toLocaleString()}
        </Text>
        <Text>🛑 End: {new Date(assessment.endDate).toLocaleString()}</Text>
      </Card>

      {assessment.questions.map((q: any, index: number) => (
        <Card
          key={q.id}
          style={{
            padding: 16,
            borderRadius: 6,
            marginBottom: 20,
            backgroundColor: "white",
          }}
        >
          <Text style={{ fontWeight: "bold", fontSize: 16, marginBottom: 4 }}>
            {index + 1}. {q.text}
          </Text>
          <Text style={{ marginBottom: 4 }}>🏆 Score: {q.score}</Text>
          <Text style={{ marginBottom: 4 }}>
            📄 Type: {getReadableType(q.type)}
          </Text>

          {q.imageUrl && (
            <Image
              source={{ uri: q.imageUrl }}
              style={{
                width: "100%",
                height: 180,
                resizeMode: "contain",
                marginVertical: 12,
                borderRadius: 8,
              }}
            />
          )}

          {q.type === "MULTIPLE_CHOICE" && (
            <View style={{ marginTop: 6 }}>
              {q.options.map((opt: string, i: number) => (
                <Text key={i} style={{ marginBottom: 2 }}>
                  {String.fromCharCode(65 + i)}. {opt}
                  {opt === q.correctOption ? " ✅ (correct)" : ""}
                </Text>
              ))}
            </View>
          )}

          {q.sampleAnswer && (
            <Text style={{ marginTop: 8, fontStyle: "italic", color: "#555" }}>
              💡 Sample Answer: {q.sampleAnswer}
            </Text>
          )}

          <Divider style={{ marginVertical: 12 }} />

          <Text style={{ fontWeight: "bold", marginBottom: 6 }}>
            🧑‍🎓 Student Answers:
          </Text>

          {!Array.isArray(q.answers) || q.answers.length === 0 ? (
            <Text style={{ fontStyle: "italic", color: "#888" }}>
              No answers submitted.
            </Text>
          ) : (
            q.answers.map((ans: any, idx: number) => (
              <View
                key={idx}
                style={{
                  marginBottom: 8,
                  padding: 8,
                  backgroundColor: "#f2f2f2",
                  borderRadius: 8,
                }}
              >
                <Text>🆔 Student ID: {ans.studentId}</Text>
                {q.type === "MULTIPLE_CHOICE" && (
                  <Text>
                    ✅ Selected: {ans.selectedOption || "(no answer)"}
                  </Text>
                )}
                {q.type === "WRITTEN_ANSWER" && (
                  <Text>✍️ Answer: {ans.answerText || "(no answer)"}</Text>
                )}
                {q.type === "FILE_ATTACHMENT" && ans.filePath && (
                  <Text>📎 Attachment: {ans.filePath}</Text>
                )}
              </View>
            ))
          )}
        </Card>
      ))}
    </ScrollView>
  );
}
