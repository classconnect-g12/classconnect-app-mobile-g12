import React from "react";
import { View, Text } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { colors } from "@theme/colors";
import { findCourseStyles as styles } from "@styles/findCourseStyles";

interface CourseFilterProps {
  dateFilter: "all" | "active" | "upcoming" | "finished";
  setDateFilter: React.Dispatch<
    React.SetStateAction<"all" | "active" | "upcoming" | "finished">
  >;
}

const states = [
  { label: "All", value: "all" },
  { label: "Active", value: "active" },
  { label: "Upcoming", value: "upcoming" },
  { label: "Finished", value: "finished" },
];

const CourseFilter: React.FC<CourseFilterProps> = ({
  dateFilter,
  setDateFilter,
}) => {
  return (
    <View style={styles.filterContainer}>
      <Text style={styles.filterTitle}>Filter by Date</Text>
      <Picker
        selectedValue={dateFilter}
        onValueChange={(value) => setDateFilter(value)}
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

export default CourseFilter;
