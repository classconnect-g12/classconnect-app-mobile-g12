import { Stack } from "expo-router";

export default function CourseLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: "rgba(255,255,255,0.95)",
        },
        headerTintColor: "black",
      }}
    >
      <Stack.Screen
        name="createCourse"
        options={{
          headerTitle: "Create course",
        }}
      />
      <Stack.Screen
        name="findCourse"
        options={{
          headerTitle: "Search course",
        }}
      />
      <Stack.Screen name="[id]" options={{ headerTitle: "Course Details" }} />
      <Stack.Screen
        name="myCourses"
        options={{
          headerTitle: "My Courses",
        }}
      />
    </Stack>
  );
}
