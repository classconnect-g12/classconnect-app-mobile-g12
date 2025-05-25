import React from "react";
import { View, StyleSheet } from "react-native";
import { Button, Menu, Divider } from "react-native-paper";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { AssessmentStatus } from "@services/AssessmentService";
import { formatStatus } from "@utils/statusFormatter";

interface Props {
  selectedStatus: AssessmentStatus | null;
  onStatusChange: (status: AssessmentStatus | null) => void;
  dateFrom: Date | null;
  dateTo: Date | null;
  onDateFromChange: (date: Date | null) => void;
  onDateToChange: (date: Date | null) => void;
  isProfessor?: boolean;
}

export default function AssessmentFilters({
  selectedStatus,
  onStatusChange,
  dateFrom,
  dateTo,
  onDateFromChange,
  onDateToChange,
  isProfessor,
}: Props) {
  const [menuVisible, setMenuVisible] = React.useState(false);

  const allStatuses: AssessmentStatus[] = isProfessor
    ? ["PENDING", "IN_PROGRESS", "FINISHED"]
    : ["PENDING", "IN_PROGRESS", "COMPLETED", "OVERDUE"];

  const showDatePicker = (mode: "from" | "to") => {
    DateTimePickerAndroid.open({
      value: mode === "from" ? dateFrom ?? new Date() : dateTo ?? new Date(),
      onChange: (_, selectedDate) => {
        if (selectedDate) {
          if (mode === "from") {
            onDateFromChange(selectedDate);
          } else {
            onDateToChange(selectedDate);
          }
        }
      },
      mode: "date",
      is24Hour: true,
    });
  };

  return (
    <View style={styles.container}>
      <Menu
        visible={menuVisible}
        onDismiss={() => setMenuVisible(false)}
        anchor={
          <Button mode="outlined" onPress={() => setMenuVisible(true)}>
            {formatStatus(selectedStatus)}
          </Button>
        }
      >
        <Menu.Item onPress={() => onStatusChange(null)} title="All" />
        <Divider />
        {allStatuses.map((status) => (
          <Menu.Item
            key={status}
            onPress={() => {
              onStatusChange(status);
              setMenuVisible(false);
            }}
            title={formatStatus(status)}
          />
        ))}
      </Menu>

      <Button
        mode="outlined"
        onPress={() => showDatePicker("from")}
        style={styles.dateButton}
      >
        From: {dateFrom ? dateFrom.toLocaleDateString() : "Any"}
      </Button>

      <Button
        mode="outlined"
        onPress={() => showDatePicker("to")}
        style={styles.dateButton}
      >
        To: {dateTo ? dateTo.toLocaleDateString() : "Any"}
      </Button>

      <Button
        mode="text"
        onPress={() => {
          onStatusChange(null);
          onDateFromChange(null);
          onDateToChange(null);
        }}
      >
        Clear filters
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12,
    alignItems: "center",
  },
  dateButton: {
    flexShrink: 1,
  },
});
