import React from "react";
import { View, TouchableOpacity, Text, ActivityIndicator } from "react-native";
import { TextInput } from "react-native-paper";
import { signInStyles as styles } from "@styles/signInStyles";
import { colors } from "@theme/colors";

export function LoginForm({
  email,
  setEmail,
  password,
  setPassword,
  isLoading,
  onLogin,
}: {
  email: string;
  setEmail: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
  isLoading: boolean;
  onLogin: () => void;
}) {
  return (
    <>
      <TextInput
        style={styles.input}
        label="Email"
        mode="outlined"
        theme={{ colors: { primary: colors.secondary } }}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
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
      <TouchableOpacity
        style={styles.button}
        onPress={onLogin}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Sign In</Text>
        )}
      </TouchableOpacity>
    </>
  );
}