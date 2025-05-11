import { StyleSheet } from "react-native";
import { colors } from "@theme/colors";

export const detailCourseStyles = StyleSheet.create({
  bannerContainer: {
    marginBottom: 20,
    height: 200,
    overflow: "hidden",
    borderRadius: 8,
  },
  container: {
    padding: 16,
    paddingBottom: 32,
    backgroundColor: "#fff",
  },
  bannerImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
    color: colors.primary,
  },
  card: {
    marginBottom: 20,
    borderRadius: 10,
    backgroundColor: colors.background,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
    color: colors.primary,
  },
  description: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: 8,
  },
  sectionText: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
  },
  joinButton: {
    marginTop: 20,
    backgroundColor: colors.primary,
  },
});
