import React, { useState } from "react";
import { View, Alert, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { Text, TextInput, Button } from "react-native-paper";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useForumQuestions } from "@context/ForumQuestionsContext";
import { editForumQuestion, fetchForumQuestionFull } from "@services/ForumService";
import { colors } from "@theme/colors";
import { useAttachments } from "@hooks/useAttachments";
import { AttachmentList } from "@components/AttachmentList";
import { forumStyles } from "@styles/forumStyles";
import { ForumAttachment } from "@src/types/forum";
import { getNameWithExtension } from "@utils/fileUtils";

// Utilidad para extraer el key de S3 de una URL firmada
function getS3KeyFromUrl(url: string) {
  if (url.startsWith("http")) {
    const path = url.split(".com/")[1] || url;
    return path.split("?")[0];
  }
  return url.split("?")[0];
}

const MAX_ATTACHMENTS = 5;

export default function EditForumQuestionScreen() {
  const router = useRouter();
  const { id: courseId, questionId } = useLocalSearchParams<{ id: string; questionId: string }>();
  const { questions, setQuestions } = useForumQuestions();

  const question = questions.find((q) => String(q.id) === String(questionId));
  const [title, setTitle] = useState(question?.title || "");
  const [description, setDescription] = useState(question?.description || "");

  // Inicializar adjuntos existentes
  const initialAttachments = Array.isArray(question?.attachments)
    ? question.attachments.map((att: ForumAttachment, idx: number) => ({
        uri: att.url,
        mimeType: att.mimeType,
        name: getNameWithExtension(att, idx),
        isExisting: true,
      }))
    : [];

  const {
    attachments,
    setAttachments,
    handlePickAttachment,
    handleRemoveAttachment,
    handlePreviewAttachment,
    modalImageUri,
    setModalImageUri,
  } = useAttachments(initialAttachments);

  const [saving, setSaving] = useState(false);

  if (!question) {
    return (
      <View style={forumStyles.centered}>
        <Text style={{ color: colors.error, fontSize: 20 }}>Question not found.</Text>
      </View>
    );
  }

  // Limitar la cantidad de archivos adjuntos
  const handleAddAttachment = async () => {
    if (attachments.length >= MAX_ATTACHMENTS) {
      Alert.alert("Límite alcanzado", `Solo puedes adjuntar hasta ${MAX_ATTACHMENTS} archivos.`);
      return;
    }
    await handlePickAttachment();
  };

  const handleSave = async () => {
    if (!title.trim() || !description.trim()) {
      Alert.alert("Error", "Title and description are required.");
      return;
    }
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("courseId", courseId as string);
      formData.append("title", title);
      formData.append("description", description);

      // Adjuntos nuevos (no existentes)
      attachments.forEach((file, idx) => {
        if (!file.isExisting) {
          formData.append("attachments", {
            uri: file.uri,
            name: file.name || `file_${idx}`,
            type: file.mimeType || "application/octet-stream",
          } as any);
        }
      });

      // Adjuntos existentes: enviar los keys en existingAttachments
      const existingKeys = attachments
        .filter((file) => file.isExisting)
        .map((file) => getS3KeyFromUrl(file.uri));
      formData.append("existingAttachments", JSON.stringify(existingKeys));

      await editForumQuestion(String(questionId), formData);

      const updated = await fetchForumQuestionFull(String(questionId));
      setQuestions((prev) =>
        prev.map((q) =>
          q.id === question.id ? updated : q
        )
      );

      Alert.alert("Success", "Question updated!");
      router.back();
    } catch (e: any) {
      Alert.alert("Error", e?.message || "Could not update question");
    } finally {
      setSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
    >
      <ScrollView contentContainerStyle={forumStyles.container}>
        <Text style={[forumStyles.header, { color: colors.secondary }]}>Edit Question</Text>
        <TextInput
          label="Title"
          value={title}
          onChangeText={setTitle}
          mode="outlined"
          style={[
            forumStyles.input,
            { backgroundColor: colors.inputBackground, color: colors.text },
          ]}
          theme={{ colors: { primary: colors.primary, text: colors.text } }}
        />
        <TextInput
          label="Description"
          value={description}
          onChangeText={setDescription}
          mode="outlined"
          multiline
          style={[
            forumStyles.input,
            { minHeight: 100, backgroundColor: colors.inputBackground, color: colors.text },
          ]}
          theme={{ colors: { primary: colors.primary, text: colors.text } }}
        />
        <Button
          icon="attachment"
          mode="outlined"
          onPress={handleAddAttachment}
          style={{ marginBottom: 10, borderColor: colors.primary }}
          textColor={colors.primary}
          disabled={attachments.length >= MAX_ATTACHMENTS}
        >
          Add Attachment ({attachments.length}/{MAX_ATTACHMENTS})
        </Button>
        <AttachmentList
          attachments={attachments}
          onRemove={handleRemoveAttachment}
          onPreview={handlePreviewAttachment}
          modalImageUri={modalImageUri}
          setModalImageUri={setModalImageUri}
          iconSize={100}
        />
        <Button
          mode="contained"
          onPress={handleSave}
          loading={saving}
          disabled={saving}
          style={[forumStyles.button, { backgroundColor: colors.primary }]}
        >
          Save
        </Button>
        <Button
          mode="text"
          onPress={() => router.back()}
          style={forumStyles.button}
          textColor={colors.secondary}
        >
          Cancel
        </Button>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}