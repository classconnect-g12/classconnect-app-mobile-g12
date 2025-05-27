import { useLocalSearchParams, router } from "expo-router";
import AssessmentReview from "@components/AssessmentReview";

export default function ReviewTask() {
  const { taskId, userId } = useLocalSearchParams();

  if (!taskId || !userId) return null;

  return (
    <AssessmentReview
      assessmentId={taskId as string}
      userId={userId as string}
      onBack={() => router.back()}
    />
  );
}
