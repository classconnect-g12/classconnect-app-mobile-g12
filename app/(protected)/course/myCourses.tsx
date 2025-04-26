import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { getMyCourses } from "@services/CourseService";
import { ApiCourse } from "@types/course";
import { colors } from "@theme/colors";
import { Card } from "react-native-paper";

export default function MyCourses() {
  const router = useRouter();
  const [courses, setCourses] = useState<ApiCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const fetchCourses = async (pageNumber = 0) => {
    try {
      setLoading(true);
      const data = await getMyCourses(pageNumber, 10);
      setCourses((prev) =>
        pageNumber === 0 ? data.courses : [...prev, ...data.courses]
      );
      setTotalPages(data.pagination.totalPages);
    } catch (error) {
      console.error(error);
      alert("Failed to load your courses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses(0);
  }, []);

  const loadMore = () => {
    if (page + 1 < totalPages) {
      const nextPage = page + 1;
      fetchCourses(nextPage);
      setPage(nextPage);
    }
  };

  const handleDelete = async (courseId: string) => {
    try {
      setCourses((prev) => prev.filter((course) => course.id !== courseId));
      alert("Course deleted successfully");
    } catch (error) {
      console.error(error);
      alert("Failed to delete course");
    }
  };

  const renderItem = ({ item }: { item: ApiCourse }) => (
    <Card style={{ marginBottom: 12, padding: 12 }}>
      <TouchableOpacity
        onPress={() => router.push(`/course/${item.id}` as any)}
        style={{ marginBottom: 12 }}
      >
        <Text style={{ fontWeight: "bold", fontSize: 16 }}>{item.title}</Text>
        <Text style={{ marginTop: 4, color: "gray" }} numberOfLines={2}>
          {item.description}
        </Text>
        <Text style={{ marginTop: 6 }}>
          {item.available ? "Available" : "Not Available"} - {item.capacity}{" "}
          seats
        </Text>
        <Text style={{ color: "gray" }}>
          {new Date(item.startDate).toLocaleDateString()} -{" "}
          {new Date(item.endDate).toLocaleDateString()}
        </Text>
      </TouchableOpacity>
      <View
        style={{ flexDirection: "row", justifyContent: "flex-end", gap: 8 }}
      >
        <TouchableOpacity
          style={{
            backgroundColor: colors.primary,
            paddingVertical: 6,
            paddingHorizontal: 12,
            borderRadius: 6,
          }}
          onPress={() => router.push(`/edit-course/${item.id}` as any)}
        >
          <Text style={{ color: "white" }}>Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            backgroundColor: "red",
            paddingVertical: 6,
            paddingHorizontal: 12,
            borderRadius: 6,
          }}
          onPress={() => handleDelete(item.id)}
        >
          <Text style={{ color: "white" }}>Delete</Text>
        </TouchableOpacity>
      </View>
    </Card>
  );

  if (loading && courses.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!loading && courses.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>You have not created any courses yet.</Text>
      </View>
    );
  }

  return (
    <FlatList
      contentContainerStyle={{ padding: 16 }}
      data={courses}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      onEndReached={loadMore}
      onEndReachedThreshold={0.5}
      ListFooterComponent={
        loading ? <ActivityIndicator color={colors.primary} /> : null
      }
    />
  );
}
