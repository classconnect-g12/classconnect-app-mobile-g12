import axios from "axios";
const API_URL = process.env.EXPO_PUBLIC_API_URL;

const login = async (email: string, password: string) => {
  console.log("API_URL:", API_URL);

  try {
    if (!API_URL) {
      throw new Error("Error en el servidor: API_URL no está definido");
    }

    const response = await axios.post(`${API_URL}/api/auth/login`, {
      email,
      password,
    });

    if (response.status === 200) {
      console.log("Login exitoso:", response.data);
      // Guardar el token
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

const register = async (email: string, password: string) => {
  console.log("API_URL:", API_URL);

  try {
    if (!API_URL) {
      throw new Error("Error en el servidor: API_URL no está definido");
    }

    const response = await axios.post(`${API_URL}/api/auth/register`, {
      email,
      password,
    });

    if (response.status === 201) {
      console.log("Registro exitoso:", response.data);
      // Guardar el token
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
