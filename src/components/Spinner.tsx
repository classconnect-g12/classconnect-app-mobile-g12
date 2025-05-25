import { colors } from "@theme/colors";
import { ActivityIndicator, View } from "react-native";

export default function Spinner() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
}
