import React, { useState } from "react";
import {
  View,
  Text,
  Button,
  TextInput,
  StyleSheet,
} from "react-native";
import { useAuth } from "../context/authContext";
import { useRouter } from "expo-router";

export default function HomeScreen() {
  const { logout } = useAuth();
  const router = useRouter();
  const [search, setSearch] = useState("");

  const handleLogout = async () => {
    await logout();
    router.replace("/login");
  };

  const handleSearch = () => {
    router.push(`/profile/${search}`);
  };

  const handleMyProfile = () => {
    router.push(`./profile`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.welcome}>Welcome!</Text>

        <View style={styles.searchContainer}>
          <TextInput
            placeholder="Search profile"
            value={search}
            onChangeText={setSearch}
            style={styles.searchInput}
          />
          <Button title="Search" onPress={handleSearch} />
          <Button title="My profile" onPress={handleMyProfile} />
        </View>
      </View>
      <View style={styles.footer}>
        <Button title="Log out" onPress={handleLogout} color="#d9534f" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f4f6f9" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
    elevation: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 16,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: "flex-start",
  },
  welcome: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
    backgroundColor: "#fff",
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderColor: "#ddd",
  },
});
