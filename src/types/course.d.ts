export type Modality = "ONLINE" | "ONSITE" | "HYBRID";

export interface BaseCourse {
  title: string;
  description: string;
  capacity: number;
  startDate: string;
  endDate: string;
  modality: Modality;
}

export interface FullCourse extends BaseCourse {
  id: string;
  available: boolean;
  objectives: string;
  syllabus: string;
  prerequisites: string;
  teacherId: number;
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
>;

export type CourseData = Omit<FullCourse, "id" | "available"> & {
  objectives?: string;
  syllabus?: string;
  prerequisites?: string;
};

export type CourseRequestBody = Partial<Omit<CourseData, "teacherId">>;

export interface GetCoursesResponse {
  courses: ApiCourse[];
  pagination: {
    currentPage: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
}
