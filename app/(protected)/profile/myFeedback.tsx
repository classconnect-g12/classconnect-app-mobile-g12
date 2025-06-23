import React, { useEffect, useState } from "react";
import { View, ScrollView } from "react-native";
import { Text, Card, Button } from "react-native-paper";
import {
  getStudentFeedbacks,
  getStudentIaFeedbacks,
} from "@services/feedbackService";
import { handleApiError } from "@utils/handleApiError";
import { useSnackbar } from "@context/SnackbarContext";
import { useAuth } from "@context/authContext";
import { feedbackStyles } from "@styles/myFeedbackStyles";
import Spinner from "@components/Spinner";
import { Picker } from "@react-native-picker/picker";
import { Switch } from "react-native";

export default function MyFeedbackScreen() {
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

  const [selectedCourse, setSelectedCourse] = useState<string>("All");
  const [sortByDate, setSortByDate] = useState<boolean>(false);

  useEffect(() => {
    async function fetchFeedbacks() {
      try {
        const feedbackData = await getStudentFeedbacks({ page: 0, size: 10 });
        setFeedbacks(feedbackData.feedbacks);
        setFilteredFeedbacks(feedbackData.feedbacks);
      } catch (error) {
        handleApiError(error, showSnackbar, "Error fetching feedbacks", logout);
      } finally {
        setLoading(false);
      }
    }

    fetchFeedbacks();
  }, []);

  useEffect(() => {
    let filtered = [...feedbacks];

    if (selectedCourse !== "All") {
      filtered = filtered.filter((f) => f.courseName === selectedCourse);
    }

    if (sortByDate) {
      filtered.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }

    setFilteredFeedbacks(filtered);
  }, [selectedCourse, sortByDate, feedbacks]);

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

  const uniqueCourses = [
    "All",
    ...new Set(feedbacks.map((fb) => fb.courseName)),
  ];

  if (loading) return <Spinner />;

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
          <Text style={feedbackStyles.filterLabel}>Course:</Text>
          <Picker
            selectedValue={selectedCourse}
            onValueChange={(value) => setSelectedCourse(value)}
            style={feedbackStyles.picker}
          >
            {uniqueCourses.map((course, idx) => (
              <Picker.Item label={course} value={course} key={idx} />
            ))}
          </Picker>
        </View>

        <View style={feedbackStyles.filterRow}>
          <Text style={feedbackStyles.filterLabel}>Sort by date:</Text>
          <Switch value={sortByDate} onValueChange={setSortByDate} />
        </View>

        <Text style={[feedbackStyles.sectionTitle, { marginTop: 24 }]}>
          Your Feedbacks
        </Text>

        {filteredFeedbacks.length === 0 ? (
          <Text style={feedbackStyles.emptyMessage}>
            No feedbacks found for selected filters.
          </Text>
        ) : (
          filteredFeedbacks.map((fb) => (
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
                <View style={feedbackStyles.feedbackFooter}>
                  <Text style={feedbackStyles.author}>
                    Author: {fb.authorProfile?.user_name || "Anonymous"}
                  </Text>
                  <Text style={feedbackStyles.author}>
                    {new Date(fb.createdAt).toLocaleDateString()}
                  </Text>
                </View>
              </Card.Content>
            </Card>
          ))
        )}
      </ScrollView>
    </View>
  );
}
