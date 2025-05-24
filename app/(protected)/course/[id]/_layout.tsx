import { Tabs, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useEffect } from "react";
import { CourseProvider, useCourse } from "@context/CourseContext";
import { fetchCourseDetail, getCourseStatus } from "@services/CourseService";
import { Pressable, StyleSheet } from "react-native";

const FINISHED_COURSE_STATUS = "FINISHED";

function InnerTabs() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const {
    setCourseId,
    setCourseTitle,
    setIsEnrolled,
    setIsTeacher,
    setCourseStatus,
    setCourseDetail,
    isEnrolled,
    courseStatus,
    setIsLoading,
  } = useCourse();

  useEffect(() => {
    if (id) setCourseId(id);

    const fetchData = async () => {
      try {
        setIsLoading?.(true);
        const courseDetail = await fetchCourseDetail(id ?? "");
        setCourseDetail(courseDetail);
        setCourseTitle(courseDetail.course.title);
        setIsEnrolled(courseDetail.course.isEnrolled);
        setIsTeacher(courseDetail.course.isTeacher);
        const courseStatus = await getCourseStatus(id ?? "");
        setCourseStatus(courseStatus.status);
      } catch (error) {
        console.error("Error fetching course data:", error);
      } finally {
        setIsLoading?.(false);
      }
    };

    fetchData();
  }, [id]);

  const DisabledTabButton = (props: any) => (
    <Pressable {...props} disabled style={[props.style, styles.disabled]}>
      {props.children}
    </Pressable>
  );

  const styles = StyleSheet.create({
    disabled: {
      opacity: 0.4,
    },
  });

  const isFinished = courseStatus === FINISHED_COURSE_STATUS;

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
          title: "Details",
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
            <Ionicons name="book-outline" size={size} color={color} />
          ),
          tabBarButton: (props) =>
            isEnrolled ? (
              <Pressable {...props} />
            ) : (
              <DisabledTabButton {...props} />
            ),
        }}
      />
      <Tabs.Screen
        name="task"
        options={{
          title: "Tasks",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="file-tray-outline" size={size} color={color} />
          ),
          tabBarButton: (props) =>
            isEnrolled && !isFinished ? (
              <Pressable {...props} />
            ) : (
              <DisabledTabButton {...props} />
            ),
        }}
      />
      <Tabs.Screen
        name="exam"
        options={{
          title: "Exams",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="school-outline" size={size} color={color} />
          ),
          tabBarButton: (props) =>
            isEnrolled && !isFinished ? (
              <Pressable {...props} />
            ) : (
              <DisabledTabButton {...props} />
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
          tabBarButton: (props) =>
            isEnrolled ? (
              <Pressable {...props} />
            ) : (
              <DisabledTabButton {...props} />
            ),
        }}
      />
      <Tabs.Screen
        name="more"
        options={{
          title: "More",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="menu-outline" size={size} color={color} />
          ),
          tabBarButton: (props) =>
            isEnrolled ? (
              <Pressable {...props} />
            ) : (
              <DisabledTabButton {...props} />
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
