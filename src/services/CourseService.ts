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
  limit = 10,
  filters: { title?: string } = {}
): Promise<GetCoursesResponse> {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  if (filters.title) {
    params.append("title", filters.title);
  }

  const response = await privateClient.get<GetCoursesResponse>(
    `/course/get?${params.toString()}`
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
  limit = 10,
  title?: string
): Promise<GetCoursesResponse> {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  if (title) {
    params.append("title", title);
  }

  const response = await privateClient.get<GetCoursesResponse>(
    `/course/mycourses?${params.toString()}`
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
