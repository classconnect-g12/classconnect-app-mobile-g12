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
  disabled = false,
}: {
  email: string;
  setEmail: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
  isLoading: boolean;
  onLogin: () => void;
  disabled?: boolean;
}) {
  const isButtonDisabled = isLoading || disabled;

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
        style={[
          styles.button,
          isButtonDisabled && { opacity: 0.5 },
        ]}
        onPress={onLogin}
        disabled={isButtonDisabled}
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