import React, { useEffect, useState } from "react";
import { View, Text, Image, ScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router";
import {
  getUserProfileByUsername,
  UserProfileResponse,
} from "@services/ProfileService";
import { profileIdStyles as styles } from "@styles/profileIdStyles";
import { handleApiError } from "@utils/handleApiError";
import { useSnackbar } from "@context/SnackbarContext";
import { AxiosError } from "axios";
import { ApiError } from "@src/types/apiError";
import { useAuth } from "@context/authContext";
import Spinner from "@components/Spinner";

const UserProfile: React.FC = () => {
  const [profile, setProfile] = useState<UserProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const { profileId } = useLocalSearchParams();

  const { showSnackbar } = useSnackbar();
  const { logout } = useAuth();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getUserProfileByUsername(profileId as string);
        setProfile(data);
      } catch (error) {
        handleApiError(error, showSnackbar, "Error fetching profile", logout);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [profileId]);

  if (loading)
    return (
      <View style={styles.centeredContainer}>
        <Spinner />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );

  if (!profile) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.errorText}>No profile information found.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Text style={styles.userName}>{profile.user_name}</Text>

      <View style={styles.header}>
        <Image source={{ uri: profile.banner }} style={styles.avatar} />
      </View>

      <View style={styles.inputCard}>
        <Text style={styles.label}>Description</Text>
        <Text style={styles.readOnlyText}>
          {profile.description || "No description provided."}
        </Text>
      </View>

      <View style={styles.inputCard}>
        <Text style={styles.label}>First Name</Text>
        <Text style={styles.readOnlyText}>{profile.first_name}</Text>
      </View>

      <View style={styles.inputCard}>
        <Text style={styles.label}>Last Name</Text>
        <Text style={styles.readOnlyText}>{profile.last_name}</Text>
      </View>
    </ScrollView>
  );
};

export default UserProfile;
