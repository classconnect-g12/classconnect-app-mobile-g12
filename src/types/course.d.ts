export type CourseData = {
  title: string;
  description: string;
  teacherId: number;
  capacity: number;
  startDate: string;
  endDate: string;
  modality: "ONLINE" | "ONSITE" | "HYBRID";
};

export interface ApiCourse {
  id: string;
  title: string;
  description: string;
  capacity: number;
  available: boolean;
  startDate: string;
  endDate: string;
}

export interface GetCoursesResponse {
  courses: ApiCourse[];
  pagination: {
    currentPage: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
}
