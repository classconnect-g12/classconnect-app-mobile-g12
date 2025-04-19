import { StyleSheet } from "react-native";
import { colors } from "@theme/colors";

export const forgotPasswordStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: colors.text,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 30,
    color: colors.text,
  },
  input: {
    width: "80%",
    marginBottom: 15,
  },
  button: {
    width: "80%",
    padding: 15,
    borderRadius: 8,
    backgroundColor: colors.primary,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: "600",
  },
  footerText: {
    marginTop: 20,
    color: colors.text,
  },
  footerLink: {
    color: colors.primary,
    fontWeight: "bold",
  },
});
