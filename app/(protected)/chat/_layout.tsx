import AppbarMenu from "@components/AppbarMenu";
import { Stack } from "expo-router";

export default function ChatLayout() {
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
        name="myChats"
        options={{
          header: () => <AppbarMenu title="My chats" viewNavigation={true} />,
        }}
      />

      <Stack.Screen
        name="[chatId]"
        options={{
          header: () => <AppbarMenu title="Chat" viewNavigation={true} />,
        }}
      />
    </Stack>
  );
}
