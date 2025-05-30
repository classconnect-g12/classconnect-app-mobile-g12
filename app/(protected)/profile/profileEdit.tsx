import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useState, useEffect } from "react";
import { useLocalSearchParams } from "expo-router";
import { ActivityIndicator } from "react-native-paper";
import { Feather, Ionicons } from "@expo/vector-icons";
import { colors } from "@theme/colors";
import { profileEditStyles as styles } from "@styles/profileEditStyles";
import { getUserProfile, updateUserProfile } from "@services/ProfileService";
import { useSnackbar } from "@context/SnackbarContext";
import { SNACKBAR_VARIANTS } from "@constants/snackbarVariants";
import { handleApiError } from "@utils/handleApiError";
import { useAuth } from "@context/authContext";
import Spinner from "@components/Spinner";

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

  const { showSnackbar } = useSnackbar();

  const { logout } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedProfile = await getUserProfile();
        setProfile(fetchedProfile);
        setOriginalProfile(fetchedProfile);
      } catch (error) {
        handleApiError(
          error,
          showSnackbar,
          "Error loading the profile",
          logout
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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
      showSnackbar("No changes to save.", SNACKBAR_VARIANTS.INFO);
      return;
    }

    setSaving(true);
    try {
      const updated = await updateUserProfile(profile);
      setProfile(updated);
      setOriginalProfile(updated);
      showSnackbar("Profile updated successfully!", SNACKBAR_VARIANTS.SUCCESS);
    } catch (error) {
      handleApiError(error, showSnackbar, "Error saving changes", logout);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Spinner />;

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Image source={{ uri: profile.banner }} style={styles.avatar} />
          <Text style={styles.userName}>{profile.user_name}</Text>
          <TouchableOpacity style={styles.iconButton} onPress={pickImage}>
            <Ionicons name="camera" size={20} color={colors.buttonText} />
            <Text style={styles.iconButtonText}>
              <Feather
                name="refresh-ccw"
                size={20}
                color="white"
                style={styles.icon}
              />
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.inputCard}>
          <Text style={styles.label}>Description</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              value={profile.description}
              onChangeText={(text) => handleChange("description", text)}
              placeholder="Write a short bio..."
              multiline
            />
            <Feather name="edit" size={20} color="#888" style={styles.icon} />
          </View>
        </View>

        <View style={styles.inputCard}>
          <Text style={styles.label}>First Name</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              value={profile.first_name}
              onChangeText={(text) => handleChange("first_name", text)}
              placeholder="First Name"
            />
            <Feather name="edit" size={20} color="#888" style={styles.icon} />
          </View>

          <Text style={styles.label}>Last Name</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              value={profile.last_name}
              onChangeText={(text) => handleChange("last_name", text)}
              placeholder="Last Name"
            />
            <Feather name="edit" size={20} color="#888" style={styles.icon} />
          </View>
        </View>

        <View style={styles.inputCard}>
          <Text style={styles.label}>Email</Text>
          <View style={styles.inputRow}>
            <Text style={styles.email}>{profile.email}</Text>
          </View>
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
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
