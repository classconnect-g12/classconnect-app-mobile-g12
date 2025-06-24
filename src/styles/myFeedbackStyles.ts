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
    borderWidth: 1,
    borderColor: "gray",
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
    width: "50%",
    alignSelf: "center",
    borderRadius: 6,
    backgroundColor: colors.primary,
    marginTop: 16,
    marginBottom: 16,
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
    color: "#CCCCCC",
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
    fontWeight: "bold",
    marginVertical: 4,
  },
  summary: {
    borderTopWidth: 1,
    borderTopColor: "gray",
    paddingTop: 8,
    fontSize: 16,
    marginVertical: 4,
  },
  sectionTitle: {
    textDecorationLine: "underline",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
    marginTop: 16,
    color: "#333",
  },

  placeholderText: {
    fontSize: 16,
    marginTop: 16,
    fontStyle: "italic",
    color: "#777",
    marginBottom: 16,
    textAlign: "center",
  },
  filterRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
    paddingHorizontal: 8,
  },
  picker: {
    flex: 1,
    marginLeft: 10,
  },
  feedbackFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginRight: 10,
  },
  sectionFilter: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
