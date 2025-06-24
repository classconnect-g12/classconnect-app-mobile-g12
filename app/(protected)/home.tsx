import React from "react";
import {
  View,
  Text,
  ImageBackground,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
} from "react-native";
import { AnimatedFAB, Button, IconButton } from "react-native-paper";
import AppbarMenu from "@components/AppbarMenu";
import { router } from "expo-router";
import { colors } from "@theme/colors";
import { images } from "@assets/images";
import { protectedHomeStyles as styles } from "@styles/protectedHomeStyles";
import { useAuth } from "@context/authContext";

export default function HomeScreen() {
  const { username } = useAuth();

  const handleAddCourse = () => {
    router.push("/(protected)/course/createCourse");
  };

  const handleJoinClass = () => {
    router.push("/(protected)/course/findCourse");
  };

  const handleMyCourses = () => {
    router.push("/(protected)/course/myCourses");
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ImageBackground style={styles.background} resizeMode="cover">
        <View style={styles.overlay}>
          <AppbarMenu title="ClassConnect" viewNavigation={false} />

          <View style={styles.content}>
            <Text style={styles.welcome}>
              Welcome to ClassConnect{username ? ` ${username}` : ""}!
            </Text>

            <Text style={styles.subtitle}>
              Connect with teachers and students
            </Text>

            <View style={styles.mainContent}>
              <View style={styles.booksContainer}>
                <Image
                  source={images.book}
                  style={styles.booksImage}
                  resizeMode="contain"
                />
              </View>
              <View style={styles.joinSection}>
                <Text style={styles.joinTitle}>
                  What would you like to do today?
                </Text>
                <Text style={styles.joinSubtitle}>
                  Choose an option below to get started
                </Text>
                <View style={styles.joinSectionButtons}>
                  <Button
                    mode="contained"
                    onPress={handleJoinClass}
                    style={styles.joinButton}
                    labelStyle={{
                      fontWeight: "bold",
                      color: colors.buttonText,
                    }}
                    icon="school"
                  >
                    Join a course
                  </Button>

                  <Button
                    mode="contained"
                    onPress={handleMyCourses}
                    style={styles.joinButton}
                    labelStyle={{
                      fontWeight: "bold",
                      color: colors.buttonText,
                    }}
                    icon="book"
                  >
                    View my courses
                  </Button>
                </View>
              </View>
            </View>

            <Text style={{ color: "gray" }}>classconnect-g-12</Text>
          </View>

          <View style={styles.fabHintContainer}>
            <Text style={styles.fabHintText}>Create a course</Text>
            <IconButton
              icon="arrow-down-right"
              size={32}
              style={styles.fabHintIcon}
              iconColor="black"
            />
          </View>

          <AnimatedFAB
            icon="plus"
            label=""
            extended={false}
            onPress={handleAddCourse}
            style={styles.fab}
            visible={true}
            animateFrom="right"
            color={colors.buttonText}
          />
        </View>
      </ImageBackground>
    </TouchableWithoutFeedback>
  );
}
