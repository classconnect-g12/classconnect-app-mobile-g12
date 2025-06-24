import { useEffect } from "react";
import { View, Text, StyleSheet, Image, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { colors } from "@theme/colors";
import { images } from "@assets/images";

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    const timeout = setTimeout(() => {
      router.replace("/login");
    }, 2000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <View style={styles.container}>
      <Image source={images.logo} style={styles.logo} resizeMode="contain" />
      <Text style={styles.text}>
        Helping educators and students communicate, save time, and stay
        organized.
      </Text>
      <ActivityIndicator
        size="large"
        color={colors.primary}
        style={styles.spinner}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
  },
  text: {
    fontSize: 16,
    width: "80%",
    textAlign: "center",
    color: colors.text,
    marginBottom: 20,
  },
  logo: {
    width: 800,
    height: 140,
    marginBottom: 20,
  },
  spinner: {
    marginTop: 20,
  },
});
