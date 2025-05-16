import { useEffect, useState } from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { Text, Card, FAB, ActivityIndicator } from "react-native-paper";
import { useRouter } from "expo-router";
import { getExamsByCourse } from "@services/AssesmentService";
import { useCourse } from "@context/CourseContext";
import { handleApiError } from "@utils/handleApiError";
import { useSnackbar } from "@hooks/useSnackbar";
import { useAuth } from "@context/authContext";

export default function ExamsScreen() {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { courseId } = useCourse();
  const { showSnackbar } = useSnackbar();
  const { logout } = useAuth();

  useEffect(() => {
    const loadExams = async () => {
      try {
        const assessments = await getExamsByCourse(courseId as string);
        setExams(assessments);
      } catch (error) {
        handleApiError(error, showSnackbar, "Error with exams", logout);
      } finally {
        setLoading(false);
      }
    };

    if (courseId) loadExams();
  }, [courseId]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={exams}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={exams.length === 0 && styles.centered}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <Card.Title
              title={item.title}
              subtitle={`Inicio: ${new Date(item.startDate).toLocaleString()}`}
            />
            <Card.Content>
              <Text variant="bodyMedium">{item.instructions}</Text>
            </Card.Content>
          </Card>
        )}
        ListEmptyComponent={<Text>No hay exámenes aún.</Text>}
      />

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() =>
          router.push({
            pathname: "/(protected)/course/[id]/exam/new",
            params: { courseId },
          })
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    right: 16,
    bottom: 16,
  },
  card: {
    margin: 8,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
