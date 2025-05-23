import { colors } from "@theme/colors";
import { StyleSheet } from "react-native";

export const feedbackStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 16,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "white",
    borderRadius: 4,
    marginVertical: 8,
  },
  header: {
    textAlign: "center",
    textDecorationLine: "underline",
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 12,
  },
  button: {
    borderRadius: 6,
    backgroundColor: colors.primary,
    marginTop: 16,
  },
  emptyMessage: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "gray",
  },
  courseName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  comment: {
    fontSize: 16,
    marginVertical: 4,
  },
  rating: {
    fontSize: 16,
    marginVertical: 4,
  },
  emptyStar: {
    fontSize: 20,
    color: '#CCCCCC',
  },
  author: {
    fontSize: 16,
    color: "gray",
  },
  averageRating: {
    fontSize: 16,
    fontWeight: "bold",
  },
  totalFeedbacks: {
    fontSize: 16,
    marginVertical: 4,
  },
  summary: {
    fontSize: 16,
    marginVertical: 4,
  },
});
