import { privateClient } from "@utils/apiClient";

export async function createFeedback(
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
  return response.data;
}

