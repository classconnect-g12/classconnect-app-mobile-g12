import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
const API_URL = process.env.EXPO_PUBLIC_API_URL;

const login = async (email: string, password: string) => {
  console.log("API_URL:", API_URL);

  try {
    if (!API_URL) {
      throw new Error("Error en el servidor: API_URL no está definido");
    }

    const response = await axios.post(`${API_URL}/auth/login`, {
      email,
      password,
    });

    if (response.status === 200) {
      const token = response.data.token;
      await AsyncStorage.setItem("token", token);
    } else {
      throw new Error(`Error ${response.status}: ${response.data}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error en login:", error.message);
      throw new Error(error.message);
    } else {
      throw new Error("Ha ocurrido un error desconocido");
    }
  }
};

const register = async (username: string, email: string, password: string) => {
  console.log("API_URL:", API_URL);

  try {
    if (!API_URL) {
      throw new Error("Error en el servidor: API_URL no está definido");
    }

    const response = await axios.post(`${API_URL}/auth/register`, {
      user_name: username,
      email,
      password,
    });

    if (response.status === 201) {
      console.log(response.data);

      const token = response.data.token;
      await AsyncStorage.setItem("token", token);
    } else {
      throw new Error(`Error ${response.status}: ${response.data}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error en registro:", error.message);
      throw new Error(error.message);
    } else {
      throw new Error("Ha ocurrido un error desconocido");
    }
  }
};

export { login, register };
