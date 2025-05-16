import { StyleSheet } from "react-native";
import { colors } from "@theme/colors";

export const detailCourseStyles = StyleSheet.create({
  bannerContainer: {
    marginBottom: 20,
    width: 100,
    height: 100,
    overflow: "hidden",
    borderRadius: 50,
    alignSelf: "center",
  },
  container: {
    padding: 16,
    paddingBottom: 32,
    backgroundColor: "#fff",
  },
  bannerImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    resizeMode: "cover",
    marginRight: 16,
  },
  title: {
    textDecorationLine: "underline",
    fontSize: 20,
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
    color: colors.primary,
    textDecorationLine: "underline",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
    textAlign: "justify",
  },
  sectionContainer: {
    marginTop: 10,
    marginBottom: 20,
  },
  sectionTitle: {
    textDecorationLine: "underline",
    fontSize: 18,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: 8,
  },
  sectionText: {
    textAlign: "justify",
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
  },
  sectionEmptyText: {
    textAlign: "justify",
    fontSize: 14,
    color: "gray",
    lineHeight: 24,
  },
  joinButton: {
    borderRadius: 6,
    marginTop: 20,
    backgroundColor: colors.primary,
  },
  divider: {
    height: 1,
    backgroundColor: "#CCC",
    marginVertical: 10,
    width: "100%",
  },
  teacherInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  teacherTextContainer: {
    flex: 1,
  },
});
