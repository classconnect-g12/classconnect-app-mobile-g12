import { Stack } from "expo-router";
import { ModuleProvider } from "@context/ModuleContext";

export default function ModuleLayout() {
  return (
    <ModuleProvider>
    <Stack>
      <Stack.Screen name="index" options={{ title: "Modules" }} />
      <Stack.Screen name="[moduleId]" options={{ title: "Resources" }} />
    </Stack>
    </ModuleProvider>
  );
}
