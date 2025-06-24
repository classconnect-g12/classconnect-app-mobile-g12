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
import { useAuth } from "@context/authContext";
import Spinner from "@components/Spinner";

const formatJoinDate = (isoDate?: string | null): string => {
  if (!isoDate) return "Date not available";

  const date = new Date(isoDate);

  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  return date.toLocaleDateString("en-US", options);
};

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

  if (loading) return <Spinner />;

  if (!profile) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.errorText}>No profile information found.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.header}>
        <Image source={{ uri: profile.banner }} style={styles.avatar} />
        <Text style={styles.userName}>
          {profile.user_name || "Username not provided"}
        </Text>
        <Text style={styles.fullName}>
          {profile.first_name || profile.last_name
            ? `${profile.first_name || ""} ${profile.last_name || ""}`.trim()
            : "Full name not provided"}
        </Text>
        <Text style={styles.joinDate}>
          Joined on {formatJoinDate(profile.created_at)}
        </Text>
      </View>

      <View style={styles.inputCard}>
        <Text style={styles.label}>Bio</Text>
        <Text style={styles.readOnlyText}>
          {profile.description || "No description provided."}
        </Text>
      </View>
    </ScrollView>
  );
};

export default UserProfile;
