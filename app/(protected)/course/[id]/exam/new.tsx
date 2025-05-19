import { useState } from "react";
import {
  View,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
} from "react-native";
import {
  TextInput,
  Button,
  Text,
  ActivityIndicator,
  Switch,
  IconButton,
} from "react-native-paper";
import { useRouter } from "expo-router";
import { useCourse } from "@context/CourseContext";
import { useSnackbar } from "@hooks/useSnackbar";
import { useAuth } from "@context/authContext";
import {
  AssesmentQuestion,
  AssesmentType,
  createAssessment,
} from "@services/AssesmentService";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { SNACKBAR_VARIANTS } from "@constants/snackbarVariants";
import { handleApiError } from "@utils/handleApiError";
import { Image } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { AppSnackbar } from "@components/AppSnackbar";
import { createCourseStyles as styles } from "@styles/createCourseStyles";
import { colors } from "@theme/colors";
import { Picker } from "@react-native-picker/picker";

const defaultQuestion = {
  text: "",
  score: 0,
  type: "MULTIPLE_CHOICE",
  correctOption: "",
  options: ["", "", "", ""],
  sampleAnswer: "",
  hasImage: false,
  imageUri: null,
};

export default function NewExamScreen() {
  const [title, setTitle] = useState("");
  const [instructions, setInstructions] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [maxScore, setMaxScore] = useState("100");
  const [minScore, setMinScore] = useState("0");
  const [gracePeriodMinutes, setGracePeriodMinutes] = useState("0");
  const [latePenaltyPercentage, setLatePenaltyPercentage] = useState("0");
  const [allowLateSubmission, setAllowLateSubmission] = useState(false);
  const [questions, setQuestions] = useState<AssesmentQuestion[]>([
    defaultQuestion,
  ]);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { courseId } = useCourse();
  const {
    snackbarVisible,
    snackbarMessage,
    snackbarVariant,
    showSnackbar,
    hideSnackbar,
  } = useSnackbar();
  const { logout } = useAuth();

  const handleQuestionChange = (index: number, field: string, value: any) => {
    const updated = [...questions];
    updated[index] = { ...updated[index], [field]: value };
    setQuestions(updated);
  };

  const handleOptionChange = (
    qIndex: number,
    oIndex: number,
    value: string
  ) => {
    const updated = [...questions];
    updated[qIndex].options[oIndex] = value;
    setQuestions(updated);
  };

  const addQuestion = () => {
    setQuestions([...questions, { ...defaultQuestion }]);
  };

  const removeQuestion = (index: number) => {
    const updated = [...questions];
    updated.splice(index, 1);
    setQuestions(updated);
  };

  const handleSubmit = async () => {
    if (!title || !instructions || questions.length === 0) {
      showSnackbar("Please complete all the fields", SNACKBAR_VARIANTS.INFO);
      return;
    }

    setLoading(true);
    try {
      await createAssessment(courseId as string, {
        title,
        instructions,
        description: "description",
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        type: "EXAM" as AssesmentType,
        maxScore: Number(maxScore),
        minScore: Number(minScore),
        gracePeriodMinutes: Number(gracePeriodMinutes),
        latePenaltyPercentage: parseFloat(latePenaltyPercentage),
        allowLateSubmission,
        questions,
      });

      showSnackbar("Exam created", SNACKBAR_VARIANTS.SUCCESS);
      router.back();
    } catch (error) {
      handleApiError(error, showSnackbar, "Error creating exam", logout);
    } finally {
      setLoading(false);
    }
  };

  const handlePickImage = async (index: number) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images", // ✅ forma moderna
      quality: 1,
    });

    if (!result.canceled) {
      const updated = [...questions];
      updated[index].imageUri = result.assets[0].uri;
      setQuestions(updated);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="height">
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.inputContainer}>
          <TextInput
            label="Exam title"
            value={title}
            onChangeText={setTitle}
            style={styles.input}
            theme={{ colors: { primary: colors.primary } }}
          />
          <TextInput
            theme={{ colors: { primary: colors.primary } }}
            label="Instructions"
            value={instructions}
            onChangeText={setInstructions}
            multiline
            numberOfLines={4}
            style={styles.input}
          />
          <TextInput
            theme={{ colors: { primary: colors.primary } }}
            label="Max score"
            keyboardType="numeric"
            value={maxScore}
            onChangeText={setMaxScore}
            style={styles.input}
          />
          <TextInput
            theme={{ colors: { primary: colors.primary } }}
            label="Min score"
            keyboardType="numeric"
            value={minScore}
            onChangeText={setMinScore}
            style={styles.input}
          />
          <TextInput
            theme={{ colors: { primary: colors.primary } }}
            label="Minutes of tolerance"
            keyboardType="numeric"
            value={gracePeriodMinutes}
            onChangeText={setGracePeriodMinutes}
            style={styles.input}
          />
          <TextInput
            theme={{ colors: { primary: colors.primary } }}
            label="Late delivery penalty (%)"
            keyboardType="numeric"
            value={latePenaltyPercentage}
            onChangeText={setLatePenaltyPercentage}
            style={styles.input}
          />
          <View style={styles.switchRow}>
            <Text>Allow late deliveries</Text>
            <Switch
              value={allowLateSubmission}
              onValueChange={setAllowLateSubmission}
            />
          </View>

          <Text style={styles.label}>Start date:</Text>
          <Pressable
            onPress={() => {
              DateTimePickerAndroid.open({
                value: startDate,
                mode: "date",
                is24Hour: true,
                onChange: (event, selectedDate) => {
                  if (event.type === "set" && selectedDate) {
                    setStartDate(selectedDate);
                  }
                },
              });
            }}
          >
            <TextInput
              theme={{ colors: { primary: colors.primary } }}
              value={startDate.toLocaleString()}
              editable={false}
              style={styles.input}
              pointerEvents="none"
            />
          </Pressable>

          <Text style={styles.label}>End date:</Text>
          <Pressable
            onPress={() => {
              DateTimePickerAndroid.open({
                value: endDate,
                mode: "date",
                is24Hour: true,
                onChange: (event, selectedDate) => {
                  if (event.type === "set" && selectedDate) {
                    setEndDate(selectedDate);
                  }
                },
              });
            }}
          >
            <TextInput
              theme={{ colors: { primary: colors.primary } }}
              value={endDate.toLocaleString()}
              editable={false}
              style={styles.input}
              pointerEvents="none"
            />
          </Pressable>

          <Text style={styles.label}>Questions</Text>
          <View style={styles.inputContainer}>
            {questions.map((q, index) => (
              <View key={index} style={styles.questionBox}>
                <TextInput
                  theme={{ colors: { primary: colors.primary } }}
                  label={`Question #${index + 1}`}
                  value={q.text}
                  onChangeText={(text) =>
                    handleQuestionChange(index, "text", text)
                  }
                  style={styles.input}
                />
                <TextInput
                  theme={{ colors: { primary: colors.primary } }}
                  label="Score"
                  keyboardType="numeric"
                  value={String(q.score)}
                  onChangeText={(score) =>
                    handleQuestionChange(index, "score", Number(score))
                  }
                  style={styles.input}
                />
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
                    {q.options?.map((opt, i) => (
                      <TextInput
                        theme={{ colors: { primary: colors.primary } }}
                        key={i}
                        label={`Option ${String.fromCharCode(65 + i)}`}
                        value={opt}
                        onChangeText={(text) =>
                          handleOptionChange(index, i, text)
                        }
                        style={styles.input}
                      />
                    ))}
                    <TextInput
                      theme={{ colors: { primary: colors.primary } }}
                      label="Correct option (A, B, C, D)"
                      value={q.correctOption}
                      onChangeText={(text) =>
                        handleQuestionChange(index, "correctOption", text)
                      }
                      style={styles.input}
                    />
                  </>
                )}
                {q.type === "WRITTEN_ANSWER" && (
                  <TextInput
                    theme={{ colors: { primary: colors.primary } }}
                    label="Example answer"
                    value={q.sampleAnswer}
                    onChangeText={(text) =>
                      handleQuestionChange(index, "sampleAnswer", text)
                    }
                    style={styles.input}
                  />
                )}
                <View style={styles.switchRow}>
                  <Text>Has image?</Text>
                  <Switch
                    value={q.hasImage}
                    onValueChange={(value) =>
                      handleQuestionChange(index, "hasImage", value)
                    }
                  />
                  {q.hasImage && (
                    <>
                      <Button
                        mode="outlined"
                        onPress={() => handlePickImage(index)}
                        style={{ marginVertical: 8 }}
                      >
                        Select image
                      </Button>
                      {q.imageUri && (
                        <Image
                          source={{ uri: q.imageUri }}
                          style={{
                            width: "100%",
                            height: 200,
                            marginTop: 8,
                            borderRadius: 8,
                          }}
                          resizeMode="contain"
                        />
                      )}
                    </>
                  )}
                </View>
                <IconButton
                  icon="delete"
                  onPress={() => removeQuestion(index)}
                />
              </View>
            ))}
          </View>

          <Button mode="contained" onPress={addQuestion} style={styles.button}>
            Add question
          </Button>

          {loading ? (
            <ActivityIndicator style={{ marginTop: 16 }} />
          ) : (
            <Button
              mode="contained"
              onPress={handleSubmit}
              style={styles.button}
            >
              Create exam
            </Button>
          )}
          <AppSnackbar
            visible={snackbarVisible}
            message={snackbarMessage}
            onDismiss={hideSnackbar}
            variant={snackbarVariant}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
