import {
  View,
  Text,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useState, useEffect } from "react";
import axios from "axios";
import { useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ActivityIndicator, Snackbar } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "./../../../theme/colors";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function ProfileScreen() {
  const { profileId } = useLocalSearchParams();
  const [profile, setProfile] = useState({
    user_name: "",
    first_name: "",
    last_name: "",
    email: "",
    description: "",
    banner: "",
  });

  const [originalProfile, setOriginalProfile] = useState({ ...profile });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const showSnackbar = (message: string) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };

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

        const fetchedProfile = {
          user_name: response.data.user_name,
          first_name: response.data.first_name,
          last_name: response.data.last_name,
          email: response.data.email,
          description: response.data.description,
          banner: response.data.banner || "https://via.placeholder.com/150",
        };

        setProfile(fetchedProfile);
        setOriginalProfile(fetchedProfile);
      } catch (err) {
        setError("Error al cargar el perfil.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [profileId]);

  const hasChanges = () => {
    return (
      profile.first_name !== originalProfile.first_name ||
      profile.last_name !== originalProfile.last_name ||
      profile.description !== originalProfile.description ||
      profile.banner !== originalProfile.banner
    );
  };

  const handleChange = (field: string, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
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
    if (!hasChanges()) {
      showSnackbar("No changes to save.");
      return;
    }

    setSaving(true);

    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) throw new Error("Token not found");

      const formData = new FormData();
      if (profile.first_name) formData.append("first_name", profile.first_name);
      if (profile.last_name) formData.append("last_name", profile.last_name);
      if (profile.description)
        formData.append("description", profile.description);

      if (profile.banner && profile.banner.startsWith("file://")) {
        const uriParts = profile.banner.split(".");
        const fileType = uriParts[uriParts.length - 1];
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

      const updatedProfile = {
        ...profile,
        first_name: response.data.first_name || profile.first_name,
        last_name: response.data.last_name || profile.last_name,
        description: response.data.description || profile.description,
        banner: response.data.banner || profile.banner,
      };

      setProfile(updatedProfile);
      setOriginalProfile(updatedProfile);
      showSnackbar("Profile updated successfully!");
    } catch (err) {
      setError("Error saving changes.");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color={colors.text} />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );

  if (error)
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.userName}>{profile.user_name}</Text>

        <View style={styles.header}>
          <Image source={{ uri: profile.banner }} style={styles.avatar} />
          <TouchableOpacity style={styles.iconButton} onPress={pickImage}>
            <Ionicons name="camera" size={20} color={colors.buttonText} />
            <Text style={styles.iconButtonText}>Change Photo</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.inputCard}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={styles.input}
            value={profile.description}
            onChangeText={(text) => handleChange("description", text)}
            placeholder="Write a short bio..."
            multiline
          />
        </View>

        <View style={styles.inputCard}>
          <Text style={styles.label}>First Name</Text>
          <TextInput
            style={styles.input}
            value={profile.first_name}
            onChangeText={(text) => handleChange("first_name", text)}
            placeholder="First Name"
          />
        </View>

        <View style={styles.inputCard}>
          <Text style={styles.label}>Last Name</Text>
          <TextInput
            style={styles.input}
            value={profile.last_name}
            onChangeText={(text) => handleChange("last_name", text)}
            placeholder="Last Name"
          />
        </View>

        <View style={{ width: "100%" }}>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.email}>{profile.email}</Text>
        </View>

        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSaveChanges}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator size="small" color={colors.buttonText} />
          ) : (
            <Text style={styles.saveButtonText}>Save Changes</Text>
          )}
        </TouchableOpacity>

        <Snackbar
          visible={snackbarVisible}
          onDismiss={() => setSnackbarVisible(false)}
          duration={3000}
          action={{
            label: "OK",
            onPress: () => setSnackbarVisible(false),
            labelStyle: { color: colors.buttonText }
          }}
          style={{ backgroundColor: colors.success }}
          theme={{ colors: { onSurface: colors.buttonText } }}
        >
          {snackbarMessage}
        </Snackbar>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContainer: {
    padding: 20,
    alignItems: "center",
  },
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
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
    borderColor: colors.border,
    backgroundColor: colors.inputBackground,
  },
  iconButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    backgroundColor: colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 25,
  },
  iconButtonText: {
    color: colors.buttonText,
    marginLeft: 8,
    fontWeight: "600",
  },
  userName: {
    fontSize: 26,
    fontWeight: "bold",
    color: colors.text,
  },
  inputCard: {
    width: "100%",
    backgroundColor: colors.cardBackground,
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 15,
    paddingVertical: 10,
    shadowColor: colors.shadow,
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  label: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 6,
    fontWeight: "500",
  },
  input: {
    fontSize: 16,
    color: colors.text,
    paddingVertical: 6,
  },
  email: {
    fontSize: 14,
    color: colors.text,
    backgroundColor: colors.cardBackground,
    padding: 12,
    borderRadius: 10,
    shadowColor: colors.shadow,
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  saveButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    marginTop: 20,
    width: "60%",
    alignItems: "center",
  },
  saveButtonText: {
    fontSize: 16,
    color: colors.buttonText,
    fontWeight: "bold",
  },
  loadingText: {
    fontSize: 18,
    color: colors.text,
    marginTop: 10,
  },
  errorText: {
    fontSize: 18,
    color: colors.error,
    textAlign: "center",
    paddingHorizontal: 30,
  },
});
