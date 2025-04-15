import { Stack, useRouter } from "expo-router";
import { useAuth } from "../context/authContext";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { Provider as PaperProvider } from "react-native-paper"; // 👈 import PaperProvider

export default function ProtectedLayout() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <PaperProvider>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
    </PaperProvider>
  );
}
