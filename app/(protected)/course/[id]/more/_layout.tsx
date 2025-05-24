import { Stack } from "expo-router";

export default function MoreLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "More options" }} />
      <Stack.Screen name="activity" options={{ title: "Activity" }} />
      <Stack.Screen name="courseFeedback" options={{ title: "Feedback" }} />
      <Stack.Screen name="myNotes" options={{ title: "My notes" }} />
      <Stack.Screen name="myPermissions" options={{ title: "My permissions" }} />
      <Stack.Screen name="settings" options={{ title: "Settings" }} />
      <Stack.Screen name="help" options={{ title: "Help" }} />
    </Stack>
  );
}
