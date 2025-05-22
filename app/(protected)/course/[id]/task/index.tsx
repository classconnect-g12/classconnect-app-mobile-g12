import { useState, useCallback } from "react";
import { View, FlatList, Alert } from "react-native";
import { Text, Card, ActivityIndicator, AnimatedFAB } from "react-native-paper";
import { useRouter } from "expo-router";
import {
  Assessment,
  deleteAssessment,
  getAssessmentsByCourse,
} from "@services/AssessmentService";
import { useCourse } from "@context/CourseContext";
import { handleApiError } from "@utils/handleApiError";
import { useSnackbar } from "@context/SnackbarContext";
import { useAuth } from "@context/authContext";
import { useFocusEffect } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { colors } from "@theme/colors";
import { viewModulesStyles as styles } from "@styles/viewModulesStyles";
import { SNACKBAR_VARIANTS } from "@constants/snackbarVariants";

export default function TasksScreen() {
  const [tasks, setTasks] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { courseId, isTeacher } = useCourse();
  const { showSnackbar } = useSnackbar();
  const { logout } = useAuth();

  const loadTasks = async () => {
    setLoading(true);
    try {
      const assessments = await getAssessmentsByCourse(
        courseId as string,
        0,
        10,
        "TASK"
      );
      setTasks(assessments);
    } catch (error) {
      handleApiError(error, showSnackbar, "Error loading tasks", logout);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (courseId) {
        loadTasks();
      }
    }, [courseId])
  );

  const handleDelete = (taskId: number) => {
    Alert.alert(
      "Confirm delete",
      "Are you sure you want to delete this task?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteAssessment(courseId as string, taskId);
              showSnackbar("Task deleted", SNACKBAR_VARIANTS.SUCCESS);
              setTasks((prevTasks) =>
                prevTasks.filter((task) => task.id !== taskId)
              );
            } catch (error) {
              handleApiError(
                error,
                showSnackbar,
                "Error deleting task",
                logout
              );
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const renderItem = ({ item }: { item: Assessment }) => (
    <Card style={styles.moduleCard}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <MaterialCommunityIcons
          name="clipboard-text-outline"
          size={24}
          color={colors.primary}
          style={{ marginRight: 8 }}
        />
        <Text style={styles.title}>{item.title}</Text>
      </View>

      <Text style={styles.description}>{item.instructions}</Text>
      <Text style={styles.order}>
        Deadline: {new Date(item.startDate).toLocaleString()}
      </Text>

      {isTeacher && (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-end",
            marginTop: 8,
          }}
        >
          {new Date(item.startDate).getTime() < Date.now() ? (
            <>
              <MaterialCommunityIcons
                name="pencil-outline"
                size={24}
                color={colors.primary}
                style={{ marginRight: 16, opacity: 0.3 }}
              />
              <MaterialCommunityIcons
                name="trash-can-outline"
                size={24}
                color={colors.error}
                disabled={true}
                style={{ opacity: 0.3 }}
              />
            </>
          ) : (
            <>
              <MaterialCommunityIcons
                name="pencil-outline"
                size={24}
                color={colors.primary}
                onPress={() => {
                  router.push(`/course/${courseId}/task/editTask/${item.id}`);
                }}
                style={{ marginRight: 16 }}
              />
              <MaterialCommunityIcons
                name="trash-can-outline"
                size={24}
                color={colors.error}
                onPress={() => handleDelete(item.id)}
              />
            </>
          )}
        </View>
      )}
    </Card>
  );

  if (loading) {
    return (
      <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Tasks</Text>

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.empty}>No tasks available</Text>
        }
      />

      {isTeacher && (
        <AnimatedFAB
          icon="plus"
          label=""
          extended={false}
          onPress={() =>
            router.push(`/(protected)/course/${courseId}/task/new`)
          }
          style={styles.fab}
          visible
          animateFrom="right"
          color={colors.buttonText}
        />
      )}
    </View>
  );
}
