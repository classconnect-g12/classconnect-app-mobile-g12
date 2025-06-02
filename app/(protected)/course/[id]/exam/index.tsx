import { useState, useCallback } from "react";
import { View, FlatList, Alert } from "react-native";
import { Text, Card, AnimatedFAB } from "react-native-paper";
import { useRouter } from "expo-router";
import {
  Assessment,
  AssessmentStatus,
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
import Spinner from "@components/Spinner";
import AssessmentFilters from "@components/AssessmentFilter";
import { formatStatus } from "@utils/statusFormatter";
import {
  CREATE_ASSESSMENT,
  DELETE_ASSESSMENT,
  EDIT_ASSESSMENT,
  REVIEW_ASSESSMENT,
} from "@constants/permissions";

const PAGE_SIZE = 10;

export default function ExamsScreen() {
  const [exams, setExams] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const router = useRouter();
  const { courseId, isTeacher, courseDetail } = useCourse();
  const { showSnackbar } = useSnackbar();
  const { userId, logout } = useAuth();

  const { course } = courseDetail;
  const hasPermission = (perm: string) => course.permissions.includes(perm);

  const [selectedStatus, setSelectedStatus] = useState<AssessmentStatus | null>(
    null
  );
  const [dateFrom, setDateFrom] = useState<Date | null>(null);
  const [dateTo, setDateTo] = useState<Date | null>(null);

  const filteredItems = exams.filter((item) => {
    if (selectedStatus && item.status !== selectedStatus) return false;
    const itemDate = new Date(item.startDate);
    if (dateFrom && itemDate < dateFrom) return false;
    if (dateTo && itemDate > dateTo) return false;
    return true;
  });

  const loadInitialExams = async () => {
    setLoading(true);
    try {
      const assessments = await getAssessmentsByCourse(
        courseId as string,
        0,
        PAGE_SIZE,
        "EXAM"
      );
      setExams(assessments);
      setPage(1);
      setHasMore(assessments.length === PAGE_SIZE);
    } catch (error) {
      handleApiError(error, showSnackbar, "Error loading exams", logout);
    } finally {
      setLoading(false);
    }
  };

  const loadMoreExams = async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    try {
      const assessments = await getAssessmentsByCourse(
        courseId as string,
        page,
        PAGE_SIZE,
        "EXAM"
      );
      setExams((prev) => [...prev, ...assessments]);
      setPage((prev) => prev + 1);
      setHasMore(assessments.length === PAGE_SIZE);
    } catch (error) {
      handleApiError(error, showSnackbar, "Error loading more exams", logout);
    } finally {
      setLoadingMore(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (courseId) {
        loadInitialExams();
      }
    }, [courseId])
  );

  const handleDelete = (examId: number) => {
    Alert.alert(
      "Confirm delete",
      "Are you sure you want to delete this exam?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteAssessment(courseId as string, examId);
              showSnackbar("Exam deleted", SNACKBAR_VARIANTS.SUCCESS);
              setExams((prevExams) =>
                prevExams.filter((exam) => exam.id !== examId)
              );
            } catch (error) {
              handleApiError(
                error,
                showSnackbar,
                "Error deleting exam",
                logout
              );
            }
          },
        },
      ]
    );
  };

  const renderItem = ({ item }: { item: Assessment }) => {
    const isEditable =
      (isTeacher || hasPermission(EDIT_ASSESSMENT)) &&
      new Date(item.startDate).getTime() > Date.now();

    const isDeletable =
      (isTeacher || hasPermission(DELETE_ASSESSMENT)) &&
      new Date(item.startDate).getTime() > Date.now();

    return (
      <Card
        style={styles.moduleCard}
        onPress={() => {
          if (isTeacher || hasPermission(REVIEW_ASSESSMENT)) {
            router.push(`/course/${courseId}/exam/view/${item.id}`);
          } else {
            if (item.status === "OVERDUE" || item.status === "COMPLETED") {
              router.push(
                `/course/${courseId}/${item.type.toLowerCase()}/view/${
                  item.id
                }/${userId}`
              );
              {
                /* 
                Alert.alert(
                  "Unavailable exam",
                  item.status === "OVERDUE"
                    ? "You cannot complete this exam because the time limit has expired."
                    : "You have already completed this exam."
                );
                */
              }
            } else {
              router.push(`/course/${courseId}/exam/complete/${item.id}`);
            }
          }
        }}
      >
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

        <View style={{ flexDirection: "row", marginTop: 8 }}>
          <Text>Status: </Text>
          <Text
            style={{
              fontWeight: "bold",
              color:
                item.status === "PENDING"
                  ? "blue"
                  : item.status === "IN_PROGRESS" || item.status === "COMPLETED"
                  ? "green"
                  : item.status === "FINISHED" || item.status === "OVERDUE"
                  ? "red"
                  : "black",
            }}
          >
            {formatStatus(item.status)}
          </Text>
        </View>
        <View>
          <Text style={styles.order}>
            Start: {new Date(item.startDate).toLocaleString()}
          </Text>
          <Text style={styles.order}>
            Due: {new Date(item.endDate).toLocaleString()}
          </Text>
        </View>

        {(isTeacher ||
          hasPermission(EDIT_ASSESSMENT) ||
          hasPermission(DELETE_ASSESSMENT)) && (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-end",
              marginTop: 8,
            }}
          >
            <MaterialCommunityIcons
              name="pencil-outline"
              size={24}
              color={colors.primary}
              onPress={
                isEditable
                  ? () =>
                      router.push(
                        `/course/${courseId}/exam/editExam/${item.id}`
                      )
                  : undefined
              }
              style={{ marginRight: 16, opacity: isEditable ? 1 : 0.3 }}
            />

            <MaterialCommunityIcons
              name="trash-can-outline"
              size={24}
              color={colors.error}
              onPress={isDeletable ? () => handleDelete(item.id) : undefined}
              style={{ opacity: isDeletable ? 1 : 0.3 }}
            />
          </View>
        )}
      </Card>
    );
  };

  if (loading) return <Spinner />;

  return (
    <View style={styles.container}>
      <AssessmentFilters
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        dateFrom={dateFrom}
        dateTo={dateTo}
        onDateFromChange={setDateFrom}
        onDateToChange={setDateTo}
        isProfessor={isTeacher}
      />

      <FlatList
        data={filteredItems}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.empty}>No exams available</Text>
        }
        onEndReached={loadMoreExams}
        onEndReachedThreshold={0.5}
        ListFooterComponent={loadingMore ? <Spinner /> : null}
      />

      {(isTeacher || hasPermission(CREATE_ASSESSMENT)) && (
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
    </View>
  );
}
