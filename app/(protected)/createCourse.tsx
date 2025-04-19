import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from "react-native";
import { TextInput, Button, Snackbar } from "react-native-paper";
import { router } from "expo-router";
import { colors } from "../../theme/colors";

export default function CreateCourse() {
  const [courseName, setCourseName] = useState("");
  const [description, setDescription] = useState("");
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const showSnackbar = (message: string) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };

  const handleCreateCourse = async () => {
    if (!courseName.trim()) {
      showSnackbar("Please enter a course name");
      return;
    }

    if (courseName.length < 3) {
      showSnackbar("Course name must be at least 3 characters long");
      return;
    }

    if (courseName.length > 50) {
      showSnackbar("Course name cannot be longer than 50 characters");
      return;
    }

    // TODO: Implement course creation API call
    showSnackbar("Course created successfully!");
    router.back();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Create New Course</Text>
        <Text style={styles.subtitle}>Fill in the course details</Text>

        <View style={styles.inputContainer}>
          <TextInput
            label="Course Name"
            value={courseName}
            onChangeText={setCourseName}
            mode="outlined"
            style={styles.input}
            theme={{ colors: { primary: colors.primary } }}
          />

          <TextInput
            label="Description (Optional)"
            value={description}
            onChangeText={setDescription}
            mode="outlined"
            multiline
            numberOfLines={4}
            style={styles.input}
            theme={{ colors: { primary: colors.primary } }}
          />

          <Button
            mode="contained"
            onPress={handleCreateCourse}
            style={styles.button}
            labelStyle={{ color: colors.buttonText }}
          >
            Create Course
          </Button>
        </View>
      </ScrollView>

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
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 5,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: colors.text,
    opacity: 0.7,
    marginBottom: 30,
    textAlign: "center",
  },
  inputContainer: {
    gap: 20,
  },
  input: {
    backgroundColor: colors.inputBackground,
  },
  button: {
    marginTop: 20,
    backgroundColor: colors.primary,
    paddingVertical: 8,
  },
}); 