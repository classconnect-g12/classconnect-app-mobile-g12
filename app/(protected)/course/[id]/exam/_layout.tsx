import { Stack } from "expo-router";
import { Text } from "react-native";
import { ModuleProvider } from "@context/ModuleContext";

export default function ExamLayout() {
  const CustomTitle = (title: string) => (
    <Text
      style={{
        textAlign: "center",
        textDecorationLine: "underline",
        fontSize: 18,
        fontWeight: "bold",
      }}
    >
      {title}
    </Text>
  );

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
          name="view/[examId]"
          options={{
            headerTitle: () => CustomTitle("Students submissions"),
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
