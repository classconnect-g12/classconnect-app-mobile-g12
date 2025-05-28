import { useLocalSearchParams, router } from "expo-router";
import AssessmentReview from "@components/AssessmentReview";
import AssessmentViewResult from "@components/AssessmentViewResult";
import { useCourse } from "@context/CourseContext";
import { useEffect } from "react";

export default function ReviewTask() {
  const { taskId, userId } = useLocalSearchParams();
  const { isTeacher } = useCourse();

  useEffect(() => {
    console.log(isTeacher);
  });

  if (!taskId || !userId) return null;

  if (isTeacher) {
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
