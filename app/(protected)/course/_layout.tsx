import AppbarMenu from "@components/AppbarMenu";
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
          header: () => <AppbarMenu title="Create course" viewNavigation={true} />,
        }}
      />
      <Stack.Screen
        name="findCourse"
        options={{
          header: () => <AppbarMenu title="Find a course" viewNavigation={true}/>,
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          header: () => <AppbarMenu title="Course" viewNavigation={true}/>,
        }}
      />
      <Stack.Screen
        name="myCourses"
        options={{
          header: () => <AppbarMenu title="My courses" viewNavigation={true}/>,
        }}
      />
      <Stack.Screen
        name="editCourse/[id]"
        options={{
          header: () => <AppbarMenu title="Edit course" viewNavigation={true}/>,
        }}
      />
    </Stack>
  );
}
