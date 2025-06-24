import { StyleSheet } from "react-native";
import { colors } from "@theme/colors";

export const protectedHomeStyles = StyleSheet.create({
  background: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  welcome: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
    textAlign: "center",
    color: colors.text,
  },
  subtitle: {
    fontSize: 18,
    textAlign: "center",
    color: colors.text,
    opacity: 0.7,
    marginBottom: 20,
  },
  mainContent: {
    flex: 1,
    justifyContent: "flex-start",
  },
  searchSection: {
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
    color: colors.text,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    padding: 10,
    backgroundColor: colors.inputBackground,
    color: colors.text,
  },
  searchButton: {
    backgroundColor: colors.primary,
    borderRadius: 10,
  },
  booksContainer: {
    marginTop: 50,
    alignItems: "center",
    marginVertical: 20,
  },
  booksImage: {
    width: 150,
    height: 150,
  },
  joinSection: {
    marginTop: 40,
    alignItems: "center",
    borderRadius: 15,
  },
  joinSectionButtons: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 15,
    gap: 10,
  },
  joinTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 5,
  },
  joinSubtitle: {
    fontSize: 16,
    color: colors.text,
    opacity: 0.7,
    marginBottom: 15,
  },
  joinButton: {
    maxWidth: 170,
    backgroundColor: colors.primary,
    borderRadius: 10,
  },
  fab: {
    position: "absolute",
    right: 16,
    bottom: 16,
    backgroundColor: colors.primary,
  },
  fabHintContainer: {
    position: "absolute",
    bottom: 80,
    right: 20,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },

  fabHintText: {
    marginBottom: 22,
    fontSize: 16,
    fontWeight: "bold",
  },

  fabHintIcon: {
    margin: 0,
    backgroundColor: "transparent",
  },
});
