import React from "react";
import { TouchableOpacity, Text, View } from "react-native";
import { colors } from "@theme/colors";

interface TabOption {
  key: string;
  label: string;
}

interface TabProps {
  tab: "created" | "enrolled" | "favorites";
  setTab: (tab: "created" | "enrolled" | "favorites") => void;
  options: TabOption[];
}

const Tab: React.FC<TabProps> = ({ tab, setTab, options }) => (
  <View
    style={{
      flexDirection: "row",
      justifyContent: "center",
      marginTop: 12,
    }}
  >
    {options.map((option, idx) => (
      <TouchableOpacity
        key={option.key}
        onPress={() => setTab(option.key as "created" | "enrolled" | "favorites")}
        style={{
          padding: 10,
          backgroundColor: tab === option.key ? colors.primary : "#ccc",
          borderTopLeftRadius: idx === 0 ? 8 : 0,
          borderBottomLeftRadius: idx === 0 ? 8 : 0,
          borderTopRightRadius: idx === options.length - 1 ? 8 : 0,
          borderBottomRightRadius: idx === options.length - 1 ? 8 : 0,
        }}
      >
        <Text style={{ color: "white" }}>{option.label}</Text>
      </TouchableOpacity>
    ))}
  </View>
);

export default Tab;