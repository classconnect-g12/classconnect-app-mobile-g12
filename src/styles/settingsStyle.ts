import { colors } from "@theme/colors";
import { StyleSheet } from "react-native";

export const settingsStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: colors.background,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "#00000088",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "85%",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 24,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#111",
  },
  modalMessage: {
    fontSize: 16,
    color: "#444",
    marginBottom: 20,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  button: {
    borderRadius: 6,
    backgroundColor: colors.primary,
  },
  buttonConfirm: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    marginLeft: 12,
  },
  cancelButton: {
    backgroundColor: "#ddd",
  },
  deleteButton: {
    borderRadius: 6,
    backgroundColor: colors.error,
  },
  cancelText: {
    color: "#333",
    fontWeight: "600",
  },
  deleteText: {
    color: "white",
    fontWeight: "600",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 24,
    textAlign: "center",
  },
  section: {
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  noPermissionsText: {
    color: "gray",
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
  },
});
