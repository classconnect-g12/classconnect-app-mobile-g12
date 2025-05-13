import { SNACKBAR_VARIANTS } from "@constants/snackbarVariants";
import { ApiError } from "@src/types/apiError";

export const handleApiError = (
  error: unknown,
  showSnackbar: (
    message: string,
    variant: "error" | "success" | "info"
  ) => void,
  defaultMessage = "An error occurred",
  logout: () => void
) => {
  const apiError = error as ApiError;
  let errorMessage = apiError.detail || apiError.title || defaultMessage;

  /*
  if (apiError.status === 401) {
    errorMessage = "Please log in to continue";
  } else if (apiError.status === 404) {
    return;
  } else if (apiError.status === 423) {
    showSnackbar(
      "Your session is locked. Please log in again.",
      SNACKBAR_VARIANTS.ERROR
    );
    setTimeout(() => logout(), 2000);
    return;
  }
  */

  showSnackbar(errorMessage, SNACKBAR_VARIANTS.ERROR);
};
