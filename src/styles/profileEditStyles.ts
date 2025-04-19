import { colors } from "@theme/colors";
import { StyleSheet } from "react-native";

export const profileEditStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollContainer: {
      padding: 20,
      alignItems: "center",
    },
    centeredContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colors.background,
    },
    header: {
      alignItems: "center",
      marginVertical: 20,
    },
    avatar: {
      width: 120,
      height: 120,
      borderRadius: 60,
      borderWidth: 3,
      borderColor: colors.border,
      backgroundColor: colors.inputBackground,
    },
    iconButton: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 12,
      backgroundColor: colors.primary,
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 25,
    },
    iconButtonText: {
      color: colors.buttonText,
      marginLeft: 8,
      fontWeight: "600",
    },
    userName: {
      fontSize: 26,
      fontWeight: "bold",
      color: colors.text,
    },
    inputCard: {
      width: "100%",
      backgroundColor: colors.cardBackground,
      borderRadius: 10,
      marginBottom: 15,
      paddingHorizontal: 15,
      paddingVertical: 10,
      shadowColor: colors.shadow,
      shadowOpacity: 0.1,
      shadowRadius: 5,
      elevation: 3,
    },
    label: {
      fontSize: 14,
      color: colors.text,
      marginBottom: 6,
      fontWeight: "500",
    },
    input: {
      fontSize: 16,
      color: colors.text,
      paddingVertical: 6,
    },
    email: {
      fontSize: 14,
      color: colors.text,
      backgroundColor: colors.cardBackground,
      padding: 12,
      borderRadius: 10,
      shadowColor: colors.shadow,
      shadowOpacity: 0.1,
      shadowRadius: 5,
      elevation: 2,
    },
    saveButton: {
      backgroundColor: colors.primary,
      paddingVertical: 12,
      paddingHorizontal: 25,
      borderRadius: 25,
      marginTop: 20,
      width: "60%",
      alignItems: "center",
    },
    saveButtonText: {
      fontSize: 16,
      color: colors.buttonText,
      fontWeight: "bold",
    },
    loadingText: {
      fontSize: 18,
      color: colors.text,
      marginTop: 10,
    },
    errorText: {
      fontSize: 18,
      color: colors.error,
      textAlign: "center",
      paddingHorizontal: 30,
    },
  });