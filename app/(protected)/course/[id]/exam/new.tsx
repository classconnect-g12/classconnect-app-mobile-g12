import { useState } from "react";
import { View, StyleSheet, Pressable, ScrollView } from "react-native";
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
  QuestionType,
} from "@services/AssesmentService";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { SNACKBAR_VARIANTS } from "@constants/snackbarVariants";
import { handleApiError } from "@utils/handleApiError";
import { Image } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { AppSnackbar } from "@components/AppSnackbar";

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
    console.log("Pressed");

    console.log(courseId);

    if (!title || !instructions || questions.length === 0) {
      showSnackbar(
        "Por favor completa todos los campos.",
        SNACKBAR_VARIANTS.INFO
      );
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

      showSnackbar("Examen creado correctamente.", SNACKBAR_VARIANTS.SUCCESS);
      router.back();
    } catch (error) {
      handleApiError(error, showSnackbar, "Error creando examen", logout);
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
    <ScrollView contentContainerStyle={styles.container}>
      <TextInput
        label="Título del examen"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />
      <TextInput
        label="Instrucciones"
        value={instructions}
        onChangeText={setInstructions}
        multiline
        numberOfLines={4}
        style={styles.input}
      />
      <TextInput
        label="Puntaje máximo"
        keyboardType="numeric"
        value={maxScore}
        onChangeText={setMaxScore}
        style={styles.input}
      />
      <TextInput
        label="Puntaje mínimo"
        keyboardType="numeric"
        value={minScore}
        onChangeText={setMinScore}
        style={styles.input}
      />
      <TextInput
        label="Minutos de tolerancia"
        keyboardType="numeric"
        value={gracePeriodMinutes}
        onChangeText={setGracePeriodMinutes}
        style={styles.input}
      />
      <TextInput
        label="Penalización por entrega tardía (%)"
        keyboardType="numeric"
        value={latePenaltyPercentage}
        onChangeText={setLatePenaltyPercentage}
        style={styles.input}
      />
      <View style={styles.switchRow}>
        <Text>Permitir entregas tardías</Text>
        <Switch
          value={allowLateSubmission}
          onValueChange={setAllowLateSubmission}
        />
      </View>

      <Text style={styles.label}>Fecha de inicio:</Text>
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
          value={startDate.toLocaleString()}
          editable={false}
          style={styles.input}
          pointerEvents="none"
        />
      </Pressable>

      <Text style={styles.label}>Fecha de fin:</Text>
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
          value={endDate.toLocaleString()}
          editable={false}
          style={styles.input}
          pointerEvents="none"
        />
      </Pressable>

      <Text style={styles.label}>Preguntas</Text>
      {questions.map((q, index) => (
        <View key={index} style={styles.questionBox}>
          <TextInput
            label={`Pregunta #${index + 1}`}
            value={q.text}
            onChangeText={(text) => handleQuestionChange(index, "text", text)}
            style={styles.input}
          />
          <TextInput
            label="Puntaje"
            keyboardType="numeric"
            value={String(q.score)}
            onChangeText={(score) =>
              handleQuestionChange(index, "score", Number(score))
            }
            style={styles.input}
          />
          <TextInput
            label="Tipo"
            value={q.type}
            onChangeText={(value) => handleQuestionChange(index, "type", value)}
            style={styles.input}
          />
          {q.type === "MULTIPLE_CHOICE" && (
            <>
              {q.options?.map((opt, i) => (
                <TextInput
                  key={i}
                  label={`Opción ${String.fromCharCode(65 + i)}`}
                  value={opt}
                  onChangeText={(text) => handleOptionChange(index, i, text)}
                  style={styles.input}
                />
              ))}
              <TextInput
                label="Opción correcta (A, B, C, D)"
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
              label="Respuesta de ejemplo"
              value={q.sampleAnswer}
              onChangeText={(text) =>
                handleQuestionChange(index, "sampleAnswer", text)
              }
              style={styles.input}
            />
          )}
          <View style={styles.switchRow}>
            <Text>¿Tiene imagen?</Text>
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
                  Seleccionar imagen
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
          <IconButton icon="delete" onPress={() => removeQuestion(index)} />
        </View>
      ))}

      <Button mode="outlined" onPress={addQuestion} style={styles.button}>
        Agregar pregunta
      </Button>

      {loading ? (
        <ActivityIndicator style={{ marginTop: 16 }} />
      ) : (
        <Button mode="contained" onPress={handleSubmit} style={styles.button}>
          Crear examen
        </Button>
      )}
      <AppSnackbar
        visible={snackbarVisible}
        message={snackbarMessage}
        onDismiss={hideSnackbar}
        variant={snackbarVariant}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flexGrow: 1,
  },
  input: {
    marginBottom: 16,
  },
  label: {
    marginTop: 16,
    marginBottom: 8,
    fontWeight: "bold",
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 8,
  },
  questionBox: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    marginVertical: 8,
    borderRadius: 8,
  },
  button: {
    marginTop: 16,
  },
});
