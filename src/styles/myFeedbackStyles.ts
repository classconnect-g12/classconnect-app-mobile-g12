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
    marginVertical: 8,
  },
  header: {
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
});
