import {
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  View,
} from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import { CorrelativeSelector } from "./CorrelativeSelector";
import { Picker } from "@react-native-picker/picker";
import { MaterialIcons } from "@expo/vector-icons";
import { createCourseStyles as styles } from "@styles/createCourseStyles";
import { colors } from "@theme/colors";
import {
  DateTimePickerAndroid,
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";

import React, { Dispatch, SetStateAction } from "react";
import { CourseRequestBody, Modality } from "@src/types/course";

type CourseOption = { id: string; title: string };

interface CourseFormProps {
  courseName: string;
  setCourseName: Dispatch<SetStateAction<string>>;

  description: string;
  setDescription: Dispatch<SetStateAction<string>>;

  capacity: string | null;
  setCapacity: Dispatch<SetStateAction<string>> | null;

  startDate: Date;
  setStartDate: Dispatch<SetStateAction<Date>>;

  endDate: Date;
  setEndDate: Dispatch<SetStateAction<Date>>;

  modality: Modality;
  setModality: Dispatch<SetStateAction<Modality>>;

  objectives: string | null;
  setObjectives: Dispatch<SetStateAction<string>> | null;

  syllabus: string | null;
  setSyllabus: Dispatch<SetStateAction<string>> | null;

  searchQuery: string;
  setSearchQuery: Dispatch<SetStateAction<string>>;

  allCourses: CourseOption[];
  setAllCourses: Dispatch<SetStateAction<CourseOption[]>>;

  selectedCourses: CourseOption[];
  setSelectedCourses: Dispatch<SetStateAction<CourseOption[]>>;

  handleCreateCourse: () => void;

  isLoading: boolean;

  buttonMessageActive: string;
  buttonMessageInactive: string;
}

export const CourseForm: React.FC<CourseFormProps> = ({
  courseName,
  setCourseName,
  description,
  setDescription,
  capacity,
  setCapacity,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  modality,
  setModality,
  objectives,
  setObjectives,
  syllabus,
  setSyllabus,
  searchQuery,
  setSearchQuery,
  allCourses,
  setAllCourses,
  selectedCourses,
  setSelectedCourses,
  handleCreateCourse,
  isLoading,
  buttonMessageActive,
  buttonMessageInactive,
}) => {
  const onChangeStart = (event: DateTimePickerEvent, date?: Date) => {
    if (date) {
      setStartDate(date);
    }
  };

  const onChangeEnd = (event: DateTimePickerEvent, date?: Date) => {
    if (date) {
      setEndDate(date);
    }
  };

  const openStartDatePickerAndroid = () => {
    DateTimePickerAndroid.open({
      value: startDate,
      onChange: onChangeStart,
      mode: "date",
      display: "spinner",
      minimumDate: new Date(),
      positiveButton: { label: "Confirm", textColor: colors.primary },
      negativeButton: { label: "Cancel", textColor: colors.text },
    });
  };

  const openEndDatePickerAndroid = () => {
    DateTimePickerAndroid.open({
      value: endDate,
      onChange: onChangeEnd,
      mode: "date",
      display: "spinner",
      minimumDate: new Date(),
      positiveButton: { label: "Confirm", textColor: colors.primary },
      negativeButton: { label: "Cancel", textColor: colors.text },
    });
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="height">
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Create New Course</Text>
        <Text style={styles.subtitle}>Fill in the course details</Text>

        <View style={styles.inputContainer}>
          <TextInput
            label="Course Name"
            value={courseName}
            onChangeText={setCourseName}
            mode="outlined"
            style={styles.input}
            theme={{ colors: { primary: colors.primary } }}
          />

          <TextInput
            label="Description"
            value={description}
            onChangeText={setDescription}
            mode="outlined"
            multiline
            numberOfLines={4}
            style={styles.input}
            theme={{ colors: { primary: colors.primary } }}
          />

          {objectives !== null && setObjectives !== null && (
            <TextInput
              label="Objectives"
              value={objectives}
              onChangeText={setObjectives}
              mode="outlined"
              multiline
              numberOfLines={3}
              style={styles.input}
              theme={{ colors: { primary: colors.primary } }}
            />
          )}

          {syllabus !== null && setSyllabus !== null && (
            <TextInput
              label="Syllabus"
              value={syllabus}
              onChangeText={setSyllabus}
              mode="outlined"
              multiline
              numberOfLines={3}
              style={styles.input}
              theme={{ colors: { primary: colors.primary } }}
            />
          )}

          {capacity !== null && setCapacity !== null && (
            <TextInput
              label="Capacity"
              value={capacity}
              onChangeText={setCapacity}
              mode="outlined"
              style={styles.input}
              keyboardType="numeric"
            />
          )}

          <CorrelativeSelector
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            allCourses={allCourses}
            setAllCourses={setAllCourses}
            selectedCourses={selectedCourses}
            setSelectedCourses={setSelectedCourses}
          />

          <View style={styles.input}>
            <Picker
              selectedValue={modality}
              onValueChange={(itemValue) =>
                setModality(itemValue as "ONLINE" | "ONSITE" | "HYBRID")
              }
              style={{ color: colors.text }}
            >
              <Picker.Item label="Online" value="ONLINE" />
              <Picker.Item label="Onsite" value="ONSITE" />
              <Picker.Item label="Hybrid" value="HYBRID" />
            </Picker>
          </View>

          <View style={styles.datePickerContainer}>
            <Text style={styles.dateLabel}>Start Date</Text>
            <Pressable
              onPress={openStartDatePickerAndroid}
              style={styles.datePicker}
            >
              <Text style={styles.datePickerText}>
                {startDate.toISOString().split("T")[0]}
              </Text>
              <MaterialIcons
                name="calendar-today"
                size={24}
                color={colors.primary}
                style={styles.datePickerIcon}
              />
            </Pressable>

            <Text style={styles.dateLabel}>End Date</Text>
            <Pressable
              onPress={openEndDatePickerAndroid}
              style={styles.datePicker}
            >
              <Text style={styles.datePickerText}>
                {endDate.toISOString().split("T")[0]}
              </Text>
              <MaterialIcons
                name="calendar-today"
                size={24}
                color={colors.primary}
                style={styles.datePickerIcon}
              />
            </Pressable>
          </View>

          <Button
            mode="contained"
            onPress={handleCreateCourse}
            style={styles.button}
            labelStyle={{ color: colors.buttonText }}
            disabled={isLoading}
            loading={isLoading}
          >
            {isLoading ? buttonMessageActive : buttonMessageInactive}
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
