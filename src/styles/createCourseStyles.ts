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
    borderRadius: 6,
    backgroundColor: colors.primary,
  },
  buttonAddQuestion: {
    borderRadius: 6,
    width: "50%",
    alignSelf: "flex-end",
    backgroundColor: colors.secondary,
  },
  datePickerContainer: {
    marginVertical: 10,
  },
  dateLabel: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 5,
  },
  datePicker: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 5,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: colors.inputBackground,
    marginBottom: 10,
  },
  datePickerText: {
    fontSize: 16,
    color: colors.text,
    flex: 1,
  },
  datePickerIcon: {
    marginLeft: 8,
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 8,
  },
});
