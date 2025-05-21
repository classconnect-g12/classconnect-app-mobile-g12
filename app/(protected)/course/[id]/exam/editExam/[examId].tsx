import { useEffect, useState } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import AssessmentForm from "@components/AssesmentForm";
import { useAuth } from "@context/authContext";
import { useSnackbar } from "@hooks/useSnackbar";
import {
  AssessmentQuestion,
  getAssessmentById,
  updateAssessment,
} from "@services/AssessmentService";
import { SNACKBAR_VARIANTS } from "@constants/snackbarVariants";
import { handleApiError } from "@utils/handleApiError";
import * as ImagePicker from "expo-image-picker";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";

const defaultQuestion: AssessmentQuestion = {
  text: "",
  score: 0,
  type: "MULTIPLE_CHOICE",
  correctOption: "",
  options: ["", "", "", ""],
  sampleAnswer: "",
  hasImage: false,
};

export default function EditExamScreen() {
  const router = useRouter();
  const { id, examId } = useLocalSearchParams();
  const { logout } = useAuth();
  const {
    snackbarVisible,
    snackbarMessage,
    snackbarVariant,
    showSnackbar,
    hideSnackbar,
  } = useSnackbar();

  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [instructions, setInstructions] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [maxScore, setMaxScore] = useState("100");
  const [minScore, setMinScore] = useState("0");
  const [gracePeriodMinutes, setGracePeriodMinutes] = useState("0");
  const [latePenaltyPercentage, setLatePenaltyPercentage] = useState("0");
  const [allowLateSubmission, setAllowLateSubmission] = useState(false);
  const [questions, setQuestions] = useState<AssessmentQuestion[]>([
    defaultQuestion,
  ]);
  const [questionImages, setQuestionImages] = useState<
    ({ uri: string; name: string; mimeType: string } | null)[]
  >([null]);

  useEffect(() => {
    const loadAssessment = async () => {
      try {
        setLoading(true);

        const data = await getAssessmentById(id as string, examId as string);
        setTitle(data.title);
        setInstructions(data.instructions);
        setStartDate(new Date(data.startDate));
        setEndDate(new Date(data.endDate));
        setMaxScore(data.maxScore.toString());
        setMinScore(data.minScore.toString());
        setGracePeriodMinutes(data.gracePeriodMinutes.toString());
        setLatePenaltyPercentage(data.latePenaltyPercentage.toString());
        setAllowLateSubmission(data.allowLateSubmission);
        setQuestions(data.questions);
        setQuestionImages(
          data.questionImages ?? data.questions.map(() => null)
        );
      } catch (err) {
        handleApiError(err, showSnackbar, "Error loading exam", logout);
      } finally {
        setLoading(false);
      }
    };

    loadAssessment();
  }, [examId]);

  const handleQuestionChange = (
    index: number,
    field: keyof AssessmentQuestion,
    value: any
  ) => {
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
    if (!updated[qIndex].options) {
      updated[qIndex].options = ["", "", "", ""];
    }
    updated[qIndex].options![oIndex] = value;
    setQuestions(updated);
  };

  const addQuestion = () => {
    setQuestions([...questions, { ...defaultQuestion }]);
    setQuestionImages([...questionImages, null]);
  };

  const removeQuestion = (index: number) => {
    const updatedQuestions = [...questions];
    updatedQuestions.splice(index, 1);
    setQuestions(updatedQuestions);
    const updatedImages = [...questionImages];
    updatedImages.splice(index, 1);
    setQuestionImages(updatedImages);
  };

  const handlePickImage = async (index: number) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      quality: 1,
    });
    if (!result.canceled) {
      const asset = result.assets[0];
      const updatedImages = [...questionImages];
      updatedImages[index] = {
        uri: asset.uri,
        name: asset.fileName || `image${index}.jpg`,
        mimeType: asset.mimeType || "image/jpeg",
      };
      setQuestionImages(updatedImages);
    }
  };

  const showDateTimePicker = (
    currentDate: Date,
    onConfirm: (selectedDateTime: Date) => void
  ) => {
    DateTimePickerAndroid.open({
      value: currentDate,
      mode: "date",
      is24Hour: true,
      onChange: (event, selectedDate) => {
        if (event.type === "set" && selectedDate) {
          DateTimePickerAndroid.open({
            value: selectedDate,
            mode: "time",
            is24Hour: true,
            onChange: (e, selectedTime) => {
              if (e.type === "set" && selectedTime) {
                const newDateTime = new Date(selectedDate);
                newDateTime.setHours(selectedTime.getHours());
                newDateTime.setMinutes(selectedTime.getMinutes());
                onConfirm(newDateTime);
              }
            },
          });
        }
      },
    });
  };

  const handleSubmit = async () => {
    if (!title) {
      showSnackbar("Please complete the exam title", SNACKBAR_VARIANTS.ERROR);
      return;
    }

    if (!instructions) {
      showSnackbar(
        "Please complete the exam instructions",
        SNACKBAR_VARIANTS.ERROR
      );
      return;
    }

    if (parseInt(maxScore) <= 0) {
      showSnackbar(
        "Max score can't be less or equal than zero",
        SNACKBAR_VARIANTS.ERROR
      );
      return;
    }

    if (parseInt(minScore) < 0) {
      showSnackbar(
        "Min score can't be less or equal than zero",
        SNACKBAR_VARIANTS.ERROR
      );
      return;
    }

    if (parseInt(maxScore) < parseInt(minScore)) {
      showSnackbar(
        "Max score can't be smaller than min score",
        SNACKBAR_VARIANTS.ERROR
      );
      return;
    }

    if (parseInt(gracePeriodMinutes) < 0) {
      showSnackbar(
        "Tolerance minutes can't be less than zero",
        SNACKBAR_VARIANTS.ERROR
      );
      return;
    }

    if (parseFloat(latePenaltyPercentage) < 0.0) {
      showSnackbar(
        "Late delivery pentalty can't be less than zero",
        SNACKBAR_VARIANTS.ERROR
      );
      return;
    }

    if (startDate >= endDate) {
      showSnackbar(
        "End date must be after start date",
        SNACKBAR_VARIANTS.ERROR
      );
      return;
    }

    if (questions.length === 0) {
      showSnackbar(
        "Please add at least one question to the exam",
        SNACKBAR_VARIANTS.ERROR
      );
      return;
    }

    let totalQuestionsScore = questions.reduce(
      (total, question) => total + question.score,
      0
    );

    if (totalQuestionsScore !== parseInt(maxScore)) {
      showSnackbar(
        "The total question scores must equal the maximum score",
        SNACKBAR_VARIANTS.ERROR
      );
      return;
    }
    setLoading(true);
    try {
      await updateAssessment(id as string, examId as string, {
        title,
        instructions,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        maxScore: parseInt(maxScore),
        minScore: parseInt(minScore),
        gracePeriodMinutes: parseInt(gracePeriodMinutes),
        latePenaltyPercentage: parseFloat(latePenaltyPercentage),
        allowLateSubmission,
        questions,
        questionImages,
      });
      showSnackbar("Exam updated", SNACKBAR_VARIANTS.SUCCESS);
      router.back();
    } catch (err) {
      handleApiError(err, showSnackbar, "Error updating exam", logout);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AssessmentForm
      type="EXAM"
      values={{
        title,
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
      }}
      onChange={{
        setTitle,
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
      }}
      onSubmit={handleSubmit}
      onPickImage={handlePickImage}
      addQuestion={addQuestion}
      removeQuestion={removeQuestion}
      loading={loading}
      submitButtonText="Update exam"
      snackbar={{
        visible: snackbarVisible,
        message: snackbarMessage,
        onDismiss: hideSnackbar,
        variant: snackbarVariant,
      }}
      showDateTimePicker={showDateTimePicker}
    />
  );
}
