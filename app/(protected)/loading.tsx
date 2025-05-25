import React from "react";
import { View, Text, ImageBackground } from "react-native";
import Spinner from "@components/Spinner";
import { protectedHomeStyles as styles } from "@styles/protectedHomeStyles";

export default function LoadingPage() {
  return (
    <ImageBackground
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Spinner />
          <Text style={{ fontSize: 24, marginTop: 20, color: "white" }}>
            Redirecting...
          </Text>
        </View>
      </View>
    </ImageBackground>
  );
}
