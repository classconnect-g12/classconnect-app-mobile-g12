import {
  ApiCourse,
  CourseData,
  CourseRequestBody,
  FullCourse,
  GetCoursesResponse,
} from "@src/types/course";
import { getToken } from "@utils/tokenUtils";

interface Teacher {
  id: number;
  user_name: string;
  first_name: string;
  last_name: string;
  email: string;
  description: string;
  banner: string;
  banned: boolean;
  role: "USER" | "ADMIN";
  created_at: string;
}

const mockTeachers: Teacher[] = [
  {
    id: 16,
    user_name: "john_doe",
    first_name: "John",
    last_name: "Doe",
    email: "john.doe@example.com",
    description: "Experienced software engineer and educator",
    banner: "https://example.com/john_banner.jpg",
    banned: false,
    role: "USER",
    created_at: "2025-01-01T17:00:00Z",
  },
  {
    id: 17,
    user_name: "jane_smith",
    first_name: "Jane",
    last_name: "Smith",
    email: "jane.smith@example.com",
    description: "React Native expert with 10+ years of experience",
    banner: "https://example.com/jane_banner.jpg",
    banned: false,
    role: "USER",
    created_at: "2025-02-01T17:00:00Z",
  },
];

const mockCourses: FullCourse[] = [
  {
    id: "uuid-1",
    title: "Introduction to React Native",
    description: "Learn the basics of React Native development",
    objectives: "Understand components, navigation, and state management",
    syllabus: "1. Setup\n2. Components\n3. Navigation\n4. State",
    prerequisites: "Basic JavaScript knowledge",
    modality: "ONLINE",
    capacity: 40,
    available: true,
    startDate: "2025-10-20T18:00:00Z",
    endDate: "2025-12-20T20:00:00Z",
    teacherId: 16,
  },
  {
    id: "uuid-2",
    title: "Advanced JavaScript",
    description: "Deep dive into JavaScript concepts",
    objectives: "Master closures, async programming, and ES6+",
    syllabus: "1. Closures\n2. Async/Await\n3. ES6+\n4. Modules",
    prerequisites: "Intermediate JavaScript knowledge",
    modality: "HYBRID",
    capacity: 30,
    available: true,
    startDate: "2025-11-01T15:00:00Z",
    endDate: "2026-01-01T17:00:00Z",
    teacherId: 17,
  },
  ...Array.from({ length: 48 }, (_, index) => ({
    id: `course-${index + 1}`,
    title: `Course ${index + 1}`,
    description: `Learn advanced concepts in course ${index + 1}.`,
    objectives: "Understand key concepts and build projects",
    syllabus: "1. Intro\n2. Core Concepts\n3. Advanced Topics",
    prerequisites: "Basic programming knowledge",
    modality: (["ONLINE", "HYBRID", "ONSITE"] as const)[index % 3],
    capacity: 10 + (index % 5) * 5, // 10, 15, 20, 25, 30
    available: index % 2 === 0,
    startDate: new Date(Date.now() + index * 86400000).toISOString(), // 1 day apart
    endDate: new Date(Date.now() + (index + 30) * 86400000).toISOString(), // 30 days later
    teacherId: mockTeachers[index % mockTeachers.length].id,
  })),
];

const toApiCourse = (course: FullCourse): ApiCourse => ({
  id: course.id,
  title: course.title,
  description: course.description,
  capacity: course.capacity,
  available: course.available,
  startDate: course.startDate,
  endDate: course.endDate,
});

export const createCourse = async (data: CourseData): Promise<void> => {
  const token = await getToken();

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        const newCourse: FullCourse = {
          id: `uuid-${Date.now()}`,
          title: data.title,
          description: data.description,
          objectives: data.objectives || "Learn and build projects",
          syllabus: data.syllabus || "1. Intro\n2. Core Concepts",
          prerequisites: data.prerequisites || "None",
          modality: data.modality,
          capacity: data.capacity,
          available: true,
          startDate: data.startDate,
          endDate: data.endDate,
          teacherId: data.teacherId,
        };

        mockCourses.push(newCourse);
        console.log("Course created:", newCourse);
        resolve();
      } catch (error) {
        console.error("Error creating course:", error);
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
      const start = page * limit;
      const end = start + limit;
      const paginatedCourses = mockCourses.slice(start, end).map(toApiCourse);

      resolve({
        courses: paginatedCourses,
        pagination: {
          currentPage: page,
          pageSize: limit,
          totalItems: mockCourses.length,
          totalPages: Math.ceil(mockCourses.length / limit),
        },
      });
    }, 1000);
  });
}

export async function fetchCourseDetail(
  id: string
): Promise<{ course: FullCourse; teacher: Teacher }> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const course = mockCourses.find((c) => c.id === id);
      if (course) {
        const teacher = mockTeachers.find((t) => t.id === course.teacherId);
        if (teacher) {
          resolve({ course, teacher });
        } else {
          reject(new Error("Teacher not found for course"));
        }
      } else {
        reject(new Error("Course not found"));
      }
    }, 1000);
  });
}

export async function getMyCourses(
  page = 0,
  limit = 10
): Promise<GetCoursesResponse> {
  const token = await getToken();

  return new Promise((resolve) => {
    setTimeout(() => {
      const start = page * limit;
      const end = start + limit;
      const userCourses = mockCourses.filter(
        (course) => course.teacherId === mockTeachers[0].id // Example: filter for teacherId 16
      );
      const paginatedCourses = userCourses.slice(start, end).map(toApiCourse);

      resolve({
        courses: paginatedCourses,
        pagination: {
          currentPage: page,
          pageSize: limit,
          totalItems: userCourses.length,
          totalPages: Math.ceil(userCourses.length / limit),
        },
      });
    }, 1000);
  });
}

export async function updateCourse(
  id: string,
  updatedFields: CourseRequestBody
): Promise<FullCourse> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        const courseIndex = mockCourses.findIndex((c) => c.id === id);
        if (courseIndex === -1) {
          throw new Error("Course not found");
        }

        mockCourses[courseIndex] = {
          ...mockCourses[courseIndex],
          ...updatedFields,
        } as FullCourse;

        console.log("Course updated:", mockCourses[courseIndex]);
        resolve(mockCourses[courseIndex]);
      } catch (error) {
        console.error("Error updating course:", error);
        reject(error);
      }
    }, 500);
  });
}
