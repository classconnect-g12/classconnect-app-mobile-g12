import { Link } from "expo-router";
import { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Snackbar, TextInput } from "react-native-paper";
import { colors } from "./../../theme/colors";

export default function ForgotPassword() {
  const [email, setEmail] = useState<string>("");
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const showSnackbar = (message: string) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };

  const handleSubmit = async () => {
    if (!email) {
      showSnackbar("Please enter your email address");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showSnackbar("Please enter a valid email address");
      return;
    }
    // Aquí iría la lógica para enviar el correo de recuperación
    showSnackbar("Password reset instructions sent to your email");
  };

  return (
    <View style={styles.container}>
      {/* <Image source={require('../../assets/images/classconnect-logo.png')} style={styles.logo} resizeMode="contain"/> */}
      <Text style={styles.title}>Forgot Password</Text>
      <Text style={styles.subtitle}>Enter your email to reset your password</Text>
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
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        style={{ backgroundColor: colors.error }}
      >
        {snackbarMessage}
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: colors.text,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 30,
    color: colors.text,
  },
  input: {
    width: "80%",
    marginBottom: 15,
  },
  button: {
    width: "80%",
    padding: 15,
    borderRadius: 8,
    backgroundColor: colors.primary,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: "600",
  },
  footerText: {
    marginTop: 20,
    color: colors.text,
  },
  footerLink: {
    color: colors.primary,
    fontWeight: "bold",
  },
});
