import { colors } from "@theme/colors";
import { StyleSheet } from "react-native";

export const viewModulesStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  moduleCard: {
    padding: 16,
    backgroundColor: "#f2f2f2",
    borderRadius: 8,
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
  },
  description: {
    fontSize: 14,
    color: "#555",
    marginTop: 4,
  },
  order: {
    fontSize: 12,
    marginTop: 8,
    color: "#999",
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
});
