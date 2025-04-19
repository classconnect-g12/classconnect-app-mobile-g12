import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ImageBackground,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
} from "react-native";
import { Appbar, AnimatedFAB, Button, Snackbar } from "react-native-paper";
import AppbarMenu from "../components/AppbarMenu";
import { router } from "expo-router";
import { colors } from "../../theme/colors";

export default function HomeScreen() {
  const [search, setSearch] = useState("");
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const showSnackbar = (message: string) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };

  const handleSearch = () => {
    if (search.trim() === "") {
      showSnackbar("Please enter a username");
      return;
    }

    if (search.length < 5) {
      showSnackbar("Username must be at least 5 characters long");
      return;
    }

    if (search.length > 30) {
      showSnackbar("Username cannot be longer than 30 characters");
      return;
    }

    router.push(`/profile/${search}`);
  };

  const handleAddCourse = () => {
    router.push("./courses");
  };

  const handleJoinClass = () => {
    router.push("./join-class");
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ImageBackground style={styles.background} resizeMode="cover">
        <View style={styles.overlay}>
          <AppbarMenu title="ClassConnect" />

          <View style={styles.content}>
            <Text style={styles.welcome}>Welcome to ClassConnect!</Text>
            <Text style={styles.subtitle}>Connect with teachers and students</Text>

            <View style={styles.mainContent}>
              <View style={styles.searchSection}>
                <Text style={styles.sectionLabel}>Find a User</Text>
                <View style={styles.searchContainer}>
                  <TextInput
                    placeholder="Enter username"
                    value={search}
                    onChangeText={setSearch}
                    style={styles.searchInput}
                    placeholderTextColor={colors.text}
                  />
                  <Button
                    mode="contained"
                    onPress={handleSearch}
                    style={styles.searchButton}
                    icon="magnify"
                    labelStyle={{ fontWeight: "bold", color: colors.buttonText }}
                  >
                    Search
                  </Button>
                </View>
              </View>

              <View style={styles.booksContainer}>
                <Image
                  source={require("../../assets/images/books.png")}
                  style={styles.booksImage}
                  resizeMode="contain"
                />
              </View>

              <View style={styles.joinSection}>
                <Text style={styles.joinTitle}>Ready to Learn?</Text>
                <Text style={styles.joinSubtitle}>Join a class to get started</Text>
                <Button
                  mode="contained"
                  onPress={handleJoinClass}
                  style={styles.joinButton}
                  labelStyle={{ fontWeight: "bold", color: colors.buttonText }}
                  icon="school"
                >
                  Join a Class
                </Button>
              </View>
            </View>
          </View>

          <AnimatedFAB
            icon="plus"
            label=""
            extended={false}
            onPress={handleAddCourse}
            style={styles.fab}
            visible
            animateFrom="right"
            color={colors.buttonText}
          />

          <Snackbar
            visible={snackbarVisible}
            onDismiss={() => setSnackbarVisible(false)}
            duration={3000}
            style={{ backgroundColor: colors.error }}
          >
            {snackbarMessage}
          </Snackbar>
        </View>
      </ImageBackground>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  welcome: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 5,
    textAlign: "center",
    color: colors.text,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    color: colors.text,
    opacity: 0.7,
    marginBottom: 20,
  },
  mainContent: {
    flex: 1,
    justifyContent: "space-between",
  },
  searchSection: {
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
    color: colors.text,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    padding: 10,
    backgroundColor: colors.inputBackground,
    color: colors.text,
  },
  searchButton: {
    backgroundColor: colors.primary,
    borderRadius: 10,
  },
  booksContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  booksImage: {
    width: 150,
    height: 150,
  },
  joinSection: {
    alignItems: "center",
    backgroundColor: colors.cardBackground,
    padding: 20,
    borderRadius: 15,
    marginTop: 20,
  },
  joinTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 5,
  },
  joinSubtitle: {
    fontSize: 16,
    color: colors.text,
    opacity: 0.7,
    marginBottom: 15,
  },
  joinButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 30,
    paddingVertical: 5,
    borderRadius: 10,
  },
  fab: {
    position: "absolute",
    right: 16,
    bottom: 16,
    backgroundColor: colors.primary,
  },
});
