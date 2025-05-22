import { privateClient } from "@utils/apiClient";

export async function sendFeedbackStudentToCourse(
  courseId: string,
  comment: string,
  rating: number
) {
  const response = await privateClient.post(`/course/${courseId}/feedback`, [
    {
      comment,
      rating,
    },
  ]);
  console.log(response.data);
}

export async function sendFeedbackCourseToStudent(
  courseId: string,
  studentId: string,
  comment: string,
  rating: number
) {
  const response = await privateClient.post(`/course/${courseId}/student/${studentId}/feedback`, [
    {
      comment,
      rating,
    },
  ]);
  console.log(response.data);
}

export async function getCourseFeedbacks(
  courseId: string,
  params?: {
    page?: number;
    size?: number;
    rating?: number;
    fromDate?: string;
    toDate?: string;
  }
) {
  const response = await privateClient.get(`/course/${courseId}/feedbacks`, {
    params,
  });

  console.log(response.data);
  return response.data;
}

export async function getCourseIaFeedbacks(courseId: string) {
  const response = await privateClient.get(
    `/course/${courseId}/feedbacks/summary`,
    {}
  );

  console.log(response.data);
  return response.data;
}

export async function getStudentFeedbacks(
  params?: {
    page?: number;
    size?: number;
  }
) {
  const response = await privateClient.get(`/student/feedbacks`, {
    params,
  });

  console.log(response.data);
  return response.data;
}

export async function getStudentIaFeedbacks() {
  const response = await privateClient.get(
    `/student/feedbacks/summary`,
    {}
  );

  console.log(response.data);
  return response.data;
}