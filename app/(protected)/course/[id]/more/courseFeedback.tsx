import React, { useEffect, useState } from "react";
import { View, ScrollView } from "react-native";
import { Text, Card, Button } from "react-native-paper";
import {
  getCourseFeedbacks,
  getCourseIaFeedbacks,
} from "@services/feedbackService";
import { handleApiError } from "@utils/handleApiError";
import { useSnackbar } from "@context/SnackbarContext";
import { useAuth } from "@context/authContext";
import { feedbackStyles } from "@styles/myFeedbackStyles";
import { useCourse } from "@context/CourseContext";
import Spinner from "@components/Spinner";

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
    if (!courseId) return;
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
        <Spinner />
    );
  }

  return (
    <View style={feedbackStyles.container}>
      <ScrollView>
        <Text style={feedbackStyles.sectionTitle}>AI Summary</Text>

        <Button
          mode="contained"
          onPress={handleGenerateSummary}
          loading={loadingSummary}
          icon="robot"
          style={feedbackStyles.button}
          disabled={feedbacks.length === 0}
        >
          {iaSummary ? "Regenerate" : "Generate"}
        </Button>

        {iaSummary ? (
          <Card style={feedbackStyles.card}>
            <Card.Content>
              <Text style={feedbackStyles.averageRating}>
                Average rating: {iaSummary.averageRating} ⭐
              </Text>
              <Text style={feedbackStyles.totalFeedbacks}>
                Total feedbacks: {iaSummary.totalFeedbacks}
              </Text>
              <Text style={feedbackStyles.summary}>{iaSummary.summary}</Text>
            </Card.Content>
          </Card>
        ) : (
          <Card style={feedbackStyles.card}>
            <Card.Content>
              <Text style={feedbackStyles.placeholderText}>
                No AI summary generated yet.
              </Text>
            </Card.Content>
          </Card>
        )}

        <Text style={[feedbackStyles.sectionTitle, { marginTop: 24 }]}>
          Course Feedbacks
        </Text>

        {feedbacks.length === 0 ? (
          <Text style={feedbackStyles.emptyMessage}>
            No feedbacks available for this course.
          </Text>
        ) : (
          feedbacks.map((fb) => (
            <Card key={fb.id} style={feedbackStyles.card}>
              <Card.Content>
                <Text style={feedbackStyles.comment}>{fb.comment}</Text>
                <Text style={feedbackStyles.rating}>
                  {"⭐".repeat(fb.rating)}
                  <Text style={feedbackStyles.emptyStar}>
                    {"☆".repeat(5 - fb.rating)}
                  </Text>
                </Text>
                <Text style={feedbackStyles.author}>
                  {new Date(fb.createdAt).toLocaleDateString()}
                </Text>
              </Card.Content>
            </Card>
          ))
        )}
      </ScrollView>
    </View>
  );
}
