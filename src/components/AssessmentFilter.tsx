import React from "react";
import { View, StyleSheet } from "react-native";
import { Button, Menu, Divider } from "react-native-paper";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { AssessmentStatus } from "@services/AssessmentService";
import { formatStatus } from "@utils/statusFormatter";
import { colors } from "@theme/colors";

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
        contentStyle={{ backgroundColor: "white" }}
        anchor={
          <Button
            mode="outlined"
            onPress={() => setMenuVisible(true)}
            style={{ borderRadius: 6, borderColor: "white", backgroundColor: colors.primary }}
            labelStyle={{ color: "white", fontSize: 14 }}
            textColor="black"
          >
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

      <View style={{ flexDirection: "row", gap: 8 }}>
        <Button
          mode="text"
          onPress={() => showDatePicker("from")}
          style={styles.dateButton}
          textColor="black"
        >
          From: {dateFrom ? dateFrom.toLocaleDateString() : "Any"}
        </Button>

        <Button
          mode="text"
          onPress={() => showDatePicker("to")}
          style={styles.dateButton}
          textColor="black"
        >
          To: {dateTo ? dateTo.toLocaleDateString() : "Any"}
        </Button>
      </View>
        
      <Button
        mode="text"
        onPress={() => {
          onStatusChange(null);
          onDateFromChange(null);
          onDateToChange(null);
        }}
        textColor="black"
        labelStyle={{ fontSize: 14, textDecorationLine: "underline" }}
      >
        Clear filters
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  dateButton: {
    borderRadius: 6,
    borderColor: "black",
    flexShrink: 1,
  },
});
