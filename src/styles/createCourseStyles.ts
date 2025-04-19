import { StyleSheet } from "react-native";
import { colors } from "../theme/colors";

export const createCourseStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 5,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: colors.text,
    opacity: 0.7,
    marginBottom: 30,
    textAlign: "center",
  },
  inputContainer: {
    gap: 20,
  },
  input: {
    backgroundColor: colors.inputBackground,
  },
  button: {
    marginTop: 20,
    backgroundColor: colors.primary,
    paddingVertical: 8,
  },
});
