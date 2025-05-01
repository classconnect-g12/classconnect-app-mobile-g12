import { publicClient } from "@utils/apiClient";
import { storeToken } from "@utils/tokenUtils";

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
  const response = await publicClient.post("/auth/register", {
    user_name: username,
    email,
    password,
  });

  if (response.status === 201) {
    const token = response.data.token;
    await storeToken(token);
    return token;
  }

  throw new Error(`Error ${response.status}: ${JSON.stringify(response.data)}`);
};
