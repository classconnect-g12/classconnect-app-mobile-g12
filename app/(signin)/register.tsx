import { register } from "@services/AuthService";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { TextInput } from "react-native-paper";

import { useAuth } from "@context/authContext";
import { colors } from "@theme/colors";
import { signUpStyles as styles } from "@styles/signUpStyles";
import { AppSnackbar } from "@components/AppSnackbar";
import { validateEmail, validatePasswordLength } from "@utils/validators";

export default function SignUp() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const { login: authLogin } = useAuth();
  const router = useRouter();

  const showSnackbar = (message: string) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };

  const handleSubmit = async () => {
    if (!username) return showSnackbar("Required fields are empty (username)");
    if (!email) return showSnackbar("Required fields are empty (email)");
    if (!validateEmail(email))
      return showSnackbar("Please enter a valid email address");
    if (!password) return showSnackbar("Required fields are empty (password)");
    if (!validatePasswordLength(password))
      return showSnackbar("The password must have more than 8 characters.");
    if (password !== confirmPassword)
      return showSnackbar("Passwords do not match");

    try {
      const token = await register(username, email, password);
      await authLogin(token);
      router.replace("../home");
    } catch (error: any) {
      showSnackbar(error.detail);
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
        onDismiss={() => setSnackbarVisible(false)}
      />
    </View>
  );
}
