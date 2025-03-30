import { Stack } from "expo-router";
// import { LogBox } from "react-native";

// LogBox.ignoreAllLogs(true); // Ignore all log notifications

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="(signing)"
        options={{
          headerShown: false, // Hide the header for the tabs layout
        }}
      />
      <Stack.Screen name="+not-found" options={{ title: "Oops!: Not Found" }} />
    </Stack>
  );
}
