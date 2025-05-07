import { View, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";

export default function ModulePage() {
  const { id, moduleId } = useLocalSearchParams<{
    id: string;
    moduleId: string;
  }>();
  return (
    <View>
      <Text>Course ID: {id}</Text>
      <Text>Module ID: {moduleId}</Text>
    </View>
  );
}
