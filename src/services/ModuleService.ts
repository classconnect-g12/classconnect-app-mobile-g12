import { privateClient } from "@utils/apiClient";

export interface Module {
  moduleId: string;
  title: string;
  description: string;
  order: number;
}

export const fetchModules = async (courseId: string): Promise<Module[]> => {
  const response = await privateClient.get<Module[]>(
    `/course/modules/${courseId}`
  );
  return response.data;
};

export async function createModule(
  courseId: string,
  title: string,
  description: string,
  order: number
) {
  const response = await privateClient.post(`/course/modules/${courseId}`, [
    {
      title,
      description,
      order,
    },
  ]);
  console.log(response.data);
}
