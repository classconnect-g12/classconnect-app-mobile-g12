import { Stack } from "expo-router";

export default function MoreLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "More options" }} />
      <Stack.Screen name="activity" options={{ title: "Activity" }} />
      <Stack.Screen name="courseFeedback" options={{ title: "Course feedback" }} />
      <Stack.Screen name="giveFeedback" options={{ title: "Give feedback" }} />
      <Stack.Screen name="myNotes" options={{ title: "My notes" }} />
    </Stack>
  );
}
