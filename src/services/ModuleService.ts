import { privateClient } from "@utils/apiClient";

export interface Module {
    moduleId: string;
    title: string;
    description: string;
    order: number;
}

export const fetchModules = async (courseId: string): Promise<Module[]> => {
    const response = await privateClient.get<Module[]>(`/course/modules/${courseId}`);
    return response.data;
}