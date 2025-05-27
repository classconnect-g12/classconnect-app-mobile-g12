import { useLocalSearchParams, router } from "expo-router";
import AssessmentReview from "@components/AssessmentReview";

export default function ReviewExam() {
  const { examId, userId } = useLocalSearchParams();

  if (!examId || !userId) return null;

  return (
    <AssessmentReview
      assessmentId={examId as string}
      userId={userId as string}
      onBack={() => router.back()}
    />
  );
}
