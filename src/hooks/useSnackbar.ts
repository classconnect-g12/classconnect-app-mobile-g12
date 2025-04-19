import { useState } from "react";
import { SNACKBAR_VARIANTS } from "@constants/snackbarVariants";

export const useSnackbar = () => {
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarVariant, setSnackbarVariant] = useState<"error" | "success" | "info">(SNACKBAR_VARIANTS.INFO);

  const showSnackbar = (message: string, variant: "error" | "success" | "info") => {
    setSnackbarMessage(message);
    setSnackbarVariant(variant);
    setSnackbarVisible(true);
  };

  const hideSnackbar = () => {
    setSnackbarVisible(false);
  };

  return {
    snackbarVisible,
    snackbarMessage,
    snackbarVariant,
    showSnackbar,
    hideSnackbar,
  };
};
