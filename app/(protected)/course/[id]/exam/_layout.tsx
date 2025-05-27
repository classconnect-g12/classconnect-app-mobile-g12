import { Stack } from "expo-router";
import { Text } from "react-native";
import { ModuleProvider } from "@context/ModuleContext";
import { CustomTitle } from "@components/CustomTitle";

export default function ExamLayout() {
  return (
    <ModuleProvider>
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            headerTitle: () => CustomTitle("Exams"),
            headerTitleAlign: "center",
          }}
        />
        <Stack.Screen
          name="new"
          options={{
            headerTitle: () => CustomTitle("Create exam"),
            headerTitleAlign: "center",
          }}
        />
        <Stack.Screen
          name="view/[examId]/index"
          options={{
            headerTitle: () => CustomTitle("Students submissions"),
            headerTitleAlign: "center",
          }}
        />
        <Stack.Screen
          name="view/[examId]/[userId]"
          options={{
            headerTitle: () => CustomTitle("Review exam"),
            headerTitleAlign: "center",
          }}
        />
        <Stack.Screen
          name="editExam/[examId]"
          options={{
            headerTitle: () => CustomTitle("Edit exam"),
            headerTitleAlign: "center",
          }}
        />
        <Stack.Screen
          name="complete/[examId]"
          options={{
            headerTitle: () => CustomTitle("Complete exam"),
            headerTitleAlign: "center",
          }}
        />
      </Stack>
    </ModuleProvider>
  );
}
