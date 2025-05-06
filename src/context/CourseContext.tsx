import React, { createContext, useContext, useState } from "react";

const CourseContext = createContext<{
  courseId: string | null;
  setCourseId: (id: string) => void;
}>({
  courseId: null,
  setCourseId: () => {},
});

export const CourseProvider = ({ children }: { children: React.ReactNode }) => {
  const [courseId, setCourseId] = useState<string | null>(null);

  return (
    <CourseContext.Provider value={{ courseId, setCourseId }}>
      {children}
    </CourseContext.Provider>
  );
};

export const useCourse = () => useContext(CourseContext);
