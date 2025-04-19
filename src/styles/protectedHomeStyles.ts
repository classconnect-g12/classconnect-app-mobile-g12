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
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 5,
    textAlign: "center",
    color: colors.text,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    color: colors.text,
    opacity: 0.7,
    marginBottom: 20,
  },
  mainContent: {
    flex: 1,
    justifyContent: "space-between",
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
    alignItems: "center",
    marginVertical: 20,
  },
  booksImage: {
    width: 150,
    height: 150,
  },
  joinSection: {
    alignItems: "center",
    backgroundColor: colors.cardBackground,
    padding: 20,
    borderRadius: 15,
    marginTop: 20,
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
    backgroundColor: colors.primary,
    paddingHorizontal: 30,
    paddingVertical: 5,
    borderRadius: 10,
  },
  fab: {
    position: "absolute",
    right: 16,
    bottom: 16,
    backgroundColor: colors.primary,
  },
});
