import { Stack, useRouter } from "expo-router";
import { useAuth } from "@context/authContext";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";

export default function SigningLayout() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const handleRedirect = async () => {
      if (isAuthenticated) {
        router.replace("/(protected)/home");
      }
      setCheckingAuth(false);
    };

    handleRedirect();
  }, [isAuthenticated]);

  if (checkingAuth) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
      <Stack.Screen name="forgotPassword" />
    </Stack>
  );
  
}
