import AssessmentSubmissionScreen from "@components/AssesmentSubmissionScreen";
import { useLocalSearchParams } from "expo-router";

export default function CompleteTaskScreen() {
  const { id, taskId } = useLocalSearchParams<{ taskId: string; id: string }>();

  return <AssessmentSubmissionScreen courseId={id!} assessmentId={taskId!} />;
}
