import { privateClient } from "@utils/apiClient";

function handleApiError(error: any) {
  const defaultError = {
    status: 500,
    detail: "Unknown error occurred",
  };
  if (error && error.status && error.detail) {
    return {
      status: error.status || defaultError.status,
      detail: error.detail || defaultError.detail,
    };
  }

  return defaultError;
}

export async function getChats() {
  try {
    const response = await privateClient.get("/chat/");
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
}

export async function createChat(title: string) {
  try {
    const response = await privateClient.post("/chat/", { title });
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
}

export async function getChatById(chatId: string) {
  try {
    const response = await privateClient.get(`/chat/${chatId}`);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
}

export async function deleteChat(chatId: string) {
  try {
    const response = await privateClient.delete(`/chat/${chatId}`);
    return response;
  } catch (error) {
    return handleApiError(error);
  }
}

export async function createMessage(chatId: string, content: string) {
  try {
    const response = await privateClient.post(`/chat/${chatId}/messages`, {
      content,
    });
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
}

export async function getMessagesByChatId(chatId: string, next?: string) {
  try {
    const response = await privateClient.get(`/chat/${chatId}/messages`, {
      params: next ? { next } : {},
    });
    console.log(response.data.pagination);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
}

export async function getMessageByIdByChat(chatId: string, messageId: string) {
  try {
    const response = await privateClient.get(
      `/chat/${chatId}/messages/${messageId}`
    );
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
}

export async function askIa(chatId: string, messageId: string) {
  try {
    const response = await privateClient.post(
      `/chat/${chatId}/messages/${messageId}/ai`
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
}

export async function calificateMessage(
  chatId: string,
  messageId: string,
  like: boolean
) {
  try {
    const response = await privateClient.post(
      `/chat/${chatId}/messages/${messageId}/rate`,
      { like }
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
}
