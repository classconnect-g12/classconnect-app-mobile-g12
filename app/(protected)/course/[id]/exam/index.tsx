import { useEffect, useState, useCallback } from "react";
import { View, FlatList } from "react-native";
import { Text, Card, ActivityIndicator, AnimatedFAB } from "react-native-paper";
import { useRouter } from "expo-router";
import { Assesment, getAssesmentsByCourse } from "@services/AssesmentService";
import { useCourse } from "@context/CourseContext";
import { handleApiError } from "@utils/handleApiError";
import { useSnackbar } from "@hooks/useSnackbar";
import { useAuth } from "@context/authContext";
import { AppSnackbar } from "@components/AppSnackbar";
import { useFocusEffect } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { colors } from "@theme/colors";
import { viewModulesStyles as styles } from "@styles/viewModulesStyles";

export default function ExamsScreen() {
  const [exams, setExams] = useState<Assesment[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { courseId, isTeacher } = useCourse();
  const {
    snackbarVisible,
    snackbarMessage,
    snackbarVariant,
    showSnackbar,
    hideSnackbar,
  } = useSnackbar();
  const { logout } = useAuth();

  const loadExams = async () => {
    setLoading(true);
    try {
      const assessments = await getAssesmentsByCourse(
        courseId as string,
        0,
        10,
        "EXAM"
      );
      setExams(assessments);
    } catch (error) {
      handleApiError(error, showSnackbar, "Error loading exams", logout);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (courseId) {
        loadExams();
        console.log(exams);
      }
    }, [courseId])
  );

  const renderItem = ({ item }: { item: Assesment }) => (
    <Card style={styles.moduleCard}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <MaterialCommunityIcons
          name="file-document-outline"
          size={24}
          color={colors.primary}
          style={{ marginRight: 8 }}
        />
        <Text style={styles.title}>{item.title}</Text>
      </View>
      <Text style={styles.description}>{item.instructions}</Text>
      <Text style={styles.order}>
        Start: {new Date(item.startDate).toLocaleString()}
      </Text>
    </Card>
  );

  if (loading) {
    return (
      <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Exams</Text>

      <FlatList
        data={exams}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.empty}>No exams available</Text>
        }
      />

      {isTeacher && (
        <AnimatedFAB
          icon="plus"
          label=""
          extended={false}
          onPress={() =>
            router.push(`/(protected)/course/${courseId}/exam/new`)
          }
          style={styles.fab}
          visible
          animateFrom="right"
          color={colors.buttonText}
        />
      )}

      <AppSnackbar
        visible={snackbarVisible}
        message={snackbarMessage}
        onDismiss={hideSnackbar}
        variant={snackbarVariant}
      />
    </View>
  );
}
