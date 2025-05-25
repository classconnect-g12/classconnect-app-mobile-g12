import { Stack, useRouter } from "expo-router";
import { useAuth } from "@context/authContext";
import { useEffect } from "react";
import { Provider as PaperProvider } from "react-native-paper";
import Spinner from "@components/Spinner";

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
        <Spinner />
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
