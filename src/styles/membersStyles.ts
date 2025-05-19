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
    borderColor: colors.border,
    backgroundColor: "white",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
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
    fontSize: 16,
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
  title: {
    marginTop: 10,
    marginBottom: 10,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
  sectionHeader: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: "bold",
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginTop: 16,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
});
