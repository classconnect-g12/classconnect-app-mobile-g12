import { Stack } from "expo-router";
import { AuthProvider } from "../src/context/authContext";
import { Platform } from "react-native";
import { useEffect } from "react";
import notifee, { AndroidImportance } from "@notifee/react-native";
import messaging, { FirebaseMessagingTypes } from "@react-native-firebase/messaging"; 

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

    const showNotification = async (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
      await notifee.requestPermission();

      await notifee.createChannel({
        id: "default",
        name: "Default Channel",
        importance: AndroidImportance.HIGH,
      });

      await notifee.displayNotification({
        title: remoteMessage.notification?.title || "Nueva notificación",
        body: remoteMessage.notification?.body || "Tienes un mensaje",
        android: {
          channelId: "default",
          importance: AndroidImportance.HIGH,
        },
      });
    };

    // ✅ Manejo de notificaciones en primer plano con Notifee
    const unsubscribeForeground = messaging().onMessage(async (remoteMessage) => {
      console.log("📲 NOTIFICACIÓN RECIBIDA (primer plano):", remoteMessage);
      showNotification(remoteMessage);
    });

    // ✅ Manejo de notificaciones en segundo plano con Notifee
    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
      console.log("🔄 NOTIFICACIÓN RECIBIDA (segundo plano):", remoteMessage);
      showNotification(remoteMessage);
    });

    requestPermission();
    getToken();

    return () => {
      unsubscribeForeground();
    };
  }, []);

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
