import React from "react";
import { Snackbar } from "react-native-paper";
import { colors } from "../theme/colors";

interface Props {
  visible: boolean;
  message: string;
  onDismiss: () => void;
}

export const AppSnackbar = ({ visible, message, onDismiss }: Props) => (
  <Snackbar
    visible={visible}
    onDismiss={onDismiss}
    duration={3000}
    style={{ backgroundColor: colors.error }}
  >
    {message}
  </Snackbar>
);
