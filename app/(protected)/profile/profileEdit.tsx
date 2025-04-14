import {
  View,
  Text,
  Image,
  StyleSheet,
  Alert,
  TextInput,
  TouchableOpacity,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useState, useEffect } from "react";
import axios from "axios";
import { useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function ProfileScreen() {
  const { profileId } = useLocalSearchParams();
  const [profile, setProfile] = useState<{
    user_name: string;
    first_name: string;
    last_name: string;
    email: string;
    description: string;
    banner: string;
  }>({
    user_name: "",
    first_name: "",
    last_name: "",
    email: "",
    description: "",
    banner: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = await AsyncStorage.getItem("token");

        if (!token) {
          setError("Token not found");
          setLoading(false);
          return;
        }
        const response = await axios.get(`${API_URL}/user/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setProfile({
          user_name: response.data.user_name,
          first_name: response.data.first_name,
          last_name: response.data.last_name,
          email: response.data.email,
          description: response.data.description,
          banner: response.data.banner || "https://via.placeholder.com/150",
        });
      } catch (err) {
        console.error(err);
        setError("Error loading profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [profileId]);

  const handleChange = (field: string, value: string) => {
    setProfile((prevProfile) => ({
      ...prevProfile,
      [field]: value,
    }));
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfile({ ...profile, banner: result.assets[0].uri });
    }
  };

  const handleSaveChanges = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        setError("Token not found");
        return;
      }

      const formData = new FormData();

      if (profile.first_name) formData.append("first_name", profile.first_name);
      if (profile.last_name) formData.append("last_name", profile.last_name);
      if (profile.description)
        formData.append("description", profile.description);

      // TODO! Agregar la foto.

      const response = await axios.patch(`${API_URL}/user/update`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setProfile((prevProfile) => ({
        ...prevProfile,
        first_name: response.data.first_name || prevProfile.first_name,
        last_name: response.data.last_name || prevProfile.last_name,
        description: response.data.description || prevProfile.description,
        banner: response.data.banner || prevProfile.banner,
      }));

      Alert.alert(
        "Updated profile",
        "The changes have been saved successfully"
      );
    } catch (err) {
      console.error(err);
      setError("Error saving changes");
    }
  };

  if (loading)
    return <Text style={styles.loadingText}>Loading profile...</Text>;
  if (error) return <Text style={styles.errorText}>{error}</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.userName}>{profile.user_name}</Text>
      <View style={styles.header}>
        <Image source={{ uri: profile.banner }} style={styles.avatar} />
        <TouchableOpacity onPress={pickImage}>
          <Text style={styles.changePhotoText}>Change photo</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.input}
        value={profile.description}
        onChangeText={(text) => handleChange("description", text)}
        placeholder="Description"
        multiline
      />
      <TextInput
        style={styles.input}
        value={profile.first_name}
        onChangeText={(text) => handleChange("first_name", text)}
        placeholder="Name"
      />
      <TextInput
        style={styles.input}
        value={profile.last_name}
        onChangeText={(text) => handleChange("last_name", text)}
        placeholder="Last name"
      />
      <Text style={styles.email}>{profile.email}</Text>

      <TouchableOpacity style={styles.saveButton} onPress={handleSaveChanges}>
        <Text style={styles.saveButtonText}>Save changes</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: "#fff",
    marginBottom: 10,
    backgroundColor: "#e0e0e0",
  },
  changePhotoText: {
    fontSize: 16,
    color: "#007BFF",
    fontWeight: "bold",
    marginTop: 10,
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  input: {
    width: "100%",
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  description: {
    fontSize: 16,
    color: "#777",
    textAlign: "center",
    marginBottom: 15,
  },
  email: {
    fontSize: 14,
    color: "#888",
    marginBottom: 20,
  },
  saveButton: {
    backgroundColor: "#28a745",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 20,
  },
  saveButtonText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
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
