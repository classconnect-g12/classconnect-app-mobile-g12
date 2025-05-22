import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { moreStyles } from "@styles/moreStyles";
import { useCourse } from "@context/CourseContext";

type IoniconName =
  | "chatbubble-ellipses-outline"
  | "document-text-outline"
  | "help-circle-outline"
  | "information-circle-outline";

export default function MoreScreen() {
  const router = useRouter();
  const { courseId, isTeacher } = useCourse();

  const allOptions: {
    title: string;
    route: string;
    icon: IoniconName;
    requiresTeacher?: boolean;
    requiresStudent?: boolean;
  }[] = [
    {
      title: "Give feedback",
      route: `course/${courseId}/more/giveFeedback`,
      icon: "chatbubble-ellipses-outline",
      requiresStudent: true,
    },
    {
      title: "Feedback",
      route: `course/${courseId}/more/courseFeedback`,
      icon: "chatbubble-ellipses-outline",
      requiresTeacher: true,
    },
    {
      title: "My notes",
      route: `course/${courseId}/more/myNotes`,
      icon: "chatbubble-ellipses-outline",
      requiresStudent: true,
    },
    {
      title: "Activity",
      route: `course/${courseId}/more/activity`,
      icon: "help-circle-outline",
      requiresTeacher: true,
    },
  ];

  const visibleOptions = allOptions.filter((item) => {
    if (item.requiresTeacher && !isTeacher) return false;
    if (item.requiresStudent && isTeacher) return false;
    return true;
  });

  return (
    <ScrollView contentContainerStyle={moreStyles.container}>
      {visibleOptions.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={moreStyles.button}
          onPress={() => router.push(item.route as any)}
        >
          <View style={moreStyles.buttonContent}>
            <Ionicons
              name={item.icon}
              size={20}
              color="black"
              style={{ marginRight: 10 }}
            />
            <Text style={moreStyles.buttonText}>{item.title}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}
