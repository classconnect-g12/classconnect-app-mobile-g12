import { register } from "@/services/AuthService";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { Snackbar, TextInput } from "react-native-paper";
import { useAuth } from "../context/authContext";

export default function SignUp() {
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const { login: authLogin } = useAuth();
  const router = useRouter();

  const showSnackbar = (message: string) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };

  const handleSubmit = async () => {
    if (!username) {
      showSnackbar("Required fields are empty (username)");
      return;
    }
    if (!email) {
      showSnackbar("Required fields are empty (email)");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showSnackbar("Please enter a valid email address");
      return;
    }
    if (!password) {
      showSnackbar("Required fields are empty (password)");
      return;
    }
    if (password.length < 8){
      showSnackbar("The password must have more than 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      showSnackbar("Passwords do not match");
      return;
    }

    try {
      const token = await register(username, email, password);
      await authLogin(token);
      router.replace("../home");
    } catch (error: any) {
      showSnackbar(error.data);
      if (error?.status === 400){
        showSnackbar("Invalid fields");
      }else if (error?.status === 409){
        showSnackbar("The email is already registered");
      }else if (error?.status === 500){
        showSnackbar("Internal server Error, contact the administrator")
      }
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
        theme={{ colors: { primary: "#2b9dd6" } }}
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        label="Email"
        mode="outlined"
        theme={{ colors: { primary: "#2b9dd6" } }}
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        secureTextEntry
        label="Password"
        mode="outlined"
        theme={{ colors: { primary: "#2b9dd6" } }}
        value={password}
        onChangeText={setPassword}
      />
      <TextInput
        style={styles.input}
        secureTextEntry
        label="Confirm Password"
        mode="outlined"
        theme={{ colors: { primary: "#2b9dd6" } }}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={{ color: "#FFF" }}>Sign Up</Text>
      </TouchableOpacity>
      <Text style={styles.footerText}>
        Already have an account?{" "}
        <Link href="/login" style={styles.footerLink}>
          Sign in
        </Link>
      </Text>
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        action={{
          label: "OK",
          onPress: () => setSnackbarVisible(false),
        }}
        style={{ backgroundColor: "#ff5252" }}
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
    backgroundColor: "#FFF",
  },
  logo: {
    width: 800,
    height: 100,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
  },
  input: {
    width: "80%",
    height: 40,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  footerText: {
    marginTop: 20,
    fontSize: 14,
    color: "blue",
  },
  footerLink: {
    color: "#4683a1",
    fontWeight: "bold",
    textDecorationLine: "underline",
    marginTop: 20,
    textAlign: "center",
  },
  button: {
    width: "30%",
    alignItems: "center",
    backgroundColor: "#4683a1",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
});
