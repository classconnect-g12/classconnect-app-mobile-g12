import React from "react";
import { TouchableOpacity, ActivityIndicator, Text, View } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { colors } from "@theme/colors";

export function BiometricButton({
  isLoading,
  onPress,
}: {
  isLoading: boolean;
  onPress: () => void;
}) {
  return (
    <View style={{ alignItems: "center", marginTop: 20 }}>
      <TouchableOpacity
        style={{
          backgroundColor: colors.secondary,
          borderRadius: 32,
          width: 56,
          height: 56,
          justifyContent: "center",
          alignItems: "center",
          elevation: 3,
          shadowColor: "#000",
          shadowOpacity: 0.15,
          shadowRadius: 8,
        }}
        onPress={onPress}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Icon name="fingerprint" size={32} color="#fff" />
        )}
      </TouchableOpacity>
      <Text style={{ marginTop: 8, color: colors.secondary, fontWeight: "bold" }}>
        Biometrics
      </Text>
    </View>
  );
}