import AppbarMenu from "@components/AppbarMenu";
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
          header: () => <AppbarMenu title="Profile" viewNavigation={true} />,
        }}
      />

      <Stack.Screen
        name="profileEdit"
        options={{
          header: () => <AppbarMenu title="My profile" viewNavigation={true} />,
        }}
      />

      <Stack.Screen
        name="myFeedback"
        options={{
          header: () => <AppbarMenu title="My feedback" viewNavigation={true} />,
        }}
      />

    </Stack>
  );
}
