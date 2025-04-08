import { Stack } from "expo-router";

export default function ProfileLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: "#327756",
        },
        headerTintColor: "white",
      }}
    >
      <Stack.Screen
        name="profile"
        options={{
          headerTitle: "Profile",
        }}
      />
    </Stack>
  );
}
