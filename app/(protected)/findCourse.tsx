import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  FlatList,
} from "react-native";
import { TextInput, Button, Snackbar, Card } from "react-native-paper";
import { router } from "expo-router";
import { colors } from "../../theme/colors";

interface Course {
  id: string;
  name: string;
  description: string;
  instructor: string;
}

export default function FindCourse() {
  const [searchQuery, setSearchQuery] = useState("");
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const showSnackbar = (message: string) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      showSnackbar("Please enter a search term");
      return;
    }

    setIsLoading(true);
    // TODO: Implement course search API call
    // Simulated API response
    setTimeout(() => {
      setCourses([
        {
          id: "1",
          name: "Introduction to React Native",
          description: "Learn the basics of React Native development",
          instructor: "John Doe",
        },
        {
          id: "2",
          name: "Advanced JavaScript",
          description: "Deep dive into JavaScript concepts",
          instructor: "Jane Smith",
        },
      ]);
      setIsLoading(false);
    }, 1000);
  };

  const handleJoinCourse = (courseId: string) => {
    // TODO: Implement join course API call
    showSnackbar("Successfully joined the course!");
    router.back();
  };

  const renderCourse = ({ item }: { item: Course }) => (
    <Card style={styles.courseCard}>
      <Card.Content>
        <Text style={styles.courseName}>{item.name}</Text>
        <Text style={styles.courseDescription}>{item.description}</Text>
        <Text style={styles.instructor}>Instructor: {item.instructor}</Text>
      </Card.Content>
      <Card.Actions>
        <Button
          mode="contained"
          onPress={() => handleJoinCourse(item.id)}
          style={styles.joinButton}
          labelStyle={{ color: colors.buttonText }}
        >
          Join Course
        </Button>
      </Card.Actions>
    </Card>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Find a Course</Text>
        <Text style={styles.subtitle}>Search for courses to join</Text>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          label="Search Courses"
          value={searchQuery}
          onChangeText={setSearchQuery}
          mode="outlined"
          style={styles.searchInput}
          theme={{ colors: { primary: colors.primary } }}
        />
        <Button
          mode="contained"
          onPress={handleSearch}
          style={styles.searchButton}
          labelStyle={{ color: colors.buttonText }}
          loading={isLoading}
        >
          Search
        </Button>
      </View>

      <FlatList
        data={courses}
        renderItem={renderCourse}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.courseList}
        ListEmptyComponent={() => 
          !isLoading ? (
            <Text style={styles.emptyText}>
              {searchQuery
                ? "No courses found. Try a different search term."
                : "Search for courses to join"}
            </Text>
          ) : null
        }
      />

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        style={{ backgroundColor: colors.error }}
      >
        {snackbarMessage}
      </Snackbar>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: colors.text,
    opacity: 0.7,
  },
  searchContainer: {
    padding: 20,
    gap: 10,
  },
  searchInput: {
    backgroundColor: colors.inputBackground,
  },
  searchButton: {
    backgroundColor: colors.primary,
  },
  courseList: {
    padding: 20,
    gap: 15,
  },
  courseCard: {
    backgroundColor: colors.cardBackground,
    marginBottom: 10,
  },
  courseName: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 5,
  },
  courseDescription: {
    fontSize: 14,
    color: colors.text,
    opacity: 0.8,
    marginBottom: 5,
  },
  instructor: {
    fontSize: 14,
    color: colors.text,
    opacity: 0.6,
  },
  joinButton: {
    backgroundColor: colors.primary,
  },
  emptyText: {
    textAlign: "center",
    color: colors.text,
    opacity: 0.7,
    marginTop: 20,
  },
}); 