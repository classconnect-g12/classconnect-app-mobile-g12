import React from "react";
import { View, Text } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { TextInput } from "react-native-paper";
import { colors } from "@theme/colors";
import { findCourseStyles as styles } from "@styles/findCourseStyles";

interface MyCourseFilterProps {
  filters: {
    name: string;
    state: "all" | "active" | "upcoming" | "finished";
  };
  setFilters: React.Dispatch<
    React.SetStateAction<{
      name: string;
      state: "all" | "active" | "upcoming" | "finished";
    }>
  >;
}

const states = [
  { label: "All", value: "all" },
  { label: "Active", value: "active" },
  { label: "Upcoming", value: "upcoming" },
  { label: "Finished", value: "finished" },
];

const MyCourseFilter: React.FC<MyCourseFilterProps> = ({
  filters,
  setFilters,
}) => {
  const handleNameSubmit = () => {
    // Filtering is handled in MyCourses via categorizeCourses
  };

  return (
    <View style={styles.filterContainer}>
      <Text style={styles.filterTitle}>Filter Courses</Text>
      <TextInput
        label="Search by Course Title"
        value={filters.name}
        onChangeText={(text) => setFilters((prev) => ({ ...prev, name: text }))}
        onSubmitEditing={handleNameSubmit}
        mode="outlined"
        style={styles.filterInput}
        theme={{ colors: { primary: colors.primary } }}
      />
      <Text style={[styles.filterTitle, { marginTop: 10 }]}>
        Filter by Date
      </Text>
      <Picker
        selectedValue={filters.state}
        onValueChange={(value) =>
          setFilters((prev) => ({ ...prev, state: value }))
        }
        style={styles.filterPicker}
      >
        {states.map((state) => (
          <Picker.Item
            label={state.label}
            value={state.value}
            key={state.value}
            color={colors.text}
          />
        ))}
      </Picker>
    </View>
  );
};

export default MyCourseFilter;
