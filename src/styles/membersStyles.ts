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
  actions: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: "auto",
  },
  modalContainer: {
    backgroundColor: "white",
    padding: 20,
    marginHorizontal: 30,
    borderRadius: 16,
    elevation: 4,
    maxHeight: "80%",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalBox: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    elevation: 6,
    width: "85%",
    alignSelf: "center",
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  modalSubTitle: {
    fontSize: 16,
    marginBottom: 12,
    textAlign: "center",
  },
  scrollContainer: {
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    borderWidth: 1,
    borderColor: "gray",
    maxHeight: 250,
  },

  permissionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
  },

  permissionLabel: {
    fontSize: 14,
  },
  confirmButton: {
    marginLeft: 8,
    borderRadius: 6,
    backgroundColor: colors.primary,
    marginBottom: 10,
  },
  cancelButton: {
    borderRadius: 6,
    backgroundColor: colors.background,
    marginBottom: 10,
  },
  confirmModalBox: {
    backgroundColor: "white",
    marginHorizontal: 30,
    padding: 20,
    borderRadius: 8,
    elevation: 5,
  },
  selectButton: {
    borderTopWidth: 0,
    marginBottom: 8,
    borderTopRightRadius: 0,
    borderTopLeftRadius: 0,
    borderRadius: 6,
  },
  confirmButtonRemove: {
    marginLeft: 8,
    borderRadius: 6,
    backgroundColor: "#d32f2f",
    marginBottom: 10,
  },
});
