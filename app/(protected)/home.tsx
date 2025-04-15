import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ImageBackground,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { Appbar, AnimatedFAB, Button } from "react-native-paper";
import AppbarMenu from "../components/AppbarMenu";
import { router } from "expo-router";

export default function HomeScreen() {
  const [search, setSearch] = useState("");

  const handleSearch = () => {
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
            <Text style={styles.welcome}>Welcome!</Text>

            <View style={styles.searchContainer}>
              <TextInput
                placeholder="Search profile"
                value={search}
                onChangeText={setSearch}
                style={styles.searchInput}
              />
              <Appbar.Action icon="magnify" onPress={handleSearch} />
            </View>

            <View style={styles.noCoursesContainer}>
              <Text style={styles.noCoursesText}>No courses found</Text>
              <Button
                mode="contained"
                onPress={handleJoinClass}
                style={styles.joinButton}
                labelStyle={{ fontWeight: "bold" }}
              >
                Join a class
              </Button>
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
            color="#fff"
          />
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
    backgroundColor: "rgba(230, 230, 230, 0.85)",
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
    textAlign: "center",
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
  noCoursesContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noCoursesText: {
    fontSize: 18,
    marginBottom: 16,
    textAlign: "center",
    opacity: 0.5,
  },
  joinButton: {
    backgroundColor: "green",
    paddingHorizontal: 20,
    paddingVertical: 5,
    borderRadius: 8,
  },
  fab: {
    position: "absolute",
    right: 16,
    bottom: 16,
    backgroundColor: "green",
  },
});
