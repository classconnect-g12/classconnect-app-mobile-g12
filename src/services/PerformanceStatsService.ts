import { privateClient } from "@utils/apiClient";

// GET /course/:courseId/performance
export async function getCoursePerformanceStats(
  courseId: string,
  fromDate?: string,
  toDate?: string
) {
  const params: any = {};
  if (fromDate) params.fromDate = fromDate;
  if (toDate) params.toDate = toDate;

  const response = await privateClient.get(
    `/course/${courseId}/performance`,
    { params }
  );
  return response.data;
}

// GET /course/:courseId/student/:studentId/performance
export async function getStudentPerformanceStats(
  courseId: string,
  studentId: string | number,
  fromDate?: string,
  toDate?: string
) {
  const params: any = {};
  if (fromDate) params.fromDate = fromDate;
  if (toDate) params.toDate = toDate;

  const response = await privateClient.get(
    `/course/${courseId}/students/${studentId}/performance`,
    { params }
  );
  return response.data;
}

