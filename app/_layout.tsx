import { RelativePathString, router, Stack } from "expo-router";
import { AuthProvider } from "../src/context/authContext";
import { Platform } from "react-native";
import { useEffect, useRef, useContext } from "react";
import notifee, { AndroidImportance, AndroidVisibility, EventType } from "@notifee/react-native";
import messaging, { FirebaseMessagingTypes } from "@react-native-firebase/messaging"; 
import { getAllNotifications, addNotification, deleteNotification } from "@services/NotificationService";
import { NotificationResponse } from "@src/types/notification"; 
import { NotificationProvider, NotificationContext } from "@context/notificationContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

const showNotification = async (
  remoteMessage: FirebaseMessagingTypes.RemoteMessage,
  setHasNewNotifications: (value: boolean) => void,
  notifications: NotificationResponse[], 
  setNotifications: React.Dispatch<React.SetStateAction<NotificationResponse[]>>
) => {

  const storedUserId = await AsyncStorage.getItem("userId");
  const notificationUserId = remoteMessage.data?.userId ? String(remoteMessage.data?.userId) : "";

  if (!storedUserId || storedUserId !== notificationUserId) {
    return;
  }

  if (!remoteMessage.data?.id || !remoteMessage.data?.title || !remoteMessage.data?.body) {
    console.warn("⚠️ Notificación inválida, no se guardará:", remoteMessage.data);
    return;
  }

  const newNotification: NotificationResponse = {
    id: String(remoteMessage.data?.id) || crypto.randomUUID(),
    userId: Number(remoteMessage.data?.userId) || 0,
    title: String(remoteMessage.data?.title) || "Nueva notificación",
    body: String(remoteMessage.data?.body) || "Tienes un mensaje",
    type: "PUSH", 
    isRead: false,
    createdAt: String(remoteMessage.data?.createdAt) || new Date().toISOString(),
    detail: remoteMessage.data?.detail ? String(remoteMessage.data?.detail) : undefined,
  };

  await notifee.requestPermission();
  await notifee.createChannel({
    id: "default",
    name: "Default Channel",
    importance: AndroidImportance.HIGH,
  });

  await notifee.displayNotification({
    title: newNotification.title,
    body: newNotification.body,
    android: {
      channelId: "default",
      importance: AndroidImportance.HIGH,
      visibility: AndroidVisibility.PUBLIC,
      pressAction: {
        id: "default",
        launchActivity: "default",
      },
    },
  });

  setHasNewNotifications(true);
  setNotifications((prev) => [...prev, newNotification]);
};

const NotificationHandler = () => {
  const hasSubscribed = useRef(false);
  const context = useContext(NotificationContext);
  if (!context) {
    console.error("⚠️ NotificationContext no está disponible.");
    return null;
  }
  
  const { setHasNewNotifications, setNotifications, notifications } = context;

  useEffect(() => {
    if (hasSubscribed.current) return; 
  
    hasSubscribed.current = true; 
  
    const fetchNotifications = async () => {
      try {
        console.log("🔄 Fetching notifications...");
        const loadedNotifications = await getAllNotifications();
        setNotifications(loadedNotifications);
      } catch (error) {
        console.warn("Error fetching notifications:", error);
      }
    };
  
    fetchNotifications(); 
  
    const unsubscribeForeground = messaging().onMessage(async (remoteMessage) => {
      console.log("📲 NOTIFICACIÓN RECIBIDA (primer plano):", remoteMessage);
      showNotification(remoteMessage, setHasNewNotifications, notifications, setNotifications);
    });
  
    return () => {
      unsubscribeForeground();
    };
  }, []);

  messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    console.log("🌙 NOTIFICACIÓN RECIBIDA (segundo plano):", remoteMessage);
    showNotification(remoteMessage, setHasNewNotifications, notifications, setNotifications);
  });


  notifee.onBackgroundEvent(async ({ type, detail }) => {
    if (type === EventType.PRESS && detail.notification) {
      console.log("🟢 Notificación presionada:", detail.notification);
  
      let route = detail.notification.data?.detail;
  
      if (typeof route === "string") {
        try {
          if (!route.startsWith("/(protected)")) {
            route = "/(protected)" + route;
          }
  
          router.push(route as RelativePathString);
        } catch (error) {
          console.error("❌ Error al navegar:", error);
        }
      } else {
        console.warn("⚠️ Detalle de notificación no es una string válida:", route);
      }
    }
  });

  return null;
};

export default function RootLayout() {
  return (
    <NotificationProvider>  
      <NotificationHandler /> 
      <AuthProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(signin)" options={{ headerShown: false }} />
          <Stack.Screen name="(protected)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" options={{ title: "Oops!" }} />
        </Stack>
      </AuthProvider>
    </NotificationProvider>
  );
}