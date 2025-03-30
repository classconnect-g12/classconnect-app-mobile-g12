import { Link } from "expo-router";
import { Text, View, StyleSheet } from "react-native";

export default function Index() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Home Screen</Text>
      <Link href="/login" style={styles.button}>
        <Text style={styles.text}>Start</Text>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 20,
  },
  button: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#007AFF",
    color: "#fff",
    marginTop: 20,
  },
});
