import { privateClient } from "@utils/apiClient";
import {
  ApiCourse,
  BaseCourse,
  CourseData,
  CourseRequestBody,
  FullCourse,
  GetCoursesResponse,
} from "@src/types/course";

export const createCourse = async (data: BaseCourse): Promise<void> => {
  await privateClient.post("/course/create", data);
};

export async function fetchCourses(
  page = 0,
  limit = 10
): Promise<GetCoursesResponse> {
  const response = await privateClient.get<GetCoursesResponse>(
    `/course/get?page=${page}&limit=${limit}`
  );
  return response.data;
}

export async function fetchCourseDetail(
  id: string
): Promise<{ course: FullCourse; teacher: any }> {
  const response = await privateClient.get<{
    course: FullCourse;
    teacher: any;
  }>(`/course/details/${id}`);
  return response.data;
}

export async function getMyCourses(
  page = 0,
  limit = 10
): Promise<GetCoursesResponse> {
  const response = await privateClient.get<GetCoursesResponse>(
    `/course/mycourses?page=${page}&limit=${limit}`
  );
  return response.data;
}

export async function updateCourse(
  id: string,
  updatedFields: CourseRequestBody
): Promise<FullCourse> {
  const response = await privateClient.patch<FullCourse>(
    `/course/update/${id}`,
    updatedFields
  );
  return response.data;
}

export async function deleteCourse(courseId: string): Promise<void> {
  await privateClient.delete(`/course/delete/${courseId}`);
}

export async function getMyEnrollments(page = 0, limit = 10) {
  const response = await privateClient.get(
    `/enrollment/mycourses?page=${page}&limit=${limit}`
  );
  return response.data;
}
