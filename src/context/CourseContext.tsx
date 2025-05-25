import React, { createContext, useContext, useState } from "react";

const CourseContext = createContext<{
  courseId: string | null;
  setCourseId: (id: string) => void;
  isTeacher: boolean;
  setIsTeacher: (isTeacher: boolean) => void;
  isEnrolled: boolean;
  setIsEnrolled: (isEnrolled: boolean) => void;
  courseTitle: string;
  setCourseTitle: (title: string) => void;
  courseStatus: string;
  setCourseStatus: (status: string) => void;
  courseDetail: any;
  setCourseDetail: (detail: any) => void;
  isLoading?: boolean;
  setIsLoading?: (loading: boolean) => void;
  isInitialized: boolean;
  setIsInitialized: (initialized: boolean) => void;
}>({
  courseId: null,
  setCourseId: () => {},
  isTeacher: false,
  setIsTeacher: () => {},
  isEnrolled: false,
  setIsEnrolled: () => {},
  courseTitle: "",
  setCourseTitle: () => {},
  courseStatus: "",
  setCourseStatus: () => {},
  courseDetail: null,
  setCourseDetail: () => {},
  isLoading: false,
  setIsLoading: () => {},
  isInitialized: false,
  setIsInitialized: () => {},
});

export const CourseProvider = ({ children }: { children: React.ReactNode }) => {
  const [courseId, setCourseId] = useState<string | null>(null);
  const [isTeacher, setIsTeacher] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [courseTitle, setCourseTitle] = useState("");
  const [courseStatus, setCourseStatus] = useState("");
  const [courseDetail, setCourseDetail] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  return (
    <CourseContext.Provider
      value={{
        courseId,
        setCourseId,
        isTeacher,
        setIsTeacher,
        isEnrolled,
        setIsEnrolled,
        courseTitle,
        setCourseTitle,
        courseStatus,
        setCourseStatus,
        courseDetail,
        setCourseDetail,
        isLoading,
        setIsLoading,
        isInitialized,
        setIsInitialized,
      }}
    >
      {children}
    </CourseContext.Provider>
  );
};

export const useCourse = () => useContext(CourseContext);
