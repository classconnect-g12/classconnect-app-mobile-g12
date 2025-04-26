import { ApiCourse, CourseData, GetCoursesResponse } from "@types/course";
import { getToken } from "@utils/tokenUtils";

let simulatedCourses: ApiCourse[] = [
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
];

// const API_URL = process.env.EXPO_PUBLIC_API_URL;

// export const createCourse = async (data: CourseData) => {
//   const token = await getToken();

//   const response = await fetch(`${API_URL}/course/create`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${token}`,
//     },
//     body: JSON.stringify(data),
//   });

//   if (!response.ok) {
//     const errData = await response.json();
//     throw new Error(errData.message || "Error creating course");
//   }

//   const r = response.json();
//   console.log(r);
// };

export const createCourse = async (data: CourseData) => {
  const token = await getToken();

  return new Promise<void>((resolve, reject) => {
    setTimeout(() => {
      try {
        simulatedCourses.push({
          id: `uuid-${Date.now()}`,
          title: data.title,
          description: data.description,
          capacity: data.capacity,
          available: true,
          startDate: data.startDate,
          endDate: data.endDate,
        });

        console.log(
          "Curso creado:",
          simulatedCourses[simulatedCourses.length - 1]
        );
        resolve();
      } catch (error) {
        reject(new Error("Error creating course"));
      }
    }, 500);
  });
};

export async function fetchCourses(
  page = 0,
  limit = 10
): Promise<GetCoursesResponse> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        courses: simulatedCourses,
        pagination: {
          currentPage: page,
          pageSize: limit,
          totalItems: simulatedCourses.length,
          totalPages: 1,
        },
      });
    }, 1000);
  });
}

export async function fetchCourseDetail(id: string) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (id === "uuid-1" || id === "uuid-2") {
        resolve({
          course: {
            id,
            title:
              id === "uuid-1"
                ? "Introduction to React Native"
                : "Advanced JavaScript",
            description:
              id === "uuid-1"
                ? "Learn the basics of React Native development"
                : "Deep dive into JavaScript concepts",
            objectives: "Learn, Build, Deploy",
            syllabus: "Module 1, Module 2, Module 3",
            prerequisites: "Basic programming knowledge",
            modality: "ONLINE",
            capacity: id === "uuid-1" ? 40 : 30,
            teacherId: 16,
            startDate: "2025-10-20T18:00:00Z",
            endDate: "2025-12-20T20:00:00Z",
          },
          teacher: {
            id: 16,
            user_name: "Username",
            first_name: "User",
            last_name: "User",
            email: "User@example.com",
            description: "User description",
            banner: "https://example.com/banner.jpg",
            banned: false,
            role: "USER",
            created_at: "2025-04-17T19:20:24.856654Z",
          },
        });
      } else {
        reject(new Error("Course not found"));
      }
    }, 1000);
  });
}
