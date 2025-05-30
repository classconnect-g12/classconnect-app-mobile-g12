import React, { Dispatch, SetStateAction } from "react";
import {
  KeyboardAvoidingView,
  ScrollView,
  View,
  Pressable,
  Image,
} from "react-native";
import {
  TextInput,
  Text,
  Button,
  Switch,
  ActivityIndicator,
  IconButton,
  RadioButton,
} from "react-native-paper";
import { Picker } from "@react-native-picker/picker";
import {
  AssessmentType,
  AssessmentQuestion,
} from "@services/AssessmentService";
import { createCourseStyles as styles } from "@styles/createCourseStyles";
import { colors } from "@theme/colors";

type QuestionImages = ({
  uri: string;
  name: string;
  mimeType: string;
} | null)[];

type Values = {
  title: string;
  description: string;
  instructions: string;
  maxScore: string;
  minScore: string;
  gracePeriodMinutes: string;
  latePenaltyPercentage: string;
  allowLateSubmission: boolean;
  startDate: Date;
  endDate: Date;
  questions: AssessmentQuestion[];
  questionImages: QuestionImages;
};

type OnChangeHandlers = {
  setTitle: Dispatch<SetStateAction<string>>;
  setDescription: Dispatch<SetStateAction<string>>;
  setInstructions: Dispatch<SetStateAction<string>>;
  setMaxScore: Dispatch<SetStateAction<string>>;
  setMinScore: Dispatch<SetStateAction<string>>;
  setGracePeriodMinutes: Dispatch<SetStateAction<string>>;
  setLatePenaltyPercentage: Dispatch<SetStateAction<string>>;
  setAllowLateSubmission: Dispatch<SetStateAction<boolean>>;
  setStartDate: Dispatch<SetStateAction<Date>>;
  setEndDate: Dispatch<SetStateAction<Date>>;
  handleQuestionChange: (
    index: number,
    field: keyof AssessmentQuestion,
    value: any
  ) => void;
  handleOptionChange: (qIndex: number, oIndex: number, value: string) => void;
};

type AssessmentFormProps = {
  type?: AssessmentType;
  values: Values;
  onChange: OnChangeHandlers;
  onSubmit: () => void;
  onPickImage: (index: number) => Promise<void>;
  addQuestion: () => void;
  removeQuestion: (index: number) => void;
  loading: boolean;
  submitButtonText?: string;
  showDateTimePicker: (
    currentDate: Date,
    onConfirm: (selectedDateTime: Date) => void
  ) => void;
};

