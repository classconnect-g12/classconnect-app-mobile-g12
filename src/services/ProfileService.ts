import { privateClient } from "@utils/apiClient";

const PLACEHOLDER_BANNER = "https://via.placeholder.com/150";

export interface UserProfileResponse {
  user_name: string;
  first_name: string;
  last_name: string;
  email: string;
  description: string;
  banner: string;
}

export const getUserProfileByUsername = async (
  username: string
): Promise<UserProfileResponse> => {
  const response = await privateClient.get<UserProfileResponse>(
    `/user/username/${username}`
  );
  return {
    ...response.data,
    banner: response.data.banner || PLACEHOLDER_BANNER,
  };
};

export const getUserProfile = async (): Promise<UserProfileResponse> => {
  const response = await privateClient.get<UserProfileResponse>(
    "/user/profile"
  );
  return {
    ...response.data,
    banner: response.data.banner || PLACEHOLDER_BANNER,
  };
};

export const updateUserProfile = async (
  profile: Partial<UserProfileResponse>
) => {
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

  const response = await privateClient.patch("/user/update", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return {
    ...profile,
    ...response.data,
    banner: response.data.banner || profile.banner || PLACEHOLDER_BANNER,
  };
};
