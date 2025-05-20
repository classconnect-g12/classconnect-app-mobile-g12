import { colors } from "@theme/colors";
import { router } from "expo-router";
import { TouchableOpacity, View } from "react-native";
import { IconButton, Text } from "react-native-paper";

export default function feedback() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Feedback</Text>
    </View>
  );
}
