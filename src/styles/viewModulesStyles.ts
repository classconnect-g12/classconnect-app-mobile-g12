import { colors } from "@theme/colors";
import { StyleSheet } from "react-native";

export const viewModulesStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  heading: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 16,
  },
  headingSec: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
    textDecorationLine: "underline",
  },
  moduleCard: {
    backgroundColor: "#f9f9f9",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontWeight: "bold",
    fontSize: 18,
  },
  courseTitle: {
    textDecorationLine: "underline",
    color: colors.primary,
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: "#555",
    marginTop: 8,
  },
  order: {
    alignSelf: "flex-end",
    marginTop: 8,
    backgroundColor: "#e0e0e0",
  },
  orderDate: {
    fontSize: 16,
    marginTop: 8,
    backgroundColor: "#e0e0e0",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
  },
  error: {
    color: "red",
    padding: 16,
  },
  list: {
    paddingBottom: 16,
  },
  empty: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#999",
  },
  fab: {
    position: "absolute",
    right: 16,
    bottom: 16,
    backgroundColor: colors.primary,
  },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignSelf: "flex-start",
    marginBottom: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: colors.primary,
  },
});
