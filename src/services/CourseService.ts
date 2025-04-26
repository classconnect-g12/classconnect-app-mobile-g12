import { getToken } from "@utils/tokenUtils";

type CourseData = {
  title: string;
  description: string;
  teacherId: number;
  capacity: number;
  startDate: string;
  endDate: string;
  modality: "ONLINE" | "ONSITE" | "HYBRID";
};

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
