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
            headerTitle: () => CustomTitle("Tasks"),
            headerTitleAlign: "center",
          }}
        />
        <Stack.Screen
          name="new"
          options={{
            headerTitle: () => CustomTitle("Create Task"),
            headerTitleAlign: "center",
          }}
        />
        <Stack.Screen
          name="editTask/[taskId]"
          options={{
            headerTitle: () => CustomTitle("Edit Task"),
            headerTitleAlign: "center",
          }}
        />
                <Stack.Screen
          name="view/[taskId]"
          options={{
            headerTitle: () => CustomTitle("View Task"),
            headerTitleAlign: "center",
          }}
        />
        <Stack.Screen
          name="complete/[taskId]"
          options={{
            headerTitle: () => CustomTitle("Complete Task"),
            headerTitleAlign: "center",
          }}
        />
      </Stack>
    </ModuleProvider>
  );
}
