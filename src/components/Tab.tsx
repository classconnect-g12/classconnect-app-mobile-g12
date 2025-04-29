import React from "react";
import { TouchableOpacity, Text, View } from "react-native";
import { colors } from "@theme/colors";

interface TabProps {
  tab: "created" | "enrolled";
  setTab: React.Dispatch<React.SetStateAction<"created" | "enrolled">>;
}

const Tab: React.FC<TabProps> = ({ tab, setTab }) => (
  <View
    style={{
      flexDirection: "row",
      justifyContent: "center",
      marginTop: 12,
    }}
  >
    <TouchableOpacity
      onPress={() => setTab("created")}
      style={{
        padding: 10,
        backgroundColor: tab === "created" ? colors.primary : "#ccc",
        borderTopLeftRadius: 8,
        borderBottomLeftRadius: 8,
      }}
    >
      <Text style={{ color: "white" }}>Created</Text>
    </TouchableOpacity>
    <TouchableOpacity
      onPress={() => setTab("enrolled")}
      style={{
        padding: 10,
        backgroundColor: tab === "enrolled" ? colors.primary : "#ccc",
        borderTopRightRadius: 8,
        borderBottomRightRadius: 8,
      }}
    >
      <Text style={{ color: "white" }}>Enrolled</Text>
    </TouchableOpacity>
  </View>
);

export default Tab;
