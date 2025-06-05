import { StyleSheet } from "react-native";
import { colors } from "@theme/colors";

export const forumStyles = StyleSheet.create({
  container: { padding: 24, flexGrow: 1, backgroundColor: colors.background },
  header: { fontWeight: "bold", fontSize: 24, marginBottom: 18, color: colors.primary },
  input: { marginBottom: 18, backgroundColor: colors.inputBackground },
  button: { marginTop: 8 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: colors.background },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.85)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "92%",
    height: "75%",
    justifyContent: "center",
    alignItems: "center",
  },
  modalImage: {
    width: "100%",
    height: "100%",
    borderRadius: 14,
  },
});