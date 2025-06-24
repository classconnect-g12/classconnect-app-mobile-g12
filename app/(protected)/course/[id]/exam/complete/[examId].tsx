import { useLocalSearchParams } from "expo-router";
import AssessmentSubmissionScreen from "@components/AssesmentSubmissionScreen";

export default function CompleteExamScreen() {
  const { id, examId } = useLocalSearchParams<{ examId: string; id: string }>();
  return <AssessmentSubmissionScreen courseId={id!} assessmentId={examId!} />;
}
