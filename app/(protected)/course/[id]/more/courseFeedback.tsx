import React, { useEffect, useState } from "react";
import { View, ScrollView, Switch, StyleSheet } from "react-native";
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
import { Picker } from "@react-native-picker/picker";
import Spinner from "@components/Spinner";

export default function CourseFeedbackScreen() {
  const { courseId } = useCourse();
  const { showSnackbar } = useSnackbar();
  const { logout } = useAuth();

  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [filteredFeedbacks, setFilteredFeedbacks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [iaSummary, setIaSummary] = useState<null | {
    summary: string;
    averageRating: number;
    totalFeedbacks: number;
  }>(null);
  const [loadingSummary, setLoadingSummary] = useState(false);

  const [sortByDate, setSortByDate] = useState(false);
  const [selectedRating, setSelectedRating] = useState<number>(0);

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
        setFilteredFeedbacks(response.feedbacks);
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

  useEffect(() => {
    let filtered = [...feedbacks];

    if (selectedRating > 0) {
      filtered = filtered.filter((fb) => fb.rating === selectedRating);
    }

    if (sortByDate) {
      filtered.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }

    setFilteredFeedbacks(filtered);
  }, [feedbacks, sortByDate, selectedRating]);

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
    return <Spinner />;
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

        <Text style={[feedbackStyles.sectionFilter, { marginTop: 24 }]}>
          Filter Feedbacks
        </Text>
        <View style={feedbackStyles.filterRow}>
          <Text style={feedbackStyles.filterLabel}>Rating:</Text>
          <Picker
            selectedValue={selectedRating}
            onValueChange={(value) => setSelectedRating(value)}
            style={feedbackStyles.picker}
          >
            <Picker.Item label="All" value={0} />
            <Picker.Item label="⭐ (1)" value={1} />
            <Picker.Item label="⭐⭐ (2)" value={2} />
            <Picker.Item label="⭐⭐⭐ (3)" value={3} />
            <Picker.Item label="⭐⭐⭐⭐ (4)" value={4} />
            <Picker.Item label="⭐⭐⭐⭐⭐ (5)" value={5} />
          </Picker>
        </View>

        <View style={feedbackStyles.filterRow}>
          <Text style={feedbackStyles.filterLabel}>Sort by date:</Text>
          <Switch value={sortByDate} onValueChange={setSortByDate} />
        </View>

        <Text style={[feedbackStyles.sectionTitle, { marginTop: 24 }]}>
          Course Feedbacks
        </Text>

        {filteredFeedbacks.length === 0 ? (
          <Text style={feedbackStyles.emptyMessage}>
            No feedbacks match the selected filters.
          </Text>
        ) : (
          filteredFeedbacks.map((fb) => (
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
