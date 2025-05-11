import { Tabs, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useEffect } from "react";
import { CourseProvider, useCourse } from "@context/CourseContext";
import { fetchCourseDetail } from "@services/CourseService";
import { Pressable, View, Text, StyleSheet } from "react-native";

function InnerTabs() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const {
    setCourseId,
    setCourseTitle,
    setIsEnrolled,
    setIsTeacher,
    isEnrolled,
  } = useCourse();

  useEffect(() => {
    if (id) setCourseId(id);

    const fetchData = async () => {
      try {
        const courseDetail = await fetchCourseDetail(id ?? "");
        setCourseTitle(courseDetail.course.title);
        setIsEnrolled(courseDetail.course.isEnrolled);
        setIsTeacher(courseDetail.course.isTeacher);
      } catch (error) {
        console.error("Error fetching course data:", error);
      }
    };

    fetchData();
  }, [id]);

  const DisabledTabButton = ({ children }: { children: React.ReactNode }) => (
    <View style={{ opacity: 0.4 }}>{children}</View>
  );

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: { height: 70, paddingBottom: 10, paddingTop: 10 },
        tabBarIconStyle: { marginBottom: 0 },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="information-circle-outline"
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="module"
        options={{
          title: "Modules",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="list-outline" size={size} color={color} />
          ),
          tabBarButton: (props) =>
            isEnrolled ? <Pressable {...props} /> : <DisabledTabButton {...props} />,
        }}
      />
      <Tabs.Screen
        name="tasks"
        options={{
          title: "Tasks",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="checkmark-done-outline" size={size} color={color} />
          ),
          tabBarButton: (props) =>
            isEnrolled ? <Pressable {...props} /> : <DisabledTabButton {...props} />,
        }}
      />
      <Tabs.Screen
        name="exams"
        options={{
          title: "Exams",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="school-outline" size={size} color={color} />
          ),
          tabBarButton: (props) =>
            isEnrolled ? <Pressable {...props} /> : <DisabledTabButton {...props} />,
        }}
      />
      <Tabs.Screen
        name="members"
        options={{
          title: "Members",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people-outline" size={size} color={color} />
          ),
          tabBarButton: (props) =>
            isEnrolled ? <Pressable {...props} /> : <DisabledTabButton {...props} />,
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
