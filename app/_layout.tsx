import { Stack } from "expo-router";
import { AuthProvider } from "../src/context/authContext";
import { Platform } from "react-native";
import { useEffect } from "react";
import notifee, { AndroidImportance, AndroidVisibility, EventType } from "@notifee/react-native";
import messaging, { FirebaseMessagingTypes } from "@react-native-firebase/messaging"; 

const showNotification = async (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
  const title = typeof remoteMessage.data?.title === "string" ? remoteMessage.data.title : "Nueva notificación";
  const body = typeof remoteMessage.data?.body === "string" ? remoteMessage.data.body : "Tienes un mensaje";

  await notifee.requestPermission();
  await notifee.createChannel({
    id: "default",
    name: "Default Channel",
    importance: AndroidImportance.HIGH,
  });

  await notifee.displayNotification({
    title,
    body,
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
};

messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  console.log("🔄 NOTIFICACIÓN RECIBIDA (segundo plano):", remoteMessage);

  if (!remoteMessage.data?.title || !remoteMessage.data?.body) {
    console.warn("🚨 Notificación vacía recibida, ignorando.");
    return;
  }

  showNotification(remoteMessage); 
});

export default function RootLayout() {
  useEffect(() => {
    const requestPermission = async () => {
      if (Platform.OS === "android") {
        try {
          const authStatus = await messaging().requestPermission();
          const enabled =
            authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
            authStatus === messaging.AuthorizationStatus.PROVISIONAL;
          if (!enabled) {
            console.log("Las notificaciones están deshabilitadas.");
          }
        } catch (err) {
          console.warn("Error al solicitar permiso para notificaciones", err);
        }
      }
    };

    const getToken = async () => {
      try {
        const token = await messaging().getToken();
        console.log("FCM Token:", token);
      } catch (err) {
        console.error("Error al obtener el token de FCM", err);
      }
    };

    const unsubscribeForeground = messaging().onMessage(async (remoteMessage) => {
      console.log("📲 NOTIFICACIÓN RECIBIDA (primer plano):", remoteMessage);
      showNotification(remoteMessage);
    });

    requestPermission();
    getToken();

    return () => {
      unsubscribeForeground();
    };
  }, []);

  notifee.onBackgroundEvent(async ({ type, detail }) => {
    if (type === EventType.PRESS) {
      console.log("🟢 Notificación presionada:", detail.notification);
    }
  });

  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(signin)" options={{ headerShown: false }} />
        <Stack.Screen name="(protected)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" options={{ title: "Oops!" }} />
      </Stack>
    </AuthProvider>
  );
}
