import { privateClient } from "@utils/apiClient";

export async function getMyEnrollments(page = 0, limit = 10) {
  const response = await privateClient.get(
    `/enrollment/mycourses?page=${page}&limit=${limit}`
  );
  return response.data;
}

export async function enrollInCourse(courseId: string) {
  await privateClient.post(`/enrollment/create/${courseId}`);
}

export const getAcceptedMembers = async (
  courseId: string,
  page = 0,
  limit = 10
) => {
  const response = await privateClient.get(
    `/enrollment/pendings/${courseId}?page=${page}&limit=${limit}`
  );
  return response.data;
};

export async function addAssistantToCourse({
  courseId,
  assistantId,
  permissions,
}: {
  courseId: string;
  assistantId: number;
  permissions: string[];
}) {
  const response = await privateClient.post("/course/assistants", {
    courseId,
    assistantId,
    permissions,
  });
  return response.data;
}

export async function removeAssistantFromCourse(
  courseId: string,
  assistantId: number
) {
  const response = await privateClient.delete("/course/assistants", {
    params: {
      courseId,
      assistantId,
    },
  });

  return response.status;
}

export async function removeStudentFromCourse(
  courseId: string,
  studentId: number
) {
  const response = await privateClient.delete("/enrollment/student", {
    params: {
      courseId,
      studentId,
    },
  });

  return response.status;
}