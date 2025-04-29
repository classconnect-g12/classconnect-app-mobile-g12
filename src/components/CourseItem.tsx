import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { ApiCourse } from "@src/types/course";
import { colors } from "@theme/colors";
import { deleteCourse } from "@services/CourseService";

interface CourseItemProps {
  item: ApiCourse;
  tab: "created" | "enrolled";
  router: any;
}

const CourseItem: React.FC<CourseItemProps> = ({ item, tab, router }) => (
  <View
    style={{
      backgroundColor: "#fff",
      padding: 12,
      marginBottom: 12,
      borderRadius: 8,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    }}
  >
    <TouchableOpacity onPress={() => router.push(`/course/${item.id}`)}>
      <Text style={{ fontWeight: "bold", fontSize: 16 }}>{item.title}</Text>
      <Text style={{ color: "gray", marginVertical: 4 }} numberOfLines={2}>
        {item.description}
      </Text>
      <Text>
        {new Date(item.startDate).toLocaleDateString()} -{" "}
        {new Date(item.endDate).toLocaleDateString()}
      </Text>
    </TouchableOpacity>

    {tab === "created" && (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-end",
          gap: 8,
          marginTop: 10,
        }}
      >
        <TouchableOpacity
          onPress={() => router.push(`/course/editCourse/${item.id}`)}
          style={{
            backgroundColor: colors.primary,
            padding: 6,
            borderRadius: 6,
            marginRight: 8,
          }}
        >
          <Text style={{ color: "white" }}>Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={async () => {
            try {
              await deleteCourse(item.id);
              alert("Deleted");
            } catch {
              alert("Error deleting");
            }
          }}
          style={{
            backgroundColor: "red",
            padding: 6,
            borderRadius: 6,
          }}
        >
          <Text style={{ color: "white" }}>Delete</Text>
        </TouchableOpacity>
      </View>
    )}
  </View>
);

export default CourseItem;