const AssessmentForm = ({
  type = "EXAM",
  values,
  onChange,
  onSubmit,
  onPickImage,
  addQuestion,
  removeQuestion,
  loading,
  submitButtonText = "Save",
  showDateTimePicker,
}: AssessmentFormProps) => {
  const {
    title,
    description,
    instructions,
    maxScore,
    minScore,
    gracePeriodMinutes,
    latePenaltyPercentage,
    allowLateSubmission,
    startDate,
    endDate,
    questions,
    questionImages,
  } = values;

  const {
    setTitle,
    setDescription,
    setInstructions,
    setMaxScore,
    setMinScore,
    setGracePeriodMinutes,
    setLatePenaltyPercentage,
    setAllowLateSubmission,
    setStartDate,
    setEndDate,
    handleQuestionChange,
    handleOptionChange,
  } = onChange;

  return (
    <KeyboardAvoidingView style={styles.container} behavior="height">
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.inputContainer}>
          <TextInput
            label={`${
              type.charAt(0).toUpperCase() + type.slice(1).toLocaleLowerCase()
            } title`}
            value={title}
            onChangeText={setTitle}
            style={styles.input}
            theme={{ colors: { primary: colors.primary } }}
          />
          <TextInput
            label="Description"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            style={styles.input}
            theme={{ colors: { primary: colors.primary } }}
          />
          <TextInput
            label="Instructions"
            value={instructions}
            onChangeText={setInstructions}
            multiline
            numberOfLines={4}
            style={styles.input}
            theme={{ colors: { primary: colors.primary } }}
          />
          <TextInput
            label="Max score"
            keyboardType="numeric"
            value={maxScore}
            onChangeText={setMaxScore}
            style={styles.input}
            theme={{ colors: { primary: colors.primary } }}
          />
          <TextInput
            label="Min score"
            keyboardType="numeric"
            value={minScore}
            onChangeText={setMinScore}
            style={styles.input}
            theme={{ colors: { primary: colors.primary } }}
          />
          <TextInput
            label="Minutes of tolerance"
            keyboardType="numeric"
            value={gracePeriodMinutes}
            onChangeText={setGracePeriodMinutes}
            style={styles.input}
            theme={{ colors: { primary: colors.primary } }}
          />
          <TextInput
            label="Late delivery penalty (%)"
            keyboardType="numeric"
            value={latePenaltyPercentage}
            onChangeText={setLatePenaltyPercentage}
            style={styles.input}
            theme={{ colors: { primary: colors.primary } }}
          />
          <View style={styles.switchRow}>
            <Text>Allow late deliveries</Text>
            <Switch
              value={allowLateSubmission}
              onValueChange={setAllowLateSubmission}
              color={colors.primary}
            />
          </View>

          <Text>Start date:</Text>
          <Pressable
            onPress={() => showDateTimePicker(startDate, setStartDate)}
          >
            <TextInput
              value={startDate.toLocaleString()}
              editable={false}
              style={styles.input}
              pointerEvents="none"
              theme={{ colors: { primary: colors.primary } }}
            />
          </Pressable>

          <Text>End date:</Text>
          <Pressable onPress={() => showDateTimePicker(endDate, setEndDate)}>
            <TextInput
              value={endDate.toLocaleString()}
              editable={false}
              style={styles.input}
              pointerEvents="none"
              theme={{ colors: { primary: colors.primary } }}
            />
          </Pressable>

          <Text>Questions</Text>
          <View style={styles.inputContainer}>
            {questions.map((q, index) => (
              <View key={index}>
                <TextInput
                  label={`Question #${index + 1}`}
                  value={q.text}
                  onChangeText={(text) =>
                    handleQuestionChange(index, "text", text)
                  }
                  style={styles.input}
                  theme={{ colors: { primary: colors.primary } }}
                />
                <TextInput
                  label="Score"
                  keyboardType="numeric"
                  value={String(q.score)}
                  onChangeText={(score) =>
                    handleQuestionChange(index, "score", Number(score))
                  }
                  style={styles.input}
                  theme={{ colors: { primary: colors.primary } }}
                />
                <Text style={{ marginBottom: 10, marginTop: 20 }}>
                  Question type
                </Text>
                <View style={styles.input}>
                  <Picker
                    selectedValue={q.type}
                    onValueChange={(value) =>
                      handleQuestionChange(index, "type", value)
                    }
                    style={{ color: colors.text }}
                  >
                    <Picker.Item
                      label="Multiple Choice"
                      value="MULTIPLE_CHOICE"
                    />
                    <Picker.Item
                      label="Written answer"
                      value="WRITTEN_ANSWER"
                    />
                    <Picker.Item
                      label="File attachment"
                      value="FILE_ATTACHMENT"
                    />
                  </Picker>
                </View>

                {q.type === "MULTIPLE_CHOICE" && (
                  <>
                    <RadioButton.Group
                      onValueChange={(value) =>
                        handleQuestionChange(
                          index,
                          "correctOption",
                          q.options?.[Number(value)] ?? ""
                        )
                      }
                      value={
                        q.options
                          ?.findIndex((opt) => opt === q.correctOption)
                          ?.toString() ?? ""
                      }
                    >
                      {q.options?.map((opt, i) => {
                        const optionKey = String.fromCharCode(65 + i);
                        return (
                          <View key={i} style={styles.optionRow}>
                            <TextInput
                              label={`Option ${optionKey}`}
                              value={opt}
                              onChangeText={(text) =>
                                handleOptionChange(index, i, text)
                              }
                              style={[styles.input, { flex: 1 }]}
                              theme={{ colors: { primary: colors.primary } }}
                            />
                            <RadioButton value={i.toString()} />
                          </View>
                        );
                      })}
                    </RadioButton.Group>
                  </>
                )}

                {q.type === "WRITTEN_ANSWER" && (
                  <TextInput
                    label="Example answer"
                    value={q.sampleAnswer}
                    onChangeText={(text) =>
                      handleQuestionChange(index, "sampleAnswer", text)
                    }
                    style={styles.input}
                    theme={{ colors: { primary: colors.primary } }}
                  />
                )}

                <View style={{ marginVertical: 8 }}>
                  <View style={styles.switchRow}>
                    <Text>Has image?</Text>
                    <Switch
                      color={colors.primary}
                      value={q.hasImage}
                      onValueChange={(value) =>
                        handleQuestionChange(index, "hasImage", value)
                      }
                    />
                  </View>

                  {q.hasImage && (
                    <View
                      style={{
                        marginTop: 8,
                        width: "100%",
                        flexDirection: "column",
                      }}
                    >
                      <Button
                        mode="outlined"
                        onPress={() => onPickImage(index)}
                        style={{ marginBottom: 8 }}
                        textColor={colors.primary}
                      >
                        Select image
                      </Button>
                      {questionImages[index] && (
                        <View
                          style={{
                            marginTop: 8,
                            width: "100%",
                            flexDirection: "column",
                            alignItems: "center",
                          }}
                        >
                          <Image
                            source={{ uri: questionImages[index]!.uri }}
                            style={{
                              width: "100%",
                              height: 200,
                              borderRadius: 8,
                              marginTop: 8,
                            }}
                            resizeMode="contain"
                          />
                        </View>
                      )}
                    </View>
                  )}
                </View>

                <IconButton
                  icon="delete"
                  onPress={() => removeQuestion(index)}
                />
              </View>
            ))}
          </View>

          <Button
            mode="contained"
            onPress={addQuestion}
            style={styles.buttonAddQuestion}
          >
            Add question
          </Button>

          {loading ? (
            <ActivityIndicator style={{ marginTop: 16 }} />
          ) : (
            <Button mode="contained" onPress={onSubmit} style={styles.button}>
              {submitButtonText}
            </Button>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default AssessmentForm;
