import { useState, useContext } from "react";
import { useRouter } from "expo-router";
import { useAuth } from "@context/authContext";
import { useSnackbar } from "@context/SnackbarContext";
import { login, loginWithGoogle, registerWithGoogle } from "@services/AuthService";
import { getAllNotifications, getNotificationPreferences } from "@services/NotificationService";
import { NotificationContext, defaultPreferences } from "@context/notificationContext";
import { PreferencesResponse, NotificationType } from "@src/types/notification";
import { validateEmail, validatePasswordLength } from "@utils/validators";
import { SNACKBAR_VARIANTS } from "@constants/snackbarVariants";
import * as SecureStore from "expo-secure-store";
import { LoginType } from "src/types/auth";

export function useLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [activationEmail, setActivationEmail] = useState("");
  const [pendingLoginType, setPendingLoginType] = useState<LoginType | null>(null);
  const [pendingGoogleToken, setPendingGoogleToken] = useState<string>("");
  const [showUsernameInput, setShowUsernameInput] = useState(false);
  const [pendingGoogleIdToken, setPendingGoogleIdToken] = useState<string>("");
  const [pendingGoogleEmail, setPendingGoogleEmail] = useState<string>("");
  const [googleUsername, setGoogleUsername] = useState("");

  const { login: authLogin } = useAuth();
  const router = useRouter();
  const { showSnackbar } = useSnackbar();

  const notificationContext = useContext(NotificationContext);

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

  const syncUserData = async () => {
    if (!notificationContext) return;
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
    } catch (error) {}
  };

  const handleLogin = async (customEmail?: string, customPassword?: string) => {
    const usedEmail = customEmail ?? email;
    const usedPassword = customPassword ?? password;

    if (!usedEmail || !validateEmail(usedEmail))
      return showSnackbar("Invalid email", SNACKBAR_VARIANTS.ERROR);
    if (!usedPassword || !validatePasswordLength(usedPassword))
      return showSnackbar("Invalid password", SNACKBAR_VARIANTS.ERROR);

    try {
      setIsLoading(true);
      const token = await login(usedEmail, usedPassword);
      await authLogin(token);
      await saveCredentials(usedEmail, usedPassword);
      await syncUserData();
      router.replace("../home");
    } catch (error: any) {
      if (error?.title === "Account Not Verified" || error?.status === 403) {
        setActivationEmail(usedEmail);
        setPendingLoginType("email");
        setShowVerifyModal(true);
        return;
      }
      showSnackbar(error.detail, SNACKBAR_VARIANTS.ERROR);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async (firebaseIdToken: string, googleEmail: string) => {
    try {
      setIsLoading(true);
      const backendToken = await loginWithGoogle(firebaseIdToken);
      await authLogin(backendToken);
      await saveCredentials(googleEmail, undefined, firebaseIdToken);
      await syncUserData();
      router.replace("../home");
    } catch (error: any) {
      if (error?.status === 404) {
        setShowUsernameInput(true);
        setPendingGoogleIdToken(firebaseIdToken);
        setPendingGoogleEmail(googleEmail);
        return;
      }
      if (error?.title === "Account Not Verified" || error?.status === 403) {
        setActivationEmail(googleEmail);
        setPendingLoginType("google");
        setPendingGoogleToken(firebaseIdToken);
        setShowVerifyModal(true);
        return;
      }
      showSnackbar(error.detail, SNACKBAR_VARIANTS.ERROR);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    if (!googleUsername || !pendingGoogleIdToken || !pendingGoogleEmail) {
      showSnackbar("Please enter a username", SNACKBAR_VARIANTS.ERROR);
      return;
    }
    try {
      setIsLoading(true);
      await registerWithGoogle(pendingGoogleIdToken, googleUsername);

      setShowUsernameInput(false);
      setGoogleUsername("");
      setActivationEmail(pendingGoogleEmail);
      setPendingLoginType("google");
      setPendingGoogleToken(pendingGoogleIdToken);
      setShowVerifyModal(true);
    } catch (error: any) {

      if (
        error?.title === "Account Not Verified" ||
        error?.status === 403
      ) {
        setShowUsernameInput(false);
        setGoogleUsername("");
        setActivationEmail(pendingGoogleEmail);
        setPendingLoginType("google");
        setPendingGoogleToken(pendingGoogleIdToken);
        setShowVerifyModal(true);
        return;
      }
      showSnackbar(error.detail, SNACKBAR_VARIANTS.ERROR);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePinVerified = async () => {
    try {
      setIsLoading(true);
      if (pendingLoginType === "google") {
        const backendToken = await loginWithGoogle(pendingGoogleToken);
        await authLogin(backendToken);
        await saveCredentials(activationEmail, undefined, pendingGoogleToken);
        await syncUserData();
        router.replace("../home");
        showSnackbar("Account verified and logged in!", SNACKBAR_VARIANTS.SUCCESS);
      } else {
        const token = await login(activationEmail, password);
        await authLogin(token);
        await saveCredentials(activationEmail, password);
        await syncUserData();
        router.replace("../home");
        showSnackbar("Account verified and logged in!", SNACKBAR_VARIANTS.SUCCESS);
      }
    } catch (error: any) {
      showSnackbar("Could not log in automatically. Please try manually.", SNACKBAR_VARIANTS.ERROR);
      router.replace("/(signin)/login");
    } finally {
      setIsLoading(false);
      setPendingLoginType(null);
      setPendingGoogleToken("");
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    isLoading,
    setIsLoading,
    showVerifyModal,
    setShowVerifyModal,
    activationEmail,
    setActivationEmail,
    handleLogin,
    handleGoogleLogin,
    handlePinVerified,
    showSnackbar,
    showUsernameInput,
    setShowUsernameInput,
    googleUsername,
    setGoogleUsername,
    handleGoogleRegister,
  };
}