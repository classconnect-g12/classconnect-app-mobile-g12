import React, { useEffect, useState } from "react";
import axios from "axios";
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ActivityIndicator } from "react-native-paper";
import { colors } from "./../../../theme/colors"

const API_URL = process.env.EXPO_PUBLIC_API_URL;

interface UserProfileResponse {
  user_name: string;
  first_name: string;
  last_name: string;
  email: string;
  description: string;
  banner: string;
  profile_picture: string;
  bio: string;
  role: string;
}

const UserProfile: React.FC = () => {
  const [profile, setProfile] = useState<UserProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { profileId } = useLocalSearchParams();
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = await AsyncStorage.getItem("token");

        if (!token) {
          setError("Token not found");
          setLoading(false);
          return;
        }

        const response = await axios.get<UserProfileResponse>(
          `${API_URL}/user/username/${profileId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setProfile({
          ...response.data,
          banner: response.data.banner || "https://via.placeholder.com/150",
        });
      } catch (err) {
        if (axios.isAxiosError(err)) {
          const status = err.response?.status;
          if (status === 404) {
            setError("Profile not found.");
          } else if (status === 401) {
            setError("Unauthorized. Please log in.");
            router.replace("/login");
          } else {
            setError("Error loading profile.");
          }
        } else {
          setError("Unexpected error.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [profileId, API_URL, router]);

  if (loading)
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.text} />
      </View>
    );

  if (error)
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.back()}
        >
          <Text style={styles.buttonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );

  if (!profile) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Profile not found</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.back()}
        >
          <Text style={styles.buttonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileHeader}>
        <Image
          source={
            profile.profile_picture
              ? { uri: profile.profile_picture }
              : require("./../../../assets/images/icon.png")
          }
          style={styles.profileImage}
        />
        <Text style={styles.username}>{profile.user_name}</Text>
        <Text style={styles.role}>{profile.role}</Text>
      </View>

      <View style={styles.infoContainer}>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Email</Text>
          <Text style={styles.infoValue}>{profile.email}</Text>
        </View>

        {profile.bio && (
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Bio</Text>
            <Text style={styles.infoValue}>{profile.bio}</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: colors.error,
    marginBottom: 20,
    textAlign: "center",
  },
  button: {
    backgroundColor: colors.primary,
    padding: 10,
    borderRadius: 5,
    width: "50%",
    alignItems: "center",
  },
  buttonText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: "600",
  },
  profileHeader: {
    alignItems: "center",
    padding: 20,
    backgroundColor: colors.cardBackground,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
    backgroundColor: colors.inputBackground,
  },
  username: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 5,
  },
  role: {
    fontSize: 16,
    color: colors.text,
    opacity: 0.7,
  },
  infoContainer: {
    padding: 20,
    backgroundColor: colors.cardBackground,
    marginTop: 10,
    borderRadius: 10,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoItem: {
    marginBottom: 15,
  },
  infoLabel: {
    fontSize: 14,
    color: colors.text,
    opacity: 0.7,
    marginBottom: 5,
  },
  infoValue: {
    fontSize: 16,
    color: colors.text,
  },
});

export default UserProfile;
