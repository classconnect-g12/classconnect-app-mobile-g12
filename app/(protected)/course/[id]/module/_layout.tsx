import { Stack } from "expo-router";
import { ModuleProvider } from "@context/ModuleContext";
import { CustomTitle } from "@components/CustomTitle";

export default function ModuleLayout() {
  return (
    <ModuleProvider>
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            headerTitle: () => CustomTitle("Modules"),
            headerTitleAlign: "center",
          }}
        />
        <Stack.Screen
          name="[moduleId]"
          options={{
            headerTitle: () => CustomTitle("Resources"),
            headerTitleAlign: "center",
          }}
        />
      </Stack>
    </ModuleProvider>
  );
}
