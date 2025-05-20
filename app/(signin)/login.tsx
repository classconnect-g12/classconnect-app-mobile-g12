import {
  login,
  loginWithGoogle,
  registerWithGoogle,
} from "@services/AuthService";
import { Link, useRouter } from "expo-router";
import { useEffect, useState, useContext } from "react";
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
import { AppSnackbar } from "@components/AppSnackbar";
import { SNACKBAR_VARIANTS } from "@constants/snackbarVariants";
import { useSnackbar } from "src/hooks/useSnackbar";
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

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showUsernameInput, setShowUsernameInput] = useState(false);
  const [username, setUsername] = useState("");
  const [pendingIdToken, setPendingIdToken] = useState("");
  const [activeButton, setActiveButton] = useState<
    "email" | "google" | "register" | null
  >(null);

  const { login: authLogin } = useAuth();
  const router = useRouter();

  const {
    snackbarVisible,
    snackbarMessage,
    snackbarVariant,
    showSnackbar,
    hideSnackbar,
  } = useSnackbar();
  const notificationContext = useContext(NotificationContext);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        "660953493084-hns6fmmg55oo6fc11qqtmr9u04kvnsrd.apps.googleusercontent.com",
    });
  }, []);

  const syncUserData = async () => {
    if (!notificationContext) {
      console.error("⚠️ NotificationContext no está disponible.");
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

  const handleSubmit = async () => {
    if (!email || !validateEmail(email))
      return showSnackbar("Invalid email", SNACKBAR_VARIANTS.ERROR);
    if (!password || !validatePasswordLength(password))
      return showSnackbar("Invalid password", SNACKBAR_VARIANTS.ERROR);

    try {
      setActiveButton("email");
      setIsLoading(true);
      const token = await login(email, password);
      await authLogin(token);

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

        await syncUserData();

        router.replace("../home");
      } catch (error: any) {
        
        if (error?.status === 404) {
          setShowUsernameInput(true);
          setPendingIdToken(firebaseIdToken);
          return;
        }
        

        console.error("Google login error:", error.status);
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

      await syncUserData();

      router.replace("../home");
    } catch (error: any) {
      console.error("Google registration error:", error);
      showSnackbar(error.detail, SNACKBAR_VARIANTS.ERROR);
    } finally {
      setActiveButton(null);
      setIsLoading(false);
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
            onPress={handleSubmit}
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
      <AppSnackbar
        visible={snackbarVisible}
        message={snackbarMessage}
        onDismiss={hideSnackbar}
        variant={snackbarVariant}
      />
    </View>
  );
}
