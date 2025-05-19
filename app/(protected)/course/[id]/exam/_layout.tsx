// app/course/[courseId]/exam/_layout.tsx
import { Stack } from "expo-router";
import { ModuleProvider } from "@context/ModuleContext";

export default function ExamLayout() {
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
