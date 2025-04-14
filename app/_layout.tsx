import { Stack } from "expo-router";
import { AuthProvider } from "./context/authContext";

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false}}>
        <Stack.Screen name="(signing)" options={{ headerShown: false }} />
        <Stack.Screen name="(protected)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" options={{ title: "Oops!" }} />
      </Stack>
    </AuthProvider>
  );
}
