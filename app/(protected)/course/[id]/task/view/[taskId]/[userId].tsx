import { useLocalSearchParams, router } from "expo-router";
import AssessmentReview from "@components/AssessmentReview";
import AssessmentViewResult from "@components/AssessmentViewResult";
import { useCourse } from "@context/CourseContext";
import { REVIEW_ASSESSMENT } from "@constants/permissions";

export default function ReviewTask() {
  const { taskId, userId } = useLocalSearchParams();
  const { isTeacher, courseDetail } = useCourse();
    const { course } = courseDetail;
  const hasPermission = (perm: string) => course.permissions.includes(perm);

  if (!taskId || !userId) return null;

  if (isTeacher || hasPermission(REVIEW_ASSESSMENT)) {
    return (
      <AssessmentReview
        assessmentId={taskId as string}
        userId={userId as string}
        onBack={() => router.back()}
      />
    );
  }

  return (
    <AssessmentViewResult
      assessmentId={taskId as string}
      userId={userId as string}
      onBack={() => router.back()}
    />
  );
}
