import { Picker } from "@react-native-picker/picker";
import React from "react";
import { View, TextInput } from "react-native";

type Filters = {
  name: string;
  state: "all" | "active" | "upcoming" | "finished";
};

type Props = {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
};

export default function CourseFilter({ filters, setFilters }: Props) {
  return (
    <View style={{ padding: 16 }}>
      <TextInput
        placeholder="Search by name"
        value={filters.name}
        onChangeText={(text) => setFilters((prev) => ({ ...prev, name: text }))}
        style={{ borderWidth: 1, padding: 8, marginBottom: 8 }}
      />

      <Picker
        selectedValue={filters.state}
        onValueChange={(value) =>
          setFilters((prev) => ({ ...prev, state: value }))
        }
      >
        <Picker.Item label="All" value="all" />
        <Picker.Item label="Active" value="active" />
        <Picker.Item label="Upcoming" value="upcoming" />
        <Picker.Item label="Finished" value="finished" />
      </Picker>
    </View>
  );
}
