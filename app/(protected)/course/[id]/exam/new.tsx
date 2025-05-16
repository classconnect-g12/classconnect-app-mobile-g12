import { useState } from "react";
import { View, StyleSheet, Pressable, ScrollView } from "react-native";
import {
  TextInput,
  Button,
  Text,
  ActivityIndicator,
  Switch,
  HelperText,
  IconButton,
} from "react-native-paper";
import { useRouter } from "expo-router";
import { useCourse } from "@context/CourseContext";
import { useSnackbar } from "@hooks/useSnackbar";
import { useAuth } from "@context/authContext";
import { createAssessment } from "@services/AssesmentService";
import DateTimePicker from "@react-native-community/datetimepicker";
import { SNACKBAR_VARIANTS } from "@constants/snackbarVariants";
import { handleApiError } from "@utils/handleApiError";
import { Image } from "react-native";
import * as ImagePicker from "expo-image-picker";

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
  const [questions, setQuestions] = useState([defaultQuestion]);
  const [loading, setLoading] = useState(false);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const router = useRouter();
  const { courseId } = useCourse();
  const { showSnackbar } = useSnackbar();
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
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        type: "EXAM",
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

  // Función para seleccionar imagen
  const handlePickImage = async (index: number) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
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
      <Pressable onPress={() => setShowStartPicker(true)}>
        <TextInput
          value={startDate.toLocaleString()}
          editable={false}
          style={styles.input}
        />
      </Pressable>
      {showStartPicker && (
        <DateTimePicker
          value={startDate}
          mode="datetime"
          onChange={(_, date) => {
            setShowStartPicker(false);
            if (date) setStartDate(date);
          }}
        />
      )}

      <Text style={styles.label}>Fecha de fin:</Text>
      <Pressable onPress={() => setShowEndPicker(true)}>
        <TextInput
          value={endDate.toLocaleString()}
          editable={false}
          style={styles.input}
        />
      </Pressable>
      {showEndPicker && (
        <DateTimePicker
          value={endDate}
          mode="datetime"
          onChange={(_, date) => {
            setShowEndPicker(false);
            if (date) setEndDate(date);
          }}
        />
      )}

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
              {q.options.map((opt, i) => (
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
