import { StyleSheet } from "react-native";
import { colors } from "@theme/colors";

export const detailCourseStyles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
  },
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
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
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
  feedbackContainer: {
    borderWidth: 1,
    borderColor: "green",
    borderRadius: 12,
    backgroundColor: "#F9F9F9",
    marginTop: 24,
    marginBottom: 24,
    paddingHorizontal: 20,
    paddingVertical: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },

  iconTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },

  finishedTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 8,
    color: colors.success,
  },

  finishedMessage: {
    fontSize: 15,
    textAlign: "center",
    color: colors.text,
    marginBottom: 16,
  },

  feedbackButton: {
    borderRadius: 8,
    backgroundColor: colors.primary,
    alignSelf: "center",
    paddingHorizontal: 20,
    paddingVertical: 6,
  },

  feedbackButtonLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "white",
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
});
