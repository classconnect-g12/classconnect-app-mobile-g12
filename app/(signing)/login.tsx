import { Link } from "expo-router";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

import { TextInput } from "react-native-paper";

export default function SignIn() {
  return (
    <View style={styles.container}>
      {/* <Image source={require('../../assets/images/classconnect-logo.png')} style={styles.logo} resizeMode="contain"/> */}
      <Text style={styles.title}>Welcome!</Text>
      <Text style={styles.subtitle}>Sign in to continue</Text>
      <TextInput
        style={styles.input}
        label="Email"
        mode="outlined"
        theme={{ colors: { primary: "#2b9dd6" } }}
      />
      <TextInput
        style={styles.input}
        secureTextEntry
        label="Password"
        mode="outlined"
        theme={{ colors: { primary: "#2b9dd6" } }}
      />
      <TouchableOpacity style={styles.button}>
        <Text style={{ color: "#FFF" }}>Sign In</Text>
      </TouchableOpacity>
      <Text style={styles.footerText}>Forgot Password?</Text>
      <Text style={styles.footerText}>
        Don't have an account?
        <Link href="/register" style={styles.footerLink}>Sign up</Link>
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
