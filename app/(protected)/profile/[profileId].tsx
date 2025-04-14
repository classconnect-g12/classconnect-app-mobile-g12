import React, { useEffect, useState } from "react";
import axios from "axios";
import { Text, View, Image, StyleSheet, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams } from "expo-router";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

interface UserProfileResponse {
  user_name: string;
  first_name: string;
  last_name: string;
  email: string;
  description: string;
  banner: string;
}

const UserProfile: React.FC = () => {
  const [profile, setProfile] = useState<UserProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { profileId } = useLocalSearchParams();

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

        setProfile(response.data);
      } catch (err) {
        console.error(err);
        setError("Error loading profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [profileId]);

  if (loading) return <Text style={styles.loadingText}>Loading profile...</Text>;
  if (error) return <Text style={styles.errorText}>{error}</Text>;

  return (
    <View style={styles.container}>
      {profile ? (
        <View style={styles.profileContainer}>
          <View style={styles.header}>
            <Text style={styles.userName}>{profile.user_name}</Text>
            <Image
              source={{ uri: profile.banner }}
              style={styles.avatar}
            />
          </View>
          <Text style={styles.details}>
            <Text style={styles.boldText}></Text> {profile.description}
          </Text>
          <Text style={styles.details}>
            <Text style={styles.boldText}>First name:</Text> {profile.first_name}
          </Text>
          <Text style={styles.details}>
            <Text style={styles.boldText}>Last name:</Text> {profile.last_name}
          </Text>
          <Text style={styles.details}>
            <Text style={styles.boldText}>Email:</Text> {profile.email}
          </Text>
        </View>
      ) : (
        <Text>No profile information found.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  profileContainer: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 8,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    width: "100%",
    maxWidth: 400,
    alignItems: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: "#fff",
    backgroundColor: "#e0e0e0",
    marginBottom: 10,
  },
  userName: {
    fontSize: 24,
    fontWeight: "600",
    color: "#333",
    marginBottom: 10,
  },
  details: {
    fontSize: 16,
    color: "#555",
    marginBottom: 10,
  },
  boldText: {
    fontWeight: "700",
  },
  loadingText: {
    fontSize: 18,
    color: "#333",
  },
  errorText: {
    fontSize: 18,
    color: "red",
  },
});

export default UserProfile;
