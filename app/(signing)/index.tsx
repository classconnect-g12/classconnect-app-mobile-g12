import { Link } from "expo-router";
import { Text, View, StyleSheet, Image, TouchableOpacity } from "react-native";

export default function Index() {
  return (
    <View style={styles.container}>
      <Image source={require('../../assets/images/classconnect-logo.png')} style={styles.logo} resizeMode="contain"/>
      <Text style={styles.text}>Helping educators and students communicate, save time, and stay organized.</Text>
      <TouchableOpacity style={styles.button}>
        <Link href="/login">
          <Text style={styles.buttonText}>Start</Text>
        </Link>
      </TouchableOpacity>
      {/*<Link href="../(profile)" style={styles.button}>Profile debug</Link>*/}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  text: {
    fontSize: 16,
    width: "80%",
    textAlign: "center",
    color: "#333",
    marginBottom: 20,
    fontFamily: "System",
  },
  button: {
    width: "30%",
    padding: 15,
    borderRadius: 8,
    backgroundColor: "#4683a1",
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
  logo: {
    width: 800,
    height: 140,
    marginBottom: 20,
  },
});
