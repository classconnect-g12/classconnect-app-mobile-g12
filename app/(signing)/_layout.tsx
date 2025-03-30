import { Stack } from "expo-router";

export default function SigningLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerTitle: "Home",
          headerLeft: () => <></>, // Hide the back button on the home screen
        }}
      />
      <Stack.Screen
        name="about"
        options={{
          headerTitle: "About",
        }}
      />
      <Stack.Screen
        name="login"
        options={{
          headerTitle: "Login",
        }}
      />
    </Stack>
  );
}
