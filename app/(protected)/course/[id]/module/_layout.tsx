// app/course/[courseId]/module/_layout.tsx
import { Stack } from "expo-router";
import { ModuleProvider } from "@context/ModuleContext";

export default function ModuleLayout() {
  return (
    <ModuleProvider>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
    </ModuleProvider>
  );
}
