import { colors } from "@theme/colors";
import { router } from "expo-router";
import { TouchableOpacity, View } from "react-native";
import { IconButton, Text } from "react-native-paper";

export default function feedback() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <View
        style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}
      >
        <IconButton icon="arrow-left" size={24} onPress={() => router.back()} />
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={{ fontSize: 16, color: colors.primary }}>
            Back to More
          </Text>
        </TouchableOpacity>
      </View>
      <Text>Feedback</Text>
    </View>
  );
}
