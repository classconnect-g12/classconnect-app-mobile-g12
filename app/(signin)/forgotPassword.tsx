import { Link } from "expo-router";
import { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { TextInput } from "react-native-paper";

import { forgotPasswordStyles as styles } from "@styles/forgotPasswordStyles";
import { colors } from "@theme/colors";
import { validateEmail } from "@utils/validators";
import { AppSnackbar } from "@components/AppSnackbar";
import { useSnackbar } from "@hooks/useSnackbar";
import { SNACKBAR_VARIANTS } from "@constants/snackbarVariants";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  const {
    snackbarVisible,
    snackbarMessage,
    snackbarVariant,
    showSnackbar,
    hideSnackbar,
  } = useSnackbar();

  const handleSubmit = async () => {
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

    // TODO: Lógica futura para recuperación vía email
    showSnackbar(
      "Password reset instructions sent to your email",
      SNACKBAR_VARIANTS.INFO
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Forgot Password</Text>
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
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Send</Text>
      </TouchableOpacity>
      <Text style={styles.footerText}>
        Remember your password?{" "}
        <Link href="/login" style={styles.footerLink}>
          Sign in
        </Link>
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
