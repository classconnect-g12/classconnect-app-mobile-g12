import { login, register } from "@services/AuthService";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { TextInput } from "react-native-paper";
import { useAuth } from "@context/authContext";
import { colors } from "@theme/colors";
import { signUpStyles as styles } from "@styles/signUpStyles";
import { AppSnackbar } from "@components/AppSnackbar";
import { validateEmail, validatePasswordLength, validateUsername } from "@utils/validators";
import { SNACKBAR_VARIANTS } from "@constants/snackbarVariants";
import { useSnackbar } from "src/hooks/useSnackbar";
import * as SecureStore from "expo-secure-store"; 
import { PinVerificationModal } from "@components/PinVerificationModal";

const saveCredentials = async (email: string, password: string) => {
  await SecureStore.setItemAsync("biometric_email", email);
  await SecureStore.setItemAsync("biometric_password", password);
};


export default function SignUp() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [showVerifyModal, setShowVerifyModal] = useState(false);

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

    if(validateUsername(username) != null){
      return showSnackbar(
        "Username must be between 5 and 30 characters long",
        SNACKBAR_VARIANTS.ERROR
      );
    }
    
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
      setIsLoading(true);
      const token = await register(username, email, password);
      await authLogin(token);

      await saveCredentials(email, password);

      router.replace("../home");
      showSnackbar("Account created successfully!", SNACKBAR_VARIANTS.SUCCESS);
    } catch (error: any) {
        if (error?.title === "Account Not Verified" || error?.status === 403) {
          router.replace({
            pathname: "/(signin)/login",
            params: { email, showVerify: "1" }
          });
          return;
        }
        showSnackbar(error.detail, SNACKBAR_VARIANTS.ERROR);
      } finally {
        setIsLoading(false);
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

      <PinVerificationModal
        visible={showVerifyModal}
        onClose={() => setShowVerifyModal(false)}
        email={email}
        showSnackbar={showSnackbar}
        onVerified={async () => {
          try {
            setIsLoading(true);
            const token = await login(email, password);
            await authLogin(token);
            await saveCredentials(email, password);
            router.replace("../home");
            showSnackbar("Account verified and logged in!", SNACKBAR_VARIANTS.SUCCESS);
          } catch (error: any) {
            showSnackbar("Could not log in automatically. Please try manually.", SNACKBAR_VARIANTS.ERROR);
            router.replace("/(signin)/login");
          } finally {
            setIsLoading(false);
          }
        }}
      />

      <AppSnackbar
        visible={snackbarVisible}
        message={snackbarMessage}
        onDismiss={hideSnackbar}
        variant={snackbarVariant}
      />
    </View>
  );
}
