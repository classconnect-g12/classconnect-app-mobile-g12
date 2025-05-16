import { publicClient } from "@utils/apiClient";
import { storeToken } from "@utils/tokenUtils";
import messaging from "@react-native-firebase/messaging";

export const login = async (
  email: string,
  password: string
): Promise<string> => {
  const response = await publicClient.post("/auth/login", { email, password });

  if (response.status === 200) {
    const token = response.data.token;
    await storeToken(token);
    return token;
  }

  throw new Error(`Error ${response.status}: ${JSON.stringify(response.data)}`);
};

export const register = async (
  username: string,
  email: string,
  password: string
): Promise<string> => {
  try {
    const fcmToken = await messaging().getToken();

    const response = await publicClient.post(`/auth/register`, {
      user_name: username,
      email,
      password,
      fcm_token: fcmToken,
    });

    if (response.status === 201) {
      const token = response.data.token;
      await storeToken(token);
      return token;
    }

    throw new Error(
      `Error ${response.status}: ${JSON.stringify(response.data)}`
    );
  } catch (error: any) {
    console.error("Register error:", error?.response?.data || error.message);
    throw error?.response?.data || { message: "Registration failed" };
  }
};

export const loginWithGoogle = async (
  firebaseIdToken: string
): Promise<string> => {
  try {
    const response = await publicClient.post(`/auth/google`, {
      idToken: firebaseIdToken,
    });

    if (response.status === 200) {
      const token = response.data.token;
      await storeToken(token);
      return token;
    }

    throw new Error(
      `Error ${response.status}: ${JSON.stringify(response.data)}`
    );
  } catch (error: any) {
    console.error(
      "Google login error:",
      error?.response?.data || error.message
    );
    throw error?.response?.data || { message: "Google login failed" };
  }
};

export const registerWithGoogle = async (
  firebaseIdToken: string,
  user_name: string
): Promise<string> => {
  try {
    const fcmToken = await messaging().getToken();

    const response = await publicClient.post(`/auth/google-register`, {
      idToken: firebaseIdToken,
      user_name,
      fcm_token: fcmToken,
    });

    if (response.status === 201) {
      const token = response.data.token;
      await storeToken(token);
      return token;
    }

    throw new Error(
      `Error ${response.status}: ${JSON.stringify(response.data)}`
    );
  } catch (error: any) {
    console.error(
      "Google registration error:",
      error?.response?.data || error.message
    );
    throw error?.response?.data || { message: "Google registration failed" };
  }
};

export const resetPassword = async (email: string): Promise<string> => {
  const response = await publicClient.post("/auth/reset-password", { email });

  return response.data.message || "Password reset email sent successfully";
};

export const resetPasswordWithCode = async (
  email: string,
  resetCode: string,
  newPassword: string
): Promise<string> => {
  const response = await publicClient.post("/auth/reset-password/verify", {
    email,
    resetCode,
    newPassword,
  });

  return response.data.message || "Password reset successfully";
};
