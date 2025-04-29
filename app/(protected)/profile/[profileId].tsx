import React, { useEffect, useState } from "react";
import { View, Text, Image, ScrollView } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { useLocalSearchParams } from "expo-router";
import { getUserProfileByUsername, UserProfileResponse } from "@services/ProfileService";
import { profileIdStyles as styles } from "@styles/profileIdStyles";

const UserProfile: React.FC = () => {
  const [profile, setProfile] = useState<UserProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { profileId } = useLocalSearchParams();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getUserProfileByUsername(profileId as string);
        setProfile(data);
      } catch (err: any) {
        if (err.response?.status === 404) {
          setError("Profile not found.");
        } else if (err.response?.status === 401) {
          setError("Unauthorized. Please log in.");
        } else {
          setError(err.message || "Error loading profile.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [profileId]);

  if (loading)
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#000" />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );

  if (error)
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.errorText}>{error}</Text>
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

      <View style={{ width: "100%" }}>
        <Text style={styles.label}>Email</Text>
        <Text style={styles.email}>{profile.email}</Text>
      </View>
    </ScrollView>
  );
};

export default UserProfile;
