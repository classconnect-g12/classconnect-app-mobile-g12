import { Stack } from "expo-router";

export default function ProfileLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: "rgba(255,255,255,0.95)",
        },
        headerTintColor: "black",
      }}
    >
      <Stack.Screen
        name="[profileId]"
        options={{
          headerTitle: "Profile",
        }}
      />
      <Stack.Screen
        name="profileEdit"
        options={{
          headerTitle: "My Profile",
        }}
      />
    </Stack>
  );
}
