import React, { useEffect, useState } from "react";
import axios from "axios";
import { View, Text, Image, StyleSheet, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams } from "expo-router";
import { ActivityIndicator } from "react-native-paper";

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

const styles = StyleSheet.create({
  scrollContainer: {
    padding: 20,
    alignItems: "center",
    backgroundColor: "#f4f6f8",
    flexGrow: 1,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f4f6f8",
  },
  header: {
    alignItems: "center",
    marginVertical: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: "#ccc",
    backgroundColor: "#e0e0e0",
  },
  userName: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#333",
  },
  inputCard: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 15,
    paddingVertical: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  label: {
    fontSize: 14,
    color: "#555",
    marginBottom: 6,
    fontWeight: "500",
  },
  readOnlyText: {
    fontSize: 16,
    color: "#333",
  },
  email: {
    fontSize: 14,
    color: "#888",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  loadingText: {
    fontSize: 18,
    color: "#333",
    marginTop: 10,
  },
  errorText: {
    fontSize: 18,
    color: "red",
    textAlign: "center",
    paddingHorizontal: 30,
  },
});

export default UserProfile;
