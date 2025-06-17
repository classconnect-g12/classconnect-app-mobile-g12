import React, { useState, useEffect } from "react";
import { View, Alert, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { Text, TextInput, Button } from "react-native-paper";
import { useLocalSearchParams, useRouter } from "expo-router";
import { fetchForumAnswers, editForumAnswer } from "@services/ForumService";
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

export default function EditForumAnswerScreen() {
  const router = useRouter();
  const { id: courseId, questionId, answerId } = useLocalSearchParams<{
    id: string;
    questionId: string;
    answerId: string;
  }>();

  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Inicializar adjuntos existentes
  const [initialAttachments, setInitialAttachments] = useState<any[]>([]);
  const {
    attachments,
    setAttachments,
    handlePickAttachment,
    handleRemoveAttachment,
    handlePreviewAttachment,
    modalImageUri,
    setModalImageUri,
  } = useAttachments(initialAttachments);

  useEffect(() => {
    const loadAnswer = async () => {
      try {
        const data = await fetchForumAnswers(String(courseId), String(questionId), 0, 50);
        const answer = data.answers.find((a) => String(a.id) === String(answerId));
        if (answer) {
          setText(answer.text);
          const mapped = Array.isArray(answer.attachments)
            ? answer.attachments.map((att: ForumAttachment, idx: number) => ({
                uri: att.url,
                name: getNameWithExtension(att, idx),
                mimeType: att.mimeType,
                isExisting: true,
              }))
            : [];
          setInitialAttachments(mapped);
          setAttachments(mapped);
        }
      } catch (e) {
        Alert.alert("Error", "Could not load answer");
      } finally {
        setLoading(false);
      }
    };
    loadAnswer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId, questionId, answerId]);

  // Limitar la cantidad de archivos adjuntos
  const handleAddAttachment = async () => {
    if (attachments.length >= MAX_ATTACHMENTS) {
      Alert.alert("Límite alcanzado", `Solo puedes adjuntar hasta ${MAX_ATTACHMENTS} archivos.`);
      return;
    }
    await handlePickAttachment();
  };

  const handleSave = async () => {
    if (!text.trim()) {
      Alert.alert("Error", "Answer text is required.");
      return;
    }
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("courseId", courseId as string);
      formData.append("text", text);

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

      await editForumAnswer(String(answerId), formData);

      Alert.alert("Success", "Answer updated!");
      router.back();
    } catch (e: any) {
      Alert.alert("Error", e?.message || "Could not update answer");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={forumStyles.centered}>
        <Text style={{ color: colors.primary }}>Loading...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
    >
      <ScrollView contentContainerStyle={forumStyles.container}>
        <Text style={[forumStyles.header, { color: "black" }]}>Edit Answer</Text>
        <TextInput
          label="Answer"
          value={text}
          onChangeText={setText}
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
          style={[forumStyles.button, { backgroundColor: colors.primary, borderRadius: 6 }]}
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