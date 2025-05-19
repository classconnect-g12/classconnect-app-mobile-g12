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
  const { courseId } = useCourse();

  const options: { title: string; route: string; icon: IoniconName }[] = [
    {
      title: "Feedback",
      route: `course/${courseId}/more/feedback`,
      icon: "chatbubble-ellipses-outline",
    },
    {
      title: "Notes",
      route: `course/${courseId}/more/notes`,
      icon: "document-text-outline",
    },
    {
      title: "Help",
      route: `course/${courseId}/more/help`,
      icon: "help-circle-outline",
    },
    {
      title: "About",
      route: `course/${courseId}/more/about`,
      icon: "information-circle-outline",
    },
  ];

  return (
    <ScrollView contentContainerStyle={moreStyles.container}>
      {options.map((item, index) => (
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
