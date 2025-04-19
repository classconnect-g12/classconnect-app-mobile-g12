import { colors } from "@theme/colors";
import { StyleSheet } from "react-native";

export const findCourseStyles = StyleSheet.create({
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