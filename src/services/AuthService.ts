import axios from "axios";
import { storeToken } from "@utils/tokenUtils";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

const checkApiUrl = () => {
  if (!API_URL) {
    throw new Error("Server error: API_URL is not defined");
  }
};

const login = async (email: string, password: string): Promise<string> => {
  checkApiUrl();

  try {
    const response = await axios.post(`${API_URL}/auth/login`, {
      email,
      password,
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
    console.error("Login error:", error?.response?.data || error.message);
    throw error?.response?.data || { message: "Login failed" };
  }
};

const register = async (
  username: string,
  email: string,
  password: string
): Promise<string> => {
  checkApiUrl();

  try {
    const response = await axios.post(`${API_URL}/auth/register`, {
      user_name: username,
      email,
      password,
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

export const loginWithGoogle = async (firebaseIdToken: string): Promise<string> => {
  checkApiUrl(); 

  try {
    const response = await axios.post(`${API_URL}/auth/google`, {
      token: firebaseIdToken, 
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
    console.error("Google login error:", error?.response?.data || error.message);
    throw error?.response?.data || { message: "Google login failed" };
  }
};

export { login, register };
