import { Stack } from "expo-router";
import { CustomTitle } from "@components/CustomTitle";

export default function MoreLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerTitle: () => CustomTitle("More options"),
          headerTitleAlign: "center",
        }}
      />
      <Stack.Screen
        name="activity"
        options={{
          headerTitle: () => CustomTitle("Activity"),
          headerTitleAlign: "center",
        }}
      />
      <Stack.Screen
        name="courseFeedback"
        options={{
          headerTitle: () => CustomTitle("Feedback"),
          headerTitleAlign: "center",
        }}
      />
      <Stack.Screen
        name="myNotes"
        options={{
          headerTitle: () => CustomTitle("My notes"),
          headerTitleAlign: "center",
        }}
      />
      <Stack.Screen
        name="myPermissions"
        options={{
          headerTitle: () => CustomTitle("My permissions"),
          headerTitleAlign: "center",
        }}
      />
      <Stack.Screen
        name="settings"
        options={{
          headerTitle: () => CustomTitle("Settings"),
          headerTitleAlign: "center",
        }}
      />
      <Stack.Screen
        name="help"
        options={{
          headerTitle: () => CustomTitle("Help"),
          headerTitleAlign: "center",
        }}
      />
      <Stack.Screen
        name="forum"
        options={{
          headerTitle: () => CustomTitle("Forum"),
          headerTitleAlign: "center",
        }}
      />
      <Stack.Screen
        name="performanceStats"
        options={{
          headerTitle: () => CustomTitle("Performance Stats"),
          headerTitleAlign: "center",
        }}
      />
    </Stack>
  );
}
