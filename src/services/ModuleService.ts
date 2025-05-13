import { privateClient } from "@utils/apiClient";
import { DocumentPickerResult } from "expo-document-picker";

export interface Module {
  moduleId: string;
  title: string;
  description: string;
  order: number;
}

export interface Resource {
  resourceId: number;
  title: string;
  resourceType: "DOCUMENT" | "VIDEO" | "IMAGE" | "AUDIO";
  url: string;
  order: number;
  moduleId: number;
}

export const fetchModules = async (courseId: string): Promise<Module[]> => {
  const response = await privateClient.get<Module[]>(
    `/course/modules/${courseId}`
  );
  return response.data;
};

export const fetchModuleById = async (
  courseId: string,
  moduleId: string
): Promise<Module> => {
  const response = await privateClient.get<Module>(
    `/course/${courseId}/modules/${moduleId}`
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

export async function createResource(
  courseId: string,
  moduleId: string,
  title: string,
  order: string,
  file: DocumentPickerResult
) {
  if ("canceled" in file && file.canceled) {
    throw new Error("No se seleccionó ningún archivo.");
  }

  if (!("assets" in file) || !file.assets || file.assets.length === 0) {
    throw new Error("The selected file isn't valid");
  }

  const fileAsset = file.assets[0];
  const name = fileAsset.name || "file";
  const extension = name.split(".").pop()?.toLowerCase();

  let resourceType: "DOCUMENT" | "VIDEO" | "IMAGE" | "AUDIO" = "DOCUMENT";

  if (extension) {
    if (["mp4", "mov", "avi", "webm", "mkv"].includes(extension)) {
      resourceType = "VIDEO";
    } else if (
      ["jpg", "jpeg", "png", "gif", "bmp", "webp"].includes(extension)
    ) {
      resourceType = "IMAGE";
    } else if (["mp3", "wav", "ogg", "m4a"].includes(extension)) {
      resourceType = "AUDIO";
    }
  }

  const formData = new FormData();
  formData.append("title", title);
  formData.append("resource_type", resourceType);
  formData.append("order", order.toString());
  formData.append("file", {
    uri: fileAsset.uri,
    name,
    type: fileAsset.mimeType || "application/octet-stream",
  } as any);

  const response = await privateClient.post(
    `/course/${courseId}/modules/${moduleId}/resources`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
}

export async function fetchResources(
  courseId: string,
  moduleId: string
): Promise<Resource[]> {
  const response = await privateClient.get<Resource[]>(
    `/course/${courseId}/modules/${moduleId}/resources`
  );
  console.log(response.data);

  return response.data.sort((a, b) => a.order - b.order);
}

export async function updateModule(
  courseId: string,
  moduleId: string,
  title: string,
  description: string,
  resources: { ID: number; order: number }[]
) {
  const payload = {
    title,
    description,
    resources,
  };

  const response = await privateClient.put(
    `/course/${courseId}/modules/${moduleId}`,
    payload
  );

  console.log(response.data);
  return response.data;
}
