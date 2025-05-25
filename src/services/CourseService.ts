import { privateClient } from "@utils/apiClient";
import {
  ApiCourse,
  BaseCourse,
  CourseData,
  CourseRequestBody,
  FullCourse,
  GetCoursesResponse,
} from "@src/types/course";

export const createCourse = async (data: BaseCourse): Promise<any> => {
  const response = await privateClient.post("/course/create", data);
  return response.data;
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

export async function markOrUnmarkFavorite(
  courseId: string,
  favorite: boolean
) {
  await privateClient.put(`/course/${courseId}/favorite?favorite=${favorite}`);
}

export async function getFavoriteCourses(
  page = 0,
  limit = 10,
  title = ""
): Promise<GetCoursesResponse> {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });
  if (title) params.append("title", title);

  const response = await privateClient.get<GetCoursesResponse>(
    `/course/favorites?${params.toString()}`
  );
  return response.data;
}

export async function getCourseActivityLogs(
  courseId: string,
  page = 0,
  limit = 10
) {
  const response = await privateClient.get("/course/activity", {
    params: {
      courseId,
      page,
      limit,
    },
  });

  return response.data;
}

export async function getCourseStatus(courseId: string) {
  const response = await privateClient.get<{ status: string }>(
    `/course/${courseId}/status`
  );
  return response.data;
}

export async function isSendFeedback(courseId: string, userId: string) {
  try {
    const response = await privateClient.get(
      `/course/${courseId}/feedbacks/sent`,
      {
        params: { userId },
        validateStatus: () => true,
      }
    );

    switch (response.status) {
      case 200:
        return { sent: false, status: 200 };
      case 409:
        return { sent: true, status: 409 };
      case 400:
        throw new Error("Missing or malformed required parameters.");
      case 404:
        throw new Error("Course not found.");
      case 500:
        throw new Error("Internal server error.");
      default:
        throw new Error(`Unknown error. Code: ${response.status}`);
    }
  } catch (error) {
    throw error;
  }
}