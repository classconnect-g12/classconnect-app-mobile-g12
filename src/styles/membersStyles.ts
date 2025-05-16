import { StyleSheet } from "react-native";
import { colors } from "@theme/colors";
import { Title } from "react-native-paper";

export const membersStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  memberItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderBottomWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.cardBackground,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.inputBackground,
  },
  memberInfo: {
    flex: 1,
    marginLeft: 12,
  },
  name: {
    color: colors.text,
    fontWeight: "bold",
  },
  username: {
    color: colors.textMuted,
  },
  roleIcon: {
    width: 40,
    height: 40,
  },
  role: {
    color: "#888",
    fontSize: 12,
    fontStyle: "italic",
  },
  title:{
    marginTop: 10,
    marginBottom: 10,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    color: colors.primary,
    textDecorationLine: "underline"
  }
});
