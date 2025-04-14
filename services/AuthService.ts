import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

const storeToken = async (token: string) => {
  await AsyncStorage.setItem("token", token);
};

const login = async (email: string, password: string): Promise<string> => {
  console.log("API_URL:", API_URL);

  if (!API_URL) {
    throw new Error("Error en el servidor: API_URL no está definido");
  }

  try {
    const response = await axios.post(`${API_URL}/auth/login`, {
      email,
      password,
    });

    if (response.status === 200) {
      const token = response.data.token;
      await storeToken(token);
      return token;
    } else {
      throw new Error(`Error ${response.status}: ${JSON.stringify(response.data)}`);
    }
  } catch (error: any) {
    console.error("Error en login:", error?.response?.data || error.message);
    throw new Error(error?.response?.data?.message || "Error al iniciar sesión");
  }
};

const register = async (
  username: string,
  email: string,
  password: string
): Promise<string> => {
  console.log("API_URL:", API_URL);

  if (!API_URL) {
    throw new Error("Error en el servidor: API_URL no está definido");
  }

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
    } else {
      throw new Error(`Error ${response.status}: ${JSON.stringify(response.data)}`);
    }
  } catch (error: any) {
    console.error("Error en registro:", error?.response?.data || error.message);
    throw new Error(error?.response?.data?.message || "Error al registrarse");
  }
};

export { login, register };
