import React, { useState } from "react";
import {
  View,
  Text,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from "react-native";
import { TextInput, Button } from "react-native-paper";
import { router } from "expo-router";

import { colors } from "@theme/colors";
import { AppSnackbar } from "@components/AppSnackbar";
import { validateCourse } from "@utils/validators";
import { createCourseStyles as styles } from "@styles/createCourseStyles";

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
    const error = validateCourse(courseName);
    if (error) {
      showSnackbar(error);
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

      <AppSnackbar
        visible={snackbarVisible}
        message={snackbarMessage}
        onDismiss={() => setSnackbarVisible(false)}
      />
    </KeyboardAvoidingView>
  );
}
