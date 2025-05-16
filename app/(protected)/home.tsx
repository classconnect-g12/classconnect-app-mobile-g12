import React from "react";
import {
  View,
  Text,
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

export default function HomeScreen() {
  const handleAddCourse = () => {
    router.push("/(protected)/course/createCourse");
  };

  const handleJoinClass = () => {
    router.push("/(protected)/course/findCourse");
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ImageBackground style={styles.background} resizeMode="cover">
        <View style={styles.overlay}>
          <AppbarMenu title="ClassConnect" viewNavigation={false}/>

          <View style={styles.content}>
            <Text style={styles.welcome}>Welcome</Text>
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
            visible={true}
            animateFrom="right"
            color={colors.buttonText}
          />
        </View>
      </ImageBackground>
    </TouchableWithoutFeedback>
  );
}
