import React, { useEffect, useState } from "react";
import { View, ScrollView } from "react-native";
import { Text, ActivityIndicator, Card, Button } from "react-native-paper";
import {
  getStudentFeedbacks,
  getStudentIaFeedbacks,
} from "@services/feedbackService";
import { handleApiError } from "@utils/handleApiError";
import { useSnackbar } from "@hooks/useSnackbar";
import { useAuth } from "@context/authContext";
import { feedbackStyles } from "@styles/myFeedbackStyles";

export default function MyFeedbackScreen() {
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
        const feedbackData = await getStudentFeedbacks({ page: 0, size: 10 });
        setFeedbacks(feedbackData.feedbacks);
      } catch (error) {
        handleApiError(error, showSnackbar, "Error fetching feedbacks", logout);
      } finally {
        setLoading(false);
      }
    }

    fetchFeedbacks();
  }, []);

  const handleGenerateSummary = async () => {
    setLoadingSummary(true);
    try {
      const summaryData = await getStudentIaFeedbacks();
      setIaSummary(summaryData);
    } catch (error) {
      handleApiError(error, showSnackbar, "Error fetching AI summary", logout);
    } finally {
      setLoadingSummary(false);
    }
  };

  if (loading) {
    return (
      <View style={feedbackStyles.centered}>
        <ActivityIndicator animating={true} size="small" color="gray" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={feedbackStyles.container}>
      {feedbacks.length === 0 ? (
        <Text style={feedbackStyles.emptyMessage}>
          You don't have any feedbacks yet.
        </Text>
      ) : (
        feedbacks.map((fb) => (
          <Card key={fb.id} style={feedbackStyles.card}>
            <Card.Content>
              <Text style={feedbackStyles.courseName}>{fb.courseName}</Text>
              <Text style={feedbackStyles.comment}>{fb.comment}</Text>
              <Text style={feedbackStyles.rating}>
                {"⭐".repeat(fb.rating)}
                <Text style={feedbackStyles.emptyStar}>
                  {"☆".repeat(5 - fb.rating)}
                </Text>
              </Text>
              <Text style={feedbackStyles.author}>
                Author: {fb.authorProfile?.user_name || "Anonymous"}
              </Text>
            </Card.Content>
          </Card>
        ))
      )}

      {feedbacks.length !== 0 && !iaSummary &&(
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
          <Card style={feedbackStyles.card}>
            <Text style={feedbackStyles.header}>AI Summary</Text>
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
        </>
      )}
    </ScrollView>
  );
}
