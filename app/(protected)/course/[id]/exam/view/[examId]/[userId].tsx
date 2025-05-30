import { useLocalSearchParams, router } from "expo-router";
import AssessmentReview from "@components/AssessmentReview";
import AssessmentViewResult from "@components/AssessmentViewResult";
import { useCourse } from "@context/CourseContext";

export default function ReviewExam() {
  const { examId, userId } = useLocalSearchParams();
  const { isTeacher } = useCourse();

  if (!examId || !userId) return null;

  if (isTeacher) {
    return (
      <AssessmentReview
        assessmentId={examId as string}
        userId={userId as string}
        onBack={() => router.back()}
      />
    );
  }

  return (
    <AssessmentViewResult
      assessmentId={examId as string}
      userId={userId as string}
      onBack={() => router.back()}
    />
  );
}
