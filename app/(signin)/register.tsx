import { register } from "@services/AuthService";
import { Link, useRouter } from "expo-router";
import * as Location from "expo-location";
import { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { TextInput } from "react-native-paper";
import { useAuth } from "@context/authContext";
import { colors } from "@theme/colors";
import { signUpStyles as styles } from "@styles/signUpStyles";
import { AppSnackbar } from "@components/AppSnackbar";
import { validateEmail, validatePasswordLength } from "@utils/validators";
import { SNACKBAR_VARIANTS } from "@constants/snackbarVariants";
import { useSnackbar } from "src/hooks/useSnackbar";

export default function SignUp() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

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
    if (!username)
      return showSnackbar(
        "Required fields are empty (username)",
        SNACKBAR_VARIANTS.ERROR
      );
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
    if (password !== confirmPassword)
      return showSnackbar("Passwords do not match", SNACKBAR_VARIANTS.ERROR);

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        return showSnackbar(
          "Permission to access location was denied",
          SNACKBAR_VARIANTS.ERROR
        );
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      const token = await register(username, email, password, {
        latitude,
        longitude,
      });

      await authLogin(token);
      router.replace("../home");
      showSnackbar("Account created successfully!", SNACKBAR_VARIANTS.SUCCESS);
    } catch (error: any) {
      showSnackbar(
        error.detail || "An unexpected error occurred",
        SNACKBAR_VARIANTS.ERROR
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.subtitle}>Sign up to get started</Text>
      <TextInput
        style={styles.input}
        label="Username"
        mode="outlined"
        theme={{ colors: { primary: colors.secondary } }}
        value={username}
        onChangeText={setUsername}
      />
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
      <TextInput
        style={styles.input}
        secureTextEntry
        label="Confirm Password"
        mode="outlined"
        theme={{ colors: { primary: colors.secondary } }}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
      <Text style={styles.footerText}>
        Already have an account?{" "}
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
