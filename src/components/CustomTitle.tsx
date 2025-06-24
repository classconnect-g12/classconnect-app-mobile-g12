import React from "react";
import { Text } from "react-native";

export const CustomTitle = (title: string) => (
  <Text
    style={{
      textAlign: "center",
      textDecorationLine: "underline",
      fontSize: 18,
      fontWeight: "bold",
    }}
  >
    {title}
  </Text>
);
