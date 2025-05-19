import { colors } from "@theme/colors";
import { StyleSheet } from "react-native";

export const moreStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  header: {
    textDecorationLine: "underline",
    color: colors.secondary,
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  button: {
    paddingLeft: 16,
    marginTop: 10,
    borderRadius: 8,
    marginBottom: 12,
  },
  buttonText: {
    fontSize: 16,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
  },
});
