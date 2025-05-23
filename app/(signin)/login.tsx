import React, { useEffect, useState } from "react";
import { View, Text, Image } from "react-native";
import { images } from "@assets/images";
import { signInStyles as styles } from "@styles/signInStyles";

import { LoginForm } from "@components/LoginForm";
import { GoogleSignInButton } from "@components/GoogleSignInButton";
import { BiometricButton } from "@components/BiometricButton";
import { PinVerificationModal } from "@components/PinVerificationModal";
import { useLogin } from "@hooks/useLogin";
import { Link } from "expo-router";

import { GoogleSignin } from "@react-native-google-signin/google-signin";
import auth from "@react-native-firebase/auth";
import ReactNativeBiometrics from "react-native-biometrics";
import * as SecureStore from "expo-secure-store";
import { GoogleRegisterPrompt } from "@components/GoogleRegisterPrompt";
import { useLocalSearchParams } from "expo-router";
import { useSnackbar } from "@context/SnackbarContext";

export default function SignIn() {
  const login = useLogin();

  const [loadingType, setLoadingType] = useState<null | "email" | "google" | "biometric">(null);

  const params = useLocalSearchParams();
  React.useEffect(() => {
    if (params?.showVerify === "1" && params?.email) {
      login.setActivationEmail(params.email as string);
      login.setShowVerifyModal(true);
    }
  }, [params]);


  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        "660953493084-hns6fmmg55oo6fc11qqtmr9u04kvnsrd.apps.googleusercontent.com",
    });
  }, []);

  const handleEmailLogin = async () => {
    setLoadingType("email");
    try {
      await login.handleLogin(login.email, login.password);
    } finally {
      setLoadingType(null);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoadingType("google");
    try {
      await GoogleSignin.signOut();
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      const userInfo: any = await GoogleSignin.signIn();
      const idToken = userInfo.idToken || userInfo.data?.idToken;
      if (!idToken) throw new Error("Google Sign-In failed: no ID token returned.");
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      const userCredential = await auth().signInWithCredential(googleCredential);
      const firebaseIdToken = await userCredential.user.getIdToken();

      const googleEmail = userCredential.user.email || login.email || userInfo.user?.email;
      await login.handleGoogleLogin(firebaseIdToken, googleEmail);

    } catch (error: any) {
      login.showSnackbar(
        error?.message || "Google Sign-In failed",
        "error"
      );
    } finally {
      setLoadingType(null);
    }
  };

  const handleBiometricLogin = async () => {
    setLoadingType("biometric");
    try {
      const rnBiometrics = new ReactNativeBiometrics();
      const { available } = await rnBiometrics.isSensorAvailable();
      if (!available) {
        login.showSnackbar("Biometric authentication not available", "error");
        return;
      }
      const { success } = await rnBiometrics.simplePrompt({ promptMessage: "Authenticate to sign in" });
      if (!success) {
        login.showSnackbar("Biometric authentication failed", "error");
        return;
      }

      const email = await SecureStore.getItemAsync("biometric_email");
      const password = await SecureStore.getItemAsync("biometric_password");
      const firebaseIdToken = await SecureStore.getItemAsync("biometric_firebase_token");
      if (email && password) {
        await login.handleLogin(email, password);
      } else if (email && firebaseIdToken) {
        await login.handleGoogleLogin(firebaseIdToken, email);
      } else {
        login.showSnackbar("No credentials saved for biometric login. Please sign in manually first.", "error");
      }
    } catch (error: any) {
      login.showSnackbar(
        error?.message || "Biometric login failed",
        "error"
      );
    } finally {
      setLoadingType(null);
    }
  };

  const isAnyLoading = loadingType !== null;

  return (
    <View style={styles.container}>
      <View>
        <Image source={images.logo} style={styles.logo} resizeMode="contain" />
      </View>
      <Text style={styles.subtitle}>Sign in to continue</Text>

      <LoginForm
        email={login.email}
        setEmail={login.setEmail}
        password={login.password}
        setPassword={login.setPassword}
        isLoading={loadingType === "email"}
        onLogin={handleEmailLogin}
        disabled={isAnyLoading && loadingType !== "email"}
      />

      <GoogleSignInButton
        isLoading={loadingType === "google"}
        onPress={handleGoogleSignIn}
        disabled={isAnyLoading && loadingType !== "google"}
      />

      <BiometricButton
        isLoading={loadingType === "biometric"}
        onPress={handleBiometricLogin}
        disabled={isAnyLoading && loadingType !== "biometric"}
      />

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

      <GoogleRegisterPrompt
        visible={login.showUsernameInput && !login.showVerifyModal}
        onClose={() => {
          login.setShowUsernameInput(false);
          login.setGoogleUsername("");
        }}
        username={login.googleUsername}
        setUsername={login.setGoogleUsername}
        isLoading={isAnyLoading}
        onRegister={login.handleGoogleRegister}
      />

      <PinVerificationModal
        visible={login.showVerifyModal}
        onClose={() => login.setShowVerifyModal(false)}
        email={login.activationEmail}
        showSnackbar={login.showSnackbar}
        onVerified={login.handlePinVerified}
      />

    </View>
  );
}