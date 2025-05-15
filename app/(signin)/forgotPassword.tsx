import { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { TextInput } from "react-native-paper";

import { forgotPasswordStyles as styles } from "@styles/forgotPasswordStyles";
import { colors } from "@theme/colors";
import { validateEmail } from "@utils/validators";
import { AppSnackbar } from "@components/AppSnackbar";
import { useSnackbar } from "@hooks/useSnackbar";
import { SNACKBAR_VARIANTS } from "@constants/snackbarVariants";
import { resetPassword, resetPasswordWithCode } from "@services/AuthService";
import { useRouter } from "expo-router";
import { handleApiError } from "@utils/handleApiError";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState("email");
  const router = useRouter();

  const {
    snackbarVisible,
    snackbarMessage,
    snackbarVariant,
    showSnackbar,
    hideSnackbar,
  } = useSnackbar();

  const handleSubmitEmail = async () => {
    if (!email) {
      showSnackbar("Please enter your email address", SNACKBAR_VARIANTS.ERROR);
      return;
    }
    if (!validateEmail(email)) {
      showSnackbar(
        "Please enter a valid email address",
        SNACKBAR_VARIANTS.ERROR
      );
      return;
    }

    try {
      const message = await resetPassword(email);
      showSnackbar(message, SNACKBAR_VARIANTS.INFO);
      setStep("code");
    } catch (error: any) {
      handleApiError(error, showSnackbar, "Error resetting password");
    }
  };

  const handleSubmitCode = async () => {
    if (!resetCode) {
      showSnackbar("Please enter the reset code", SNACKBAR_VARIANTS.ERROR);
      return;
    }
    if (!newPassword || !confirmPassword) {
      showSnackbar(
        "Please enter and confirm your new password",
        SNACKBAR_VARIANTS.ERROR
      );
      return;
    }
    if (newPassword !== confirmPassword) {
      showSnackbar("Passwords do not match", SNACKBAR_VARIANTS.ERROR);
      return;
    }

    try {
      const message = await resetPasswordWithCode(
        email,
        resetCode,
        newPassword
      );
      showSnackbar(message, SNACKBAR_VARIANTS.SUCCESS);
      router.replace("/(signin)/login");
    } catch (error: any) {
      handleApiError(error, showSnackbar, "Error resetting password");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Forgot Password</Text>

      {step === "email" ? (
        <>
          <Text style={styles.subtitle}>
            Enter your email to reset your password
          </Text>
          <TextInput
            style={styles.input}
            label="Email"
            mode="outlined"
            theme={{ colors: { primary: colors.secondary } }}
            value={email}
            onChangeText={setEmail}
          />
          <TouchableOpacity style={styles.button} onPress={handleSubmitEmail}>
            <Text style={styles.buttonText}>Send</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={styles.subtitle}>Enter the code sent to your email</Text>
          <TextInput
            style={styles.input}
            label="Reset Code"
            mode="outlined"
            theme={{ colors: { primary: colors.secondary } }}
            value={resetCode}
            onChangeText={setResetCode}
          />

          <Text style={styles.subtitle}>Enter your new password</Text>
          <TextInput
            style={styles.input}
            label="New Password"
            mode="outlined"
            secureTextEntry
            theme={{ colors: { primary: colors.secondary } }}
            value={newPassword}
            onChangeText={setNewPassword}
          />

          <TextInput
            style={styles.input}
            label="Confirm Password"
            mode="outlined"
            secureTextEntry
            theme={{ colors: { primary: colors.secondary } }}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />

          <TouchableOpacity style={styles.button} onPress={handleSubmitCode}>
            <Text style={styles.buttonText}>Verify Code & Reset Password</Text>
          </TouchableOpacity>
        </>
      )}
      <Text style={styles.footerText}>
        Already have an account?{" "}
        <Text onPress={router.back} style={styles.footerLink}>
          Go back
        </Text>
      </Text>

      <AppSnackbar
        visible={snackbarVisible}
        message={snackbarMessage}
        onDismiss={hideSnackbar}
        variant={snackbarVariant}
      />
    </View>
  );
}
