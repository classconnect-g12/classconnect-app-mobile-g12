import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ImageBackground,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
} from "react-native";
import { AnimatedFAB, Button, Snackbar } from "react-native-paper";
import AppbarMenu from "@components/AppbarMenu";
import { router } from "expo-router";
import { colors } from "@theme/colors";
import { images } from "@assets/images";
import { protectedHomeStyles as styles } from "@styles/protectedHomeStyles";
import { AppSnackbar } from "@components/AppSnackbar";
import { validateUsername } from "@utils/validators";
import { useSnackbar } from "@hooks/useSnackbar";
import { SNACKBAR_VARIANTS } from "@constants/snackbarVariants";

export default function HomeScreen() {
  const [search, setSearch] = useState("");

  const {
    snackbarVisible,
    snackbarMessage,
    snackbarVariant,
    showSnackbar,
    hideSnackbar,
  } = useSnackbar();

  const handleSearch = () => {
    const validationError = validateUsername(search);
    if (validationError) {
      showSnackbar(validationError, SNACKBAR_VARIANTS.INFO);
      return;
    }

    router.push(`/profile/${search}`);
  };

  const handleAddCourse = () => {
    // TODO: implement
    router.push("./courses");
  };

  const handleJoinClass = () => {
    // TODO: implement
    router.push("./join-class");
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ImageBackground style={styles.background} resizeMode="cover">
        <View style={styles.overlay}>
          <AppbarMenu title="ClassConnect" />

          <View style={styles.content}>
            <Text style={styles.welcome}>Welcome</Text>
            <Text style={styles.subtitle}>
              Connect with teachers and students
            </Text>

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
                    labelStyle={{
                      fontWeight: "bold",
                      color: colors.buttonText,
                    }}
                  >
                    Search
                  </Button>
                </View>
              </View>

              <View style={styles.booksContainer}>
                <Image
                  source={images.book}
                  style={styles.booksImage}
                  resizeMode="contain"
                />
              </View>

              <View style={styles.joinSection}>
                <Text style={styles.joinTitle}>Ready to Learn?</Text>
                <Text style={styles.joinSubtitle}>
                  Join a class to get started
                </Text>
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

          <AppSnackbar
            visible={snackbarVisible}
            message={snackbarMessage}
            onDismiss={hideSnackbar}
            variant={snackbarVariant}
          />
        </View>
      </ImageBackground>
    </TouchableWithoutFeedback>
  );
}
