import { Link } from "expo-router";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

import { TextInput } from "react-native-paper";

export default function forgotPassword() {
  return (
    <View style={styles.container}>
      {/* <Image source={require('../../assets/images/classconnect-logo.png')} style={styles.logo} resizeMode="contain"/> */}
      <Text style={styles.title}>Reset your password</Text>
      <Text style={styles.subtitle}>
        Enter your email and you will receive a verification email to generate a
        new password.
      </Text>
      <TextInput
        style={styles.input}
        label="Email"
        mode="outlined"
        theme={{ colors: { primary: "#2b9dd6" } }}
      />
      <TouchableOpacity style={styles.button}>
        <Text style={{ color: "#FFF" }}>Send</Text>
      </TouchableOpacity>
      <Link href="/login" style={styles.footerLink}>
        Back to login
      </Link>
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
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    width: "80%",
    textAlign: "center",
    fontSize: 16,
    marginBottom: 20,
  },
  input: {
    width: "80%",
    height: 40,
    paddingHorizontal: 10,
    marginBottom: 15,
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
