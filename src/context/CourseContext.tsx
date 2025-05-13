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
}>({
  courseId: null,
  setCourseId: () => {},
  isTeacher: false,
  setIsTeacher: () => {},
  isEnrolled: false,
  setIsEnrolled: () => {},
  courseTitle: "",
  setCourseTitle: () => {},
});

export const CourseProvider = ({ children }: { children: React.ReactNode }) => {
  const [courseId, setCourseId] = useState<string | null>(null);
  const [isTeacher, setIsTeacher] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [courseTitle, setCourseTitle] = useState("");

  return (
    <CourseContext.Provider value={{ courseId, setCourseId, isTeacher, setIsTeacher, isEnrolled, setIsEnrolled, courseTitle, setCourseTitle }}>
      {children}
    </CourseContext.Provider>
  );
};

export const useCourse = () => useContext(CourseContext);
