import React from "react";
import { Text, View } from "react-native";

interface SectionHeaderProps {
  title: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title }) => (
  <Text
    style={{
      fontSize: 18,
      fontWeight: "bold",
      marginVertical: 12,
      backgroundColor: "#f0f0f0",
      padding: 8,
      borderRadius: 6,
    }}
  >
    {title}
  </Text>
);

export default SectionHeader;
