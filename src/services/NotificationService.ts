import axios from "axios";
import { getToken } from "@utils/tokenUtils";
import { NotificationResponse, GetNotificationsResponse, PreferencesResponse } from "@src/types/notification";

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? "";

const checkApiUrl = () => {
  if (!API_URL) {
    throw new Error("Server error: API_URL is not defined");
  }
};

export const getAllNotifications = async (): Promise<NotificationResponse[]> => {
    checkApiUrl();
    try {
      const token = await getToken();
      const response = await axios.get<NotificationResponse[]>(`${API_URL}/notification`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!response.data) {
        throw new Error("Response data is null or undefined");
      }
      console.log("Get all notifications")
      return response.data;
    } catch (error: any) {
      console.error("❌ Error getting notifications:", error?.response?.data || error.message);
      throw error?.response?.data || { message: "Failed to get notifications" };
    }
};

export const addNotification = async (
  newNotification: NotificationResponse,
  notifications: NotificationResponse[],
  setNotifications: (notifications: NotificationResponse[]) => void
) => {
  setNotifications([newNotification, ...notifications]);
};

export const deleteNotification = async (
  notificationId: string,
  notifications: NotificationResponse[],
  setNotifications: (notifications: NotificationResponse[]) => void
) => {
  checkApiUrl();
  try {
    const token = await getToken();
    await axios.delete(`${API_URL}/notification/${notificationId}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    setNotifications(notifications.filter((n) => n.id !== notificationId)); 
  } catch (error: any) {
    console.error("❌ Error deleting notification:", error?.response?.data || error.message);
    throw error?.response?.data || { message: "Failed to delete notification" };
  }
};

export const syncNotifications = async (setNotifications: (notifications: NotificationResponse[]) => void) => {
  try {
    const updatedNotifications = await getAllNotifications();
    setNotifications(updatedNotifications);
    console.log("Sync notifications")
  } catch (error) {
    console.warn("⚠️ Failed to sync notifications:", error);
  }
};


export const getNotificationPreferences = async (): Promise<PreferencesResponse> => {
  checkApiUrl();
  try {
    const token = await getToken();
    const response = await axios.get<PreferencesResponse>(`${API_URL}/notification/preferences`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.data) {
      throw new Error("Response data is null or undefined");
    }

    console.log("✅ Retrieved notification preferences");
    return response.data;
  } catch (error: any) {
    console.error("❌ Error getting notification preferences:", error?.response?.data || error.message);
    throw error?.response?.data || { message: "Failed to get notification preferences" };
  }
};

export const updateNotificationPreferences = async (preferences: PreferencesResponse): Promise<void> => {
  checkApiUrl();
  try {
    const token = await getToken();
    await axios.put(`${API_URL}/notification/preferences`, preferences, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("✅ Notification preferences updated!");
  } catch (error: any) {
    console.error("❌ Error updating notification preferences:", error?.response?.data || error.message);
    throw error?.response?.data || { message: "Failed to update notification preferences" };
  }
};