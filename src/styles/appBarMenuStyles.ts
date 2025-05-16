import { StyleSheet } from "react-native";
import { colors } from "@theme/colors";

export const appbarMenuStyles = StyleSheet.create({
  header: {
    backgroundColor: colors.background,
    elevation: 4,
  },
  title: {
    opacity: 0.6,
  },
  notificationContainer: {
    position: "relative",
    marginRight: 10,
  },
  badge: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: "red",
  },
  modalContainer: {
    backgroundColor: colors.cardBackground,
    padding: 20,
    marginHorizontal: 20,
    borderRadius: 10,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  modalTitle: {
    fontWeight: "bold",
    color: colors.text,
  },
  settingsModalTitle: {
    fontWeight: "bold",
    marginBottom: 10,
    color: colors.text,
  },
  settingsIcon: {
    marginLeft: 10,
  },
  card: {
    marginBottom: 10,
    backgroundColor: colors.cardBackground,
    borderWidth: 2,
    borderColor: "black",
  },
  cardTitle: {
    color: colors.text,
  },
  cardBody: {
    color: colors.text,
  },
  cardDate: {
    fontSize: 12,
    color: colors.text,
  },
  settingsItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 5,
  },
  settingsText: {
    color: colors.text,
    fontSize: 18,
  },
  closeButton: {
    backgroundColor: colors.primary,
  },
  closeButtonLabel: {
    fontWeight: "bold",
    color: colors.buttonText,
  },
  noNotificationsText: {
    textAlign: "center",
    color: colors.text,
    marginTop: 20,
    marginBottom: 20,
  },
  secondHeaderStyle: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    backgroundColor: "white",
    borderTopWidth: 0.5,
    borderTopColor: "#e0e0e0",
    borderBottomWidth: 1.5,
    borderBottomColor: "#b0b0b0",
    paddingVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
});
