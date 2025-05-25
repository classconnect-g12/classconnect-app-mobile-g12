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

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text variant="titleLarge">{assessment.title}</Text>
      <Text>{assessment.description}</Text>
      <Text style={{ marginVertical: 8 }}>{assessment.instructions}</Text>
      <Text>Type: {assessment.type}</Text>
      <Text>Duration: {assessment.duration} minutes</Text>
      <Text>Start: {new Date(assessment.startDate).toLocaleString()}</Text>
      <Text>End: {new Date(assessment.endDate).toLocaleString()}</Text>

      <Divider style={{ marginVertical: 16 }} />

      {assessment.questions.map((q: any, index: number) => (
        <Card key={q.id} style={{ marginBottom: 16, padding: 12 }}>
          <Text style={{ fontWeight: "bold" }}>
            {index + 1}. {q.text}
          </Text>
          <Text>Score: {q.score}</Text>
          <Text>Type: {q.type}</Text>

          {q.imageUrl && (
            <Image
              source={{ uri: q.imageUrl }}
              style={{ height: 150, resizeMode: "contain", marginTop: 8 }}
            />
          )}

          {q.type === "MULTIPLE_CHOICE" && (
            <View style={{ marginTop: 8 }}>
              {q.options.map((opt: string, i: number) => (
                <Text key={i}>
                  {opt} {opt === q.correctOption ? "✓ (correct)" : ""}
                </Text>
              ))}
            </View>
          )}

          {q.sampleAnswer && (
            <Text style={{ marginTop: 8 }}>
              Sample Answer: {q.sampleAnswer}
            </Text>
          )}

          <Divider style={{ marginVertical: 8 }} />
          <Text style={{ fontWeight: "bold" }}>Answers:</Text>
          {q.answers.length === 0 ? (
            <Text>No answers submitted</Text>
          ) : (
            q.answers.map((ans: any, idx: number) => (
              <View key={idx} style={{ marginVertical: 4 }}>
                <Text>Student ID: {ans.studentId}</Text>
                {q.type === "MULTIPLE_CHOICE" && (
                  <Text>Selected: {ans.selectedOption || "(no answer)"}</Text>
                )}
                {q.type === "WRITTEN_ANSWER" && (
                  <Text>Answer: {ans.answerText || "(no answer)"}</Text>
                )}
                {q.type === "FILE_ATTACHMENT" && ans.filePath && (
                  <Text>Attachment: {ans.filePath}</Text>
                )}
              </View>
            ))
          )}
        </Card>
      ))}
    </ScrollView>
  );
}
