import Spinner from "@components/Spinner";
import { useAuth } from "@context/authContext";
import { useCourse } from "@context/CourseContext";
import { useSnackbar } from "@context/SnackbarContext";
import { getAssessmentsGrades } from "@services/AssessmentService";
import { handleApiError } from "@utils/handleApiError";
import { router } from "expo-router";
import { JSX, useEffect, useState } from "react";
import {
  View,
  FlatList,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Text, Card, Icon } from "react-native-paper";

type Grade = {
  assessmentId: string | number;
  assessmentTitle: string;
  score: number;
  status: string;
  comment?: string;
  submissionTime: string | number | Date;
  type: string;
};

export default function MyGradesScreen() {
  const { userId } = useAuth();
  const { courseId } = useCourse();
  const { logout } = useAuth();
  const { showSnackbar } = useSnackbar();

  const [grades, setGrades] = useState<Grade[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!courseId) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await getAssessmentsGrades({
          courseId,
          page: 0,
          size: 50,
        });
        setGrades(response.grades || []);
      } catch (error) {
        handleApiError(error, showSnackbar, "Failed to fetch grades", logout);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [courseId]);

  const renderGrade = ({ item }: { item: Grade }) => (
    <TouchableOpacity
      onPress={() =>
        router.push(
          `/course/${courseId}/${item.type.toLowerCase()}/view/${
            item.assessmentId
          }/${userId}`
        )
      }
      activeOpacity={0.7}
    >
      <Card style={styles.card}>
        <Text variant="titleMedium" style={styles.cardTitle}>
          {item.assessmentTitle}
        </Text>

        <View style={styles.row}>
          <Icon source="star" size={18} color="#555" />
          <Text style={styles.label}> Grade:</Text>
          <Text style={styles.value}>{item.score}</Text>
        </View>

        <View style={styles.row}>
          <Icon source="check-circle-outline" size={18} color="#555" />
          <Text style={styles.label}> Status:</Text>
          <Text style={styles.value}>{item.status}</Text>
        </View>

        <View style={styles.row}>
          <Icon source="comment-text-outline" size={18} color="#555" />
          <Text style={styles.label}> Comment:</Text>
          <Text style={styles.value}>{item.comment || "No comment"}</Text>
        </View>

        <View style={styles.row}>
          <Icon source="calendar-clock" size={18} color="#555" />
          <Text style={styles.label}> Date:</Text>
          <Text style={styles.value}>
            {new Date(item.submissionTime).toLocaleString()}
          </Text>
        </View>
      </Card>
    </TouchableOpacity>
  );

  const exams = grades.filter((g) => g.type === "EXAM");
  const tasks = grades.filter((g) => g.type === "TASK");

  if (loading) return <Spinner />;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Section title="Exams" data={exams} renderItem={renderGrade} />
        <Section title="Tasks" data={tasks} renderItem={renderGrade} />
      </ScrollView>
    </View>
  );
}

function Section({
  title,
  data,
  renderItem,
}: {
  title: string;
  data: Grade[];
  renderItem: ({ item }: { item: Grade }) => JSX.Element;
}) {
  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {data.length > 0 ? (
        <FlatList
          data={data}
          keyExtractor={(item) => item.assessmentId.toString()}
          renderItem={renderItem}
          scrollEnabled={false}
        />
      ) : (
        <Text style={styles.emptyText}>
          No {title.toLowerCase()} available.
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  sectionContainer: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 12,
    textDecorationLine: "underline",
    color: "#333",
    marginLeft: 4,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    marginLeft: 4,
  },
  card: {
    marginVertical: 8,
    padding: 16,
    backgroundColor: "#f9f9f9",
    elevation: 2,
    borderRadius: 10,
  },
  cardTitle: {
    marginBottom: 8,
    fontWeight: "600",
    color: "#222",
  },
  cardText: {
    fontSize: 14,
    marginBottom: 2,
    color: "#444",
  },
  row: {
    flexDirection: "row",
    marginTop: 6,
    alignItems: "flex-start",
    flexWrap: "wrap",
  },
  label: {
    fontWeight: "bold",
    fontSize: 14,
    color: "#333",
    marginRight: 4,
  },
  value: {
    fontSize: 14,
    color: "#444",
    flexShrink: 1,
  },
});
