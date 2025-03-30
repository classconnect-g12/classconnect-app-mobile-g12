import { Stack } from "expo-router";

export default function SigningLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: "#327756",
        },
        headerTintColor: "white",
      }}>
      <Stack.Screen
        name="index"
        options={{
          headerTitle: "Home",
          headerLeft: () => <></>, // Hide the back button on the home screen
          headerShown: false, // Hide the header for the tabs layout
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
      <Stack.Screen
        name="register"
        options={{
          headerTitle: "Register",
        }}
      />
      <Stack.Screen
        name="forgotPassword"
        options={{
          headerTitle: "Register",
        }}
      />
    </Stack>
  );
}
