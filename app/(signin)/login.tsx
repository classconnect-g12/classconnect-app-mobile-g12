import { login } from "@services/AuthService";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { TextInput } from "react-native-paper";
import { useAuth } from "@context/authContext";
import { signInStyles as styles } from "@styles/signInStyles";
import { colors } from "@theme/colors";
import { validateEmail, validatePasswordLength } from "@utils/validators";
import { AppSnackbar } from "@components/AppSnackbar";
import { SNACKBAR_VARIANTS } from "@constants/snackbarVariants";
import { useSnackbar } from "src/hooks/useSnackbar";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { login: authLogin } = useAuth();
  const router = useRouter();

  const {
    snackbarVisible,
    snackbarMessage,
    snackbarVariant,
    showSnackbar,
    hideSnackbar,
  } = useSnackbar();

  const handleSubmit = async () => {
    if (!email)
      return showSnackbar(
        "Required fields are empty (email)",
        SNACKBAR_VARIANTS.ERROR
      );
    if (!validateEmail(email))
      return showSnackbar(
        "Please enter a valid email address",
        SNACKBAR_VARIANTS.ERROR
      );
    if (!password)
      return showSnackbar(
        "Required fields are empty (password)",
        SNACKBAR_VARIANTS.ERROR
      );
    if (!validatePasswordLength(password))
      return showSnackbar(
        "The password must have more than 8 characters.",
        SNACKBAR_VARIANTS.ERROR
      );

    try {
      const token = await login(email, password);
      await authLogin(token);
      router.replace("../home");
    } catch (error: any) {
      showSnackbar(error.detail, SNACKBAR_VARIANTS.ERROR);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome!</Text>
      <Text style={styles.subtitle}>Sign in to continue</Text>
      <TextInput
        style={styles.input}
        label="Email"
        mode="outlined"
        theme={{ colors: { primary: colors.secondary } }}
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        secureTextEntry
        label="Password"
        mode="outlined"
        theme={{ colors: { primary: colors.secondary } }}
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>
      <Text style={styles.footerText}>
        Forgot Password?{" "}
        <Link href="/forgotPassword" style={styles.footerLink}>
          Reset Password
        </Link>
      </Text>
      <Text style={styles.footerText}>
        Don't have an account?{" "}
        <Link href="/register" style={styles.footerLink}>
          Sign up
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
