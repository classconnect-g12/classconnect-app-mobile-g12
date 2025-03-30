import { Link, Stack } from "expo-router";
import { Text, View, StyleSheet } from "react-native";

export default function NotFoundScreen() {
    return (
        <>
            <Stack.Screen options={{ title: "Oops!: Not Found" }} />
            <View style={styles.container}>
                <Link href="/" style={styles.button}>
                    Go Back to Home Screen!
                </Link>
            </View>
        </>
    )
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
  }
});