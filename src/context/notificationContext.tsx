import React, { createContext, useState, useEffect } from "react";
import { getNotificationPreferences, getAllNotifications } from "@services/NotificationService"; 
import { NotificationResponse, NotificationType, PreferencesResponse } from "@src/types/notification";

export const defaultPreferences = {
  NEW_ENROLLMENT: true,
  COURSE_UPDATE: true,
  NEW_RESOURCE: true,
  NEW_ASSESSMENT: true,
  NEW_ASSISTANT: true,
  ASSISTANT_REMOVED: true,
};

interface NotificationContextType {
  notificationPreferences: { [key: string]: boolean };
  setNotificationPreferences: React.Dispatch<React.SetStateAction<{ [key: string]: boolean }>>;
  hasNewNotifications: boolean;
  setHasNewNotifications: React.Dispatch<React.SetStateAction<boolean>>;
  notifications: NotificationResponse[];
  setNotifications: React.Dispatch<React.SetStateAction<NotificationResponse[]>>;
}

export const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

  const [notificationPreferences, setNotificationPreferences] = useState<{ [key: string]: boolean }>(defaultPreferences);
  const [hasNewNotifications, setHasNewNotifications] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<NotificationResponse[]>([]);

  useEffect(() => {
    const fetchPreferencesAndNotifications = async () => {
      try {
        const response: PreferencesResponse = await getNotificationPreferences();
        if (!response || !response.preferences) {
          throw new Error("Invalid response format from getNotificationPreferences");
        }

        const prefs = response.preferences; 

        const newPrefs: { [key in NotificationType]: boolean } = {} as { [key in NotificationType]: boolean };

        Object.keys(defaultPreferences).forEach((key) => {
          newPrefs[key as NotificationType] = prefs.includes(key as NotificationType);
        });

        setNotificationPreferences(newPrefs); 

        const loadedNotifications = await getAllNotifications();
        setNotifications(loadedNotifications);

        if (loadedNotifications.length > 0) {
          setHasNewNotifications(true);
        }
      } catch (error) {
        console.error("❌ Error fetching preferences or notifications:", error);
      }
    };

    fetchPreferencesAndNotifications();
  }, []);

  return (
    <NotificationContext.Provider 
      value={{ 
        notificationPreferences, 
        setNotificationPreferences, 
        hasNewNotifications, 
        setHasNewNotifications, 
        notifications, 
        setNotifications 
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};