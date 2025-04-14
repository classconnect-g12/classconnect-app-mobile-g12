import { register } from "@/services/AuthService";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { TextInput } from "react-native-paper";
import { useAuth } from "../context/authContext";

export default function SignUp() {
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const {login: authLogin} = useAuth();
  const router = useRouter();

  const handleSubmit = async () => {
    if (!username) {
      Alert.alert("Error", "Completa el email");
      return;
    }
    if (!email) {
      Alert.alert("Error", "Completa el email");
      return;
    }
    if (!password) {
      Alert.alert("Error", "Completa la contraseña");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Las contraseñas no coinciden");
      return;
    }

    try {
      const token = await register(username, email, password);
      await authLogin(token);
      Alert.alert("Registro exitoso", "¡Bienvenido!");
      router.replace("../home");
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
        return;
      } else {
        Alert.alert("Ha ocurrido un error en el servidor");
        return;
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
