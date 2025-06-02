import { useLocalSearchParams, router } from "expo-router";
import AssessmentReview from "@components/AssessmentReview";
import AssessmentViewResult from "@components/AssessmentViewResult";
import { useCourse } from "@context/CourseContext";
import { REVIEW_ASSESSMENT } from "@constants/permissions";

export default function ReviewExam() {
  const { examId, userId } = useLocalSearchParams();
  const { isTeacher, courseDetail } = useCourse();
  const { course } = courseDetail;
  const hasPermission = (perm: string) => course.permissions.includes(perm);
  
  if (!examId || !userId) return null;

  if (isTeacher || hasPermission(REVIEW_ASSESSMENT)) {
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
