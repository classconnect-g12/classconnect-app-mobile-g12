import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = process.env.EXPO_PUBLIC_API_URL;
const PLACEHOLDER_BANNER = "https://via.placeholder.com/150";

export interface UserProfileResponse {
  user_name: string;
  first_name: string;
  last_name: string;
  email: string;
  description: string;
  banner: string;
}

const getToken = async (): Promise<string> => {
  const token = await AsyncStorage.getItem("token");
  if (!token) throw new Error("Token not found");
  return token;
};

export const getUserProfileByUsername = async (
  username: string
): Promise<UserProfileResponse> => {
  const token = await getToken();

  const response = await axios.get<UserProfileResponse>(
    `${API_URL}/user/username/${username}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return {
    ...response.data,
    banner: response.data.banner || PLACEHOLDER_BANNER,
  };
};

export const getUserProfile = async (): Promise<UserProfileResponse> => {
  const token = await getToken();

  const response = await axios.get<UserProfileResponse>(`${API_URL}/user/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return {
    ...response.data,
    banner: response.data.banner || PLACEHOLDER_BANNER,
  };
};

export const updateUserProfile = async (profile: Partial<UserProfileResponse>) => {
  const token = await getToken();

  const formData = new FormData();
  if (profile.first_name) formData.append("first_name", profile.first_name);
  if (profile.last_name) formData.append("last_name", profile.last_name);
  if (profile.description) formData.append("description", profile.description);

  if (profile.banner && profile.banner.startsWith("file://")) {
    const fileType = profile.banner.split(".").pop();
    formData.append("banner", {
      uri: profile.banner,
      name: `profile_banner.${fileType}`,
      type: `image/${fileType}`,
    } as any);
  }

  const response = await axios.patch(`${API_URL}/user/update`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });

  return {
    ...profile,
    ...response.data,
    banner: response.data.banner || profile.banner || PLACEHOLDER_BANNER,
  };
};
