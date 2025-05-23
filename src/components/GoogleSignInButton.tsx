import React from "react";
import { TouchableOpacity, Text, ActivityIndicator, Image } from "react-native";
import { colors } from "@theme/colors";
import { images } from "@assets/images";

export function GoogleSignInButton({
  isLoading,
  onPress,
  disabled = false,
}: {
  isLoading: boolean;
  onPress: () => void;
  disabled?: boolean;
}) {
  const isButtonDisabled = isLoading || disabled;

  return (
    <TouchableOpacity
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#fff",
        borderRadius: 8,
        paddingVertical: 12,
        marginTop: 16,
        marginBottom: 4,
        paddingHorizontal: 16,
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2,
        borderWidth: 1,
        borderColor: "#e0e0e0",
        opacity: isButtonDisabled ? 0.5 : 1,
        width: "60%",
      }}
      onPress={onPress}
      disabled={isButtonDisabled}
      activeOpacity={0.85}
    >
      {isLoading ? (
        <ActivityIndicator color={colors.secondary} />
      ) : (
        <>
          <Image
            source={images.google}
            style={{ width: 22, height: 22, marginRight: 10 }}
            resizeMode="contain"
          />
          <Text style={{ color: "#222", fontWeight: "bold", fontSize: 16 }}>
            Sign in with Google
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
}