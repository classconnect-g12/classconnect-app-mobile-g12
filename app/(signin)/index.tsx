import { Link } from "expo-router";
import { Text, View, StyleSheet, Image, TouchableOpacity } from "react-native";
import { colors } from "@theme/colors";
import { images } from "@assets/images";

export default function Index() {
  return (
    <View style={styles.container}>
      <Image source={images.logo} style={styles.logo} resizeMode="contain" />
      <Text style={styles.text}>
        Helping educators and students communicate, save time, and stay
        organized.
      </Text>
      <TouchableOpacity style={styles.button}>
        <Link href="/login">
          <Text style={styles.buttonText}>Start</Text>
        </Link>
      </TouchableOpacity>
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
    fontFamily: "System",
  },
  button: {
    width: "30%",
    padding: 15,
    borderRadius: 8,
    backgroundColor: colors.primary,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: "600",
  },
  logo: {
    width: 800,
    height: 140,
    marginBottom: 20,
  },
});
