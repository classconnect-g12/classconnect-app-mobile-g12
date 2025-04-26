import AsyncStorage from "@react-native-async-storage/async-storage";

export const getToken = async (): Promise<string> => {
  const token = await AsyncStorage.getItem("token");
  if (!token) throw new Error("Token not found");
  return token;
};

export const storeToken = async (token: string) => {
  await AsyncStorage.setItem("token", token);
};
