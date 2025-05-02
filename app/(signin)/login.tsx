import { login, loginWithGoogle, registerWithGoogle } from "@services/AuthService";
import { Link, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { TextInput } from "react-native-paper";
import { useAuth } from "@context/authContext";
import { signInStyles as styles } from "@styles/signInStyles";
import { colors } from "@theme/colors";
import { validateEmail, validatePasswordLength, validateUsername } from "@utils/validators";
import { AppSnackbar } from "@components/AppSnackbar";
import { SNACKBAR_VARIANTS } from "@constants/snackbarVariants";
import { useSnackbar } from "src/hooks/useSnackbar";
import auth from "@react-native-firebase/auth";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showUsernameInput, setShowUsernameInput] = useState(false);
  const [username, setUsername] = useState("");
  const [pendingIdToken, setPendingIdToken] = useState("");

  const { login: authLogin } = useAuth();
  const router = useRouter();

  const {
    snackbarVisible,
    snackbarMessage,
    snackbarVariant,
    showSnackbar,
    hideSnackbar,
  } = useSnackbar();

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        "660953493084-hns6fmmg55oo6fc11qqtmr9u04kvnsrd.apps.googleusercontent.com",
    });
  }, []);

  const handleSubmit = async () => {
    if (!email || !validateEmail(email)) return showSnackbar("Invalid email", SNACKBAR_VARIANTS.ERROR);
    if (!password || !validatePasswordLength(password)) return showSnackbar("Invalid password", SNACKBAR_VARIANTS.ERROR);

    try {
      setIsLoading(true);
      const token = await login(email, password);
      await authLogin(token);
      router.replace("../home");
    } catch (error: any) {
      showSnackbar(error.detail, SNACKBAR_VARIANTS.ERROR);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      await GoogleSignin.signOut();
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

      const userInfo: any = await GoogleSignin.signIn();
      const idToken = userInfo.idToken || userInfo.data?.idToken;

      if (!idToken) throw new Error("Google Sign-In failed: no ID token returned.");

      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      const userCredential = await auth().signInWithCredential(googleCredential);
      const firebaseIdToken = await userCredential.user.getIdToken();

      try {
        const backendToken = await loginWithGoogle(firebaseIdToken);
        await authLogin(backendToken);
        router.replace("../home");
      } catch (error: any) {
        if (error?.status === 404) {
          setShowUsernameInput(true);
          setPendingIdToken(firebaseIdToken); 
          return;
        }

        console.error("Google login error:", error);
        showSnackbar(error.detail, SNACKBAR_VARIANTS.ERROR);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    const validationError = validateUsername(username); 

    if (validationError) {
      showSnackbar(validationError, SNACKBAR_VARIANTS.ERROR); 
      return;
    }

    try {
      setIsLoading(true);
      const token = await registerWithGoogle(pendingIdToken, username);
      await authLogin(token);
      router.replace("../home");
    } catch (error: any) {
      console.error("Google registration error:", error);
      showSnackbar(error.detail, SNACKBAR_VARIANTS.ERROR);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome!</Text>
      <Text style={styles.subtitle}>Sign in to continue</Text>

      {!showUsernameInput ? (
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
          <TouchableOpacity style={[styles.button, isLoading && { opacity: 0.6 }]} onPress={handleSubmit} disabled={isLoading}>
            {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Sign In</Text>}
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, isLoading && { opacity: 0.6 }]} onPress={handleGoogleLogin} disabled={isLoading}>
            {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Sign in with Google</Text>}
          </TouchableOpacity>
        </>
      ) : (
        <>
          <TextInput
            style={styles.input}
            label="Username"
            mode="outlined"
            theme={{ colors: { primary: colors.secondary } }}
            value={username}
            onChangeText={setUsername}
          />
          <TouchableOpacity style={[styles.button, isLoading && { opacity: 0.6 }]} onPress={handleGoogleRegister} disabled={isLoading}>
            {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Continue</Text>}
          </TouchableOpacity>
        </>
      )}

      <Text style={styles.footerText}>
        Forgot Password?{" "}
        <Link href="/forgotPassword" style={styles.footerLink}>
          Reset Password
        </Link>
      </Text>
      <Text style={styles.footerText}>
        Don't have an account?{" "}
        <Link href="/register" style={styles.footerLink}>
          Sign up
        </Link>
      </Text>
      <AppSnackbar visible={snackbarVisible} message={snackbarMessage} onDismiss={hideSnackbar} variant={snackbarVariant} />
    </View>
  );
}
