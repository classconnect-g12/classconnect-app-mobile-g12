import { Tabs, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useEffect } from "react";
import { CourseProvider, useCourse } from "@context/CourseContext";

function InnerTabs() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { setCourseId } = useCourse();

  useEffect(() => {
    if (id) setCourseId(id);
  }, [id]);

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: { height: 70, paddingBottom: 10, paddingTop: 10 },
        tabBarIconStyle: { marginBottom: 0 },
        headerShown: false,
      }}
    >
      <Tabs.Screen name="index" options={{
        title: "Home",
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="information-circle-outline" size={size} color={color} />
        )
      }} />
      <Tabs.Screen name="modules" options={{
        title: "Modules",
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="list-outline" size={size} color={color} />
        )
      }} />
      <Tabs.Screen
        name="tasks"
        options={{
          title: "Tasks",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="checkmark-done-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="exams"
        options={{
          title: "Exams",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="school-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="members"
        options={{
          title: "Members",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

export default function CourseTabsLayout() {
  return (
    <CourseProvider>
      <InnerTabs />
    </CourseProvider>
  );
}