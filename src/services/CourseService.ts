import { CourseData, GetCoursesResponse } from "@types/course";
import { getToken } from "@utils/tokenUtils";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export const createCourse = async (data: CourseData) => {
  const token = await getToken();

  const response = await fetch(`${API_URL}/course/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errData = await response.json();
    throw new Error(errData.message || "Error creating course");
  }

  const r = response.json();
  console.log(r);
};

export async function fetchCourses(
  page = 0,
  limit = 10
): Promise<GetCoursesResponse> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        courses: [
          {
            id: "uuid-1",
            title: "Introduction to React Native",
            description: "Learn the basics of React Native development",
            capacity: 40,
            available: true,
            startDate: "2025-10-20T18:00:00Z",
            endDate: "2025-12-20T20:00:00Z",
          },
          {
            id: "uuid-2",
            title: "Advanced JavaScript",
            description: "Deep dive into JavaScript concepts",
            capacity: 30,
            available: true,
            startDate: "2025-11-01T15:00:00Z",
            endDate: "2026-01-01T17:00:00Z",
          },
        ],
        pagination: {
          currentPage: page,
          pageSize: limit,
          totalItems: 2,
          totalPages: 1,
        },
      });
    }, 1000);
  });
}
