export type NotificationType =
  | "NEW_ENROLLMENT"
  | "COURSE_UPDATE"
  | "NEW_RESOURCE"
  | "NEW_ASSISTANT"
  | "ASSISTANT_REMOVED";

export interface NotificationResponse {
  id: string;
  userId: number;
  title: string;
  body: string;
  type: string;
  isRead: boolean;
  createdAt: string; 
  token?: string;
  detail?: string;
}

export interface GetNotificationsResponse {
  notifications: NotificationResponse[];
}


export interface PreferencesResponse {
  preferences: NotificationType[];
}

