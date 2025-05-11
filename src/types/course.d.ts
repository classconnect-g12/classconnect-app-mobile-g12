export type Modality = "ONLINE" | "ONSITE" | "HYBRID";

export interface BaseCourse {
  title: string;
  description: string;
  capacity: number;
  startDate: string;
  endDate: string;
  modality: Modality;
}

export type Teacher = {
  first_name: string;
  last_name: string;
  email: string;
  description: string;
  banner: string;
};

export interface FullCourse extends BaseCourse {
  id: string;
  available: boolean;
  objectives: string;
  syllabus: string;
  prerequisites: string;
  teacherId: number;
  isTeacher: boolean;
  isEnrolled: boolean;
  correlatives: FullCourse[];
  teacher: Teacher;
}

export type ApiCourse = Pick<
  FullCourse,
  | "id"
  | "title"
  | "description"
  | "capacity"
  | "available"
  | "startDate"
  | "endDate"
  | "isTeacher"
  | "isEnrolled"
>;

export type CourseData = Omit<FullCourse, "id" | "available"> & {
  objectives?: string;
  syllabus?: string;
  prerequisites?: string;
};

export type CourseRequestBody = Partial<
  Omit<CourseData, "correlatives" | "teacher"> & {
    correlativeCourseIds?: string[];
  }
>;

export interface GetCoursesResponse {
  courses: ApiCourse[];
  pagination: {
    currentPage: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
}

export type CourseDetailResponse = {
  course: FullCourse;
  teacher: Teacher;
};
