import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Snackbar, Avatar } from "react-native-paper";
import { colors } from "@theme/colors";

type Variant = "error" | "success" | "info";

interface Props {
  visible: boolean;
  message: string;
  onDismiss: () => void;
  variant?: Variant;
}

const variantStyles = {
  error: {
    backgroundColor: colors.error,
    icon: "alert-circle",
  },
  success: {
    backgroundColor: colors.success,
    icon: "check-circle",
  },
  info: {
    backgroundColor: colors.info,
    icon: "information",
  },
};

export const AppSnackbar = ({
  visible,
  message,
  onDismiss,
  variant = "info",
}: Props) => {
  const { backgroundColor, icon } = variantStyles[variant];

  return (
    <Snackbar
      visible={visible}
      onDismiss={onDismiss}
      duration={3000}
      style={[styles.snackbar, { backgroundColor }]}
      action={{
        label: "OK",
        onPress: onDismiss,
        textColor: "white",
      }}
    >
      <View style={styles.content}>
        <Avatar.Icon
          size={24}
          icon={icon}
          color="white"
          style={[styles.icon, { backgroundColor: "transparent" }]}
        />
        <Text style={styles.text}>{message}</Text>
      </View>
    </Snackbar>
  );
};

const styles = StyleSheet.create({
  snackbar: {
    borderRadius: 8,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: 8,
  },
  text: {
    color: "white",
    flexShrink: 1,
  },
});
