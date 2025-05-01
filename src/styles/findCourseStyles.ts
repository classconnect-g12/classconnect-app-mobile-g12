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
    flexDirection: "row",
    alignItems: "center",
  },
  searchInput: {
    backgroundColor: colors.inputBackground,
    flex: 1,
  },
  searchButton: {
    backgroundColor: colors.primary,
  },
  filterContainer: {
    padding: 20,
    backgroundColor: colors.background,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 10,
  },
  filterInput: {
    backgroundColor: colors.inputBackground,
    marginBottom: 10,
  },
  filterPicker: {
    backgroundColor: colors.inputBackground,
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
  courseDetails: {
    fontSize: 14,
    color: colors.text,
    opacity: 0.6,
    marginBottom: 5,
  },
  availabilityIndicator: {
    fontSize: 12,
    color: colors.error,
    fontWeight: "bold",
    marginBottom: 5,
  },
  alreadyStartedIndicator: {
    fontSize: 12,
    color: "#eb9b34",
    fontWeight: "bold",
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
