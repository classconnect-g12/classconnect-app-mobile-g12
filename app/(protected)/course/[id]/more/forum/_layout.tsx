import { Stack, useLocalSearchParams } from "expo-router";
import { ForumQuestionsProvider } from "@context/ForumQuestionsContext";

export default function ForumLayout() {
  const { id: courseId } = useLocalSearchParams<{ id: string }>();
  if (!courseId) return null;

  return (
    <ForumQuestionsProvider courseId={String(courseId)}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" options={{ title: "Forum" }} />
        <Stack.Screen name="create" options={{ title: "New Question" }} />
        <Stack.Screen name="[questionId]/index" options={{ title: "Question Detail" }} />
      </Stack>
    </ForumQuestionsProvider>
  );
}