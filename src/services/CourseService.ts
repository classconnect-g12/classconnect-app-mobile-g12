import axios from "axios";
import {
  ApiCourse,
  CourseData,
  CourseRequestBody,
  FullCourse,
  GetCoursesResponse,
} from "@src/types/course";
import { getToken } from "@utils/tokenUtils";

const EXPO_PUBLIC_API_URL = process.env.EXPO_PUBLIC_API_URL ?? "";

export const createCourse = async (data: CourseData): Promise<void> => {
  const token = await getToken();
  console.log(data);

  await axios.post(`${EXPO_PUBLIC_API_URL}/course/create`, data, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};

export async function fetchCourses(
  page = 0,
  limit = 10
): Promise<GetCoursesResponse> {
  const response = await axios.get<GetCoursesResponse>(
    `${EXPO_PUBLIC_API_URL}/course/get`,
    {
      params: { page, limit },
    }
  );

  return response.data;
}

export async function fetchCourseDetail(
  id: string
): Promise<{ course: FullCourse; teacher: any }> {
  const response = await axios.get<{ course: FullCourse; teacher: any }>(
    `${EXPO_PUBLIC_API_URL}/course/details/${id}`
  );

  return response.data;
}

export async function getMyCourses(
  page = 0,
  limit = 10
): Promise<GetCoursesResponse> {
  const token = await getToken();

  const response = await axios.get<GetCoursesResponse>(
    `${EXPO_PUBLIC_API_URL}/course/mycourses`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: { page, limit },
    }
  );

  return response.data;
}

export async function updateCourse(
  id: string,
  updatedFields: CourseRequestBody
): Promise<FullCourse> {
  const token = await getToken();

  const response = await axios.patch<FullCourse>(
    `${EXPO_PUBLIC_API_URL}/course/update/${id}`,
    updatedFields,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
}

export async function deleteCourse(courseId: string): Promise<void> {
  const token = await getToken();

  await axios.delete(`${EXPO_PUBLIC_API_URL}/course/delete/${courseId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
}
