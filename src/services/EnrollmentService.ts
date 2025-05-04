import { privateClient } from "@utils/apiClient";

export async function getMyEnrollments(page = 0, limit = 10) {
  const response = await privateClient.get(
    `/enrollment/mycourses?page=${page}&limit=${limit}`
  );
  return response.data;
}

export async function enrollInCourse(courseId: string) {
  await privateClient.post(`/enrollment/create/${courseId}`);
}
