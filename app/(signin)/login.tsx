import {
  login,
  loginWithGoogle,
  registerWithGoogle,
} from "@services/AuthService";
import { Link, useRouter } from "expo-router";
import { useEffect, useState, useContext, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from "react-native";
import { TextInput } from "react-native-paper";
import { useAuth } from "@context/authContext";
import { signInStyles as styles } from "@styles/signInStyles";
import { colors } from "@theme/colors";
import {
  validateEmail,
  validatePasswordLength,
  validateUsername,
} from "@utils/validators";
import { SNACKBAR_VARIANTS } from "@constants/snackbarVariants";
import { useSnackbar } from "@context/SnackbarContext";
import auth from "@react-native-firebase/auth";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import {
  getAllNotifications,
  getNotificationPreferences,
} from "@services/NotificationService";
import {
  NotificationContext,
  defaultPreferences,
} from "@context/notificationContext";
import { PreferencesResponse, NotificationType } from "@src/types/notification";
import { images } from "@assets/images";
import ReactNativeBiometrics from "react-native-biometrics";
import * as SecureStore from "expo-secure-store";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const saveCredentials = async (
  email: string,
  password?: string,
  firebaseIdToken?: string
) => {
  await SecureStore.setItemAsync("biometric_email", email);
  if (password) {
    await SecureStore.setItemAsync("biometric_password", password);
    await SecureStore.deleteItemAsync("biometric_firebase_token");
  } else if (firebaseIdToken) {
    await SecureStore.deleteItemAsync("biometric_password");
    await SecureStore.setItemAsync("biometric_firebase_token", firebaseIdToken);
  } else {
    await SecureStore.deleteItemAsync("biometric_password");
    await SecureStore.deleteItemAsync("biometric_firebase_token");
  }
};

const getCredentials = async () => {
  const email = await SecureStore.getItemAsync("biometric_email");
  const password = await SecureStore.getItemAsync("biometric_password");
  const firebaseIdToken = await SecureStore.getItemAsync("biometric_firebase_token");
  return { email, password, firebaseIdToken };
};

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showUsernameInput, setShowUsernameInput] = useState(false);
  const [username, setUsername] = useState("");
  const [pendingIdToken, setPendingIdToken] = useState("");
  const [activeButton, setActiveButton] = useState<
    "email" | "google" | "register" | "biometric" | null
  >(null);

  const { login: authLogin } = useAuth();
  const router = useRouter();

  const { showSnackbar } = useSnackbar();
  const notificationContext = useContext(NotificationContext);

  const triedAutoBiometric = useRef(false);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        "660953493084-hns6fmmg55oo6fc11qqtmr9u04kvnsrd.apps.googleusercontent.com",
    });
  }, []);

  useEffect(() => {
    const autoBiometric = async () => {
      if (triedAutoBiometric.current) return;
      triedAutoBiometric.current = true;

      const { email: savedEmail, password: savedPassword, firebaseIdToken } = await getCredentials();
      if (!savedEmail) return; 

      const rnBiometrics = new ReactNativeBiometrics();
      const { available } = await rnBiometrics.isSensorAvailable();
      if (!available) return;

      const { success } = await rnBiometrics.simplePrompt({ promptMessage: "Authenticate to sign in" });
      if (success) {
        if (savedPassword) {
          await handleSubmit(savedEmail, savedPassword);
        } else if (firebaseIdToken) {
          try {
            setActiveButton("google");
            setIsLoading(true);
            const backendToken = await loginWithGoogle(firebaseIdToken);
            await authLogin(backendToken);
            await syncUserData();
            router.replace("../home");
          } catch (error: any) {
            showSnackbar(
              error?.detail || "Error with biometric Google login",
              SNACKBAR_VARIANTS.ERROR
            );
          } finally {
            setIsLoading(false);
            setActiveButton(null);
          }
        }
      }
    };

    autoBiometric();
  }, []);
  const syncUserData = async () => {
    if (!notificationContext) {
      console.error("⚠️ NotificationContext is not available.");
      return;
    }

    const {
      setNotifications,
      setNotificationPreferences,
      setHasNewNotifications,
    } = notificationContext;

    try {
      const response: PreferencesResponse = await getNotificationPreferences();
      const prefs = response.preferences;

      const newPrefs: { [key in NotificationType]: boolean } = {
        ...defaultPreferences,
      };

      Object.keys(newPrefs).forEach((key) => {
        newPrefs[key as NotificationType] = prefs.includes(
          key as NotificationType
        );
      });

      setNotificationPreferences(newPrefs);

      const loadedNotifications = await getAllNotifications();
      setNotifications(loadedNotifications);
      setHasNewNotifications(loadedNotifications.length > 0);
    } catch (error) {
      console.error("❌ Error syncing user data:", error);
    }
  };

  const handleSubmit = async (customEmail?: string, customPassword?: string) => {
    const usedEmail = customEmail ?? email;
    const usedPassword = customPassword ?? password;

    if (!usedEmail || !validateEmail(usedEmail))
      return showSnackbar("Invalid email", SNACKBAR_VARIANTS.ERROR);
    if (!usedPassword || !validatePasswordLength(usedPassword))
      return showSnackbar("Invalid password", SNACKBAR_VARIANTS.ERROR);

    try {
      setActiveButton("email");
      setIsLoading(true);
      const token = await login(usedEmail, usedPassword);
      await authLogin(token);

      await saveCredentials(usedEmail, usedPassword);
      await syncUserData();

      router.replace("../home");
    } catch (error: any) {
      showSnackbar(error.detail, SNACKBAR_VARIANTS.ERROR);
    } finally {
      setIsLoading(false);
      setActiveButton(null);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setActiveButton("google");
      setIsLoading(true);
      await GoogleSignin.signOut();
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });

      const userInfo: any = await GoogleSignin.signIn();
      const idToken = userInfo.idToken || userInfo.data?.idToken;

      if (!idToken)
        throw new Error("Google Sign-In failed: no ID token returned.");

      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      const userCredential = await auth().signInWithCredential(
        googleCredential
      );
      const firebaseIdToken = await userCredential.user.getIdToken();

      try {
        const backendToken = await loginWithGoogle(firebaseIdToken);
        await authLogin(backendToken);

        const googleEmail =
          userCredential.user.email || email || userInfo.user?.email;
        if (googleEmail) {
          await saveCredentials(googleEmail, undefined, firebaseIdToken);
        }

        await syncUserData();

        router.replace("../home");
      } catch (error: any) {
        if (error?.status === 404) {
          setShowUsernameInput(true);
          setPendingIdToken(firebaseIdToken);
          return;
        }
        showSnackbar(error.detail, SNACKBAR_VARIANTS.ERROR);
      }
    } finally {
      setActiveButton(null);
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
      setActiveButton("register");
      setIsLoading(true);
      const token = await registerWithGoogle(pendingIdToken, username);
      await authLogin(token);

      await saveCredentials(email, undefined, pendingIdToken);

      await syncUserData();

      router.replace("../home");
    } catch (error: any) {
      showSnackbar(error.detail, SNACKBAR_VARIANTS.ERROR);
    } finally {
      setActiveButton(null);
      setIsLoading(false);
    }
  };

  const handleBiometricLogin = async () => {
    try {
      setActiveButton("biometric");
      setIsLoading(true);

      const rnBiometrics = new ReactNativeBiometrics();
      const { available } = await rnBiometrics.isSensorAvailable();

      if (!available) {
        showSnackbar("Biometric authentication not available", SNACKBAR_VARIANTS.ERROR);
        return;
      }

      const { success } = await rnBiometrics.simplePrompt({ promptMessage: "Authenticate to sign in" });

      if (success) {
        const { email: savedEmail, password: savedPassword, firebaseIdToken } = await getCredentials();
        if (!savedEmail) {
          showSnackbar("No credentials saved for biometric login. Please sign in manually first.", SNACKBAR_VARIANTS.ERROR);
          return;
        }
        if (savedPassword) {
          await handleSubmit(savedEmail, savedPassword);
        } else if (firebaseIdToken) {
          try {
            setActiveButton("google");
            setIsLoading(true);
            const backendToken = await loginWithGoogle(firebaseIdToken);
            await authLogin(backendToken);
            await syncUserData();
            router.replace("../home");
          } catch (error: any) {
            showSnackbar(
              error?.detail || "Error with biometric Google login",
              SNACKBAR_VARIANTS.ERROR
            );
          } finally {
            setIsLoading(false);
            setActiveButton(null);
          }
        } else {
          showSnackbar("No credentials saved for biometric login. Please sign in manually first.", SNACKBAR_VARIANTS.ERROR);
        }
      } else {
        showSnackbar("Biometric authentication failed", SNACKBAR_VARIANTS.ERROR);
      }
    } catch (error) {
      showSnackbar("Error during biometric login", SNACKBAR_VARIANTS.ERROR);
    } finally {
      setIsLoading(false);
      setActiveButton(null);
    }
  };
  return (
    <View style={styles.container}>
      <View>
        <Image source={images.logo} style={styles.logo} resizeMode="contain" />
      </View>
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
          <TouchableOpacity
            style={[
              styles.button,
              isLoading && activeButton !== "email" && { opacity: 0.6 },
            ]}
            onPress={() => handleSubmit()}
            disabled={isLoading}
          >
            {isLoading && activeButton === "email" ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Sign In</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.buttonGoogle,
              isLoading && activeButton !== "google" && { opacity: 0.6 },
            ]}
            onPress={handleGoogleLogin}
            disabled={isLoading}
          >
            {isLoading && activeButton === "google" ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Sign in with Google</Text>
            )}
          </TouchableOpacity>

          <View style={{ alignItems: "center", marginTop: 20 }}>
            <TouchableOpacity
              style={{
                backgroundColor: colors.secondary,
                borderRadius: 32,
                width: 56,
                height: 56,
                justifyContent: "center",
                alignItems: "center",
                elevation: 3,
                shadowColor: "#000",
                shadowOpacity: 0.15,
                shadowRadius: 8,
              }}
              onPress={handleBiometricLogin}
              disabled={isLoading}
            >
              {isLoading && activeButton === "biometric" ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Icon name="fingerprint" size={32} color="#fff" />
              )}
            </TouchableOpacity>
            <Text style={{ marginTop: 8, color: colors.secondary, fontWeight: "bold" }}>
              Biometrics
            </Text>
          </View>
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
          <TouchableOpacity
            style={[
              styles.button,
              isLoading && activeButton !== "register" && { opacity: 0.6 },
            ]}
            onPress={handleGoogleRegister}
            disabled={isLoading}
          >
            {isLoading && activeButton === "register" ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Continue</Text>
            )}
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
    </View>
  );
}
