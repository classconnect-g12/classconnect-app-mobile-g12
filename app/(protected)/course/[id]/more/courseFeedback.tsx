import React, { useEffect, useState } from "react";
import { View, ScrollView } from "react-native";
import { Text, ActivityIndicator, Card, Button } from "react-native-paper";
import {
  getCourseFeedbacks,
  getCourseIaFeedbacks,
} from "@services/feedbackService";
import { handleApiError } from "@utils/handleApiError";
import { useSnackbar } from "@context/SnackbarContext";
import { useAuth } from "@context/authContext";
import { feedbackStyles } from "@styles/myFeedbackStyles";
import { useCourse } from "@context/CourseContext";

export default function CourseFeedbackScreen() {
  const { courseId } = useCourse();
  const { showSnackbar } = useSnackbar();
  const { logout } = useAuth();

  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [iaSummary, setIaSummary] = useState<null | {
    summary: string;
    averageRating: number;
    totalFeedbacks: number;
  }>(null);
  const [loadingSummary, setLoadingSummary] = useState(false);

  useEffect(() => {
    async function fetchFeedbacks() {
      try {
        if (!courseId) {
          setFeedbacks([]);
          return;
        }
        const response = await getCourseFeedbacks(courseId, {
          page: 0,
          size: 10,
        });
        console.log(response);
        setFeedbacks(response.feedbacks);
      } catch (error) {
        handleApiError(
          error,
          showSnackbar,
          "Error fetching course feedbacks",
          logout
        );
      } finally {
        setLoading(false);
      }
    }

    fetchFeedbacks();
  }, [courseId]);

  const handleGenerateSummary = async () => {
    if (!courseId) {
      console.error("Course ID is missing.");
      return;
    }
    setLoadingSummary(true);
    try {
      const summaryData = await getCourseIaFeedbacks(courseId);
      setIaSummary(summaryData);
    } catch (error) {
      handleApiError(error, showSnackbar, "Error fetching AI summary", logout);
    } finally {
      setLoadingSummary(false);
    }
  };

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "white",
        }}
      >
        <ActivityIndicator animating={true} size="small" color="gray" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <ScrollView contentContainerStyle={feedbackStyles.container}>
        {!feedbacks || feedbacks.length === 0 ? (
          <Text style={feedbackStyles.emptyMessage}>
            No feedbacks available for this course.
          </Text>
        ) : (
          feedbacks.map((fb) => (
            <Card key={fb.id} style={feedbackStyles.card}>
              <Card.Content>
                <Text>{fb.comment}</Text>
                <Text>Rating: {fb.rating} ⭐</Text>
                <Text>Date: {fb.createdAt}</Text>
              </Card.Content>
            </Card>
          ))
        )}

        {feedbacks && feedbacks.length > 0 && (
          <Button
            mode="contained"
            onPress={handleGenerateSummary}
            loading={loadingSummary}
            style={feedbackStyles.button}
          >
            Generate AI Summary
          </Button>
        )}

        {iaSummary && (
          <>
            <Text style={feedbackStyles.header}>AI Summary</Text>
            <Card style={feedbackStyles.card}>
              <Card.Content>
                <Text>Average rating: {iaSummary.averageRating} ⭐</Text>
                <Text>Total feedbacks: {iaSummary.totalFeedbacks}</Text>
                <Text>{iaSummary.summary}</Text>
              </Card.Content>
            </Card>
          </>
        )}
      </ScrollView>
    </View>
  );
}
