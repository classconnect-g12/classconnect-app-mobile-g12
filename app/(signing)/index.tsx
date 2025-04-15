import { Link } from "expo-router";
import { Text, View, StyleSheet, Image } from "react-native";

export default function Index() {
  return (
    <View style={styles.container}>
      <Image source={require('../../assets/images/classconnect-logo.png')} style={styles.logo} resizeMode="contain"/>
      <Text style={styles.text}>Helping educators and students communicate, save time, and stay organized.</Text>
      <Link href="/login" style={styles.button}>
        <Text style={styles.text}>Start</Text>
      </Link>
      {/*<Link href="../(profile)" style={styles.button}>Profile debug</Link>*/}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#bce5ff",
  },
  text: {
    fontSize: 14,
    width: "80%",
    textAlign: "center",
    fontWeight: "bold",
    fontFamily: "serif",
  },
  title: {
    fontSize: 20,
    opacity: 0.5,
    marginBottom: 10,
  },
  button: {
    width: "30%",
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#4683a1",
    color: "#fff",
    marginTop: 40,
  },
  logo: {
    width: 800,
    height: 140,
    marginBottom: 20,
  },
});
