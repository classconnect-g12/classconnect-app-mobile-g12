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
  password: string,
  location: { latitude: number; longitude: number }
): Promise<string> => {
  try {
    const fcmToken = await messaging().getToken();

    const response = await publicClient.post(`/auth/register`, {
      user_name: username,
      email,
      password,
      fcm_token: fcmToken,
      location,
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
    console.error("Register error:", error);
    throw error;
  }
};

export const loginWithGoogle = async (
  firebaseIdToken: string
): Promise<string> => {
  const response = await publicClient.post(`/auth/google`, {
    idToken: firebaseIdToken,
  });

  if (response.status === 200) {
    const token = response.data.token;
    await storeToken(token);
    return token;
  }

  return response.data;
};

export const registerWithGoogle = async (
  firebaseIdToken: string,
  user_name: string
): Promise<string> => {
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

  return response.data;
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

export const sendActivationPin = async ({
  email,
  phone,
  method,
}: {
  email: string;
  phone: string;
  method: "email" | "sms";
}): Promise<void> => {
  const data = {
    type: method.toUpperCase(),
    email: email ?? "",
    phone: phone ?? "",
  };
  await publicClient.post("/auth/send-pin", data);
};

export const verifyActivationPin = async (
  email: string,
  pin: string
): Promise<void> => {
  await publicClient.post("/auth/verify-pin", {
    email,
    pin,
  });
};
