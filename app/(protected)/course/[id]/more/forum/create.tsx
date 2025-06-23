import React, { useState, useEffect } from "react";
import { View, ScrollView, Alert, KeyboardAvoidingView, Platform, TouchableOpacity, StyleSheet } from "react-native";
import { Button, TextInput, Chip, Text } from "react-native-paper";
import { useRouter, useLocalSearchParams } from "expo-router";
import { colors } from "@theme/colors";
import { createForumQuestion, fetchForumQuestions, fetchForumTags, ForumTagResponse } from "@services/ForumService";
import { useForumQuestions } from "@context/ForumQuestionsContext";
import { useAttachments } from "@hooks/useAttachments";
import { AttachmentList } from "@components/AttachmentList";
import { getNameWithExtension } from "@utils/fileUtils";
import { MaterialIcons } from "@expo/vector-icons";

const MAX_TAGS = 5;
const MAX_TAG_LENGTH = 15;
const MAX_ATTACHMENTS = 5;

export default function CreateForumQuestion() {
  const router = useRouter();
  const { id: courseId } = useLocalSearchParams<{ id: string }>();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const { setQuestions } = useForumQuestions();

  // Tags from API
  const [availableTags, setAvailableTags] = useState<ForumTagResponse[]>([]);
  const [loadingTags, setLoadingTags] = useState(false);

  // Campo para nuevo tag
  const [newTag, setNewTag] = useState("");
  const [newTagError, setNewTagError] = useState<string | null>(null);

  // Field errors
  const [titleError, setTitleError] = useState<string | null>(null);
  const [descriptionError, setDescriptionError] = useState<string | null>(null);
  const [attachmentsError, setAttachmentsError] = useState<string | null>(null);

  // Adjuntos (igual que en editar)
  const {
    attachments,
    setAttachments,
    handlePickAttachment,
    handleRemoveAttachment,
    handlePreviewAttachment,
    modalImageUri,
    setModalImageUri,
  } = useAttachments([]);

  // Load tags from API
  useEffect(() => {
    const loadTags = async () => {
      setLoadingTags(true);
      try {
        const tagList = await fetchForumTags(String(courseId));
        setAvailableTags(tagList);
      } catch {
        setAvailableTags([]);
      } finally {
        setLoadingTags(false);
      }
    };
    loadTags();
  }, [courseId]);

  // Selección de tags existentes
  const toggleTag = (tag: string) => {
    setTags((prev) => {
      if (prev.includes(tag)) {
        return prev.filter((t) => t !== tag);
      } else if (prev.length < MAX_TAGS) {
        return Array.from(new Set([...prev, tag]));
      }
      return prev;
    });
  };

  // Validaciones para nuevo tag
  const handleAddNewTag = () => {
    const trimmed = newTag.trim();
    if (!trimmed) {
      setNewTagError("Tag cannot be empty.");
      return;
    }
    if (trimmed.length > MAX_TAG_LENGTH) {
      setNewTagError(`Tag must be ${MAX_TAG_LENGTH} characters or less.`);
      return;
    }
    if (tags.includes(trimmed)) {
      setNewTagError("Tag already added.");
      return;
    }
    if (
      availableTags.some(
        (t) => t.name.toLowerCase() === trimmed.toLowerCase()
      ) &&
      tags.includes(
        availableTags.find(
          (t) => t.name.toLowerCase() === trimmed.toLowerCase()
        )!.name
      )
    ) {
      setNewTagError("Tag already added.");
      return;
    }
    if (tags.length >= MAX_TAGS) {
      setNewTagError(`You can select up to ${MAX_TAGS} tags.`);
      return;
    }
    setTags((prev) => [...prev, trimmed]);
    setNewTag("");
    setNewTagError(null);
  };

  // Validations for title and description
  useEffect(() => {
    if (title.length > 100) setTitleError("Title must be 100 characters or less.");
    else if (title.length === 0) setTitleError("Title is required.");
    else setTitleError(null);
  }, [title]);

  useEffect(() => {
    if (description.length > 500) setDescriptionError("Description must be 500 characters or less.");
    else if (description.length === 0) setDescriptionError("Description is required.");
    else setDescriptionError(null);
  }, [description]);

  useEffect(() => {
    if (attachments.length > MAX_ATTACHMENTS) setAttachmentsError(`You can attach up to ${MAX_ATTACHMENTS} files.`);
    else setAttachmentsError(null);
  }, [attachments]);

  // Limitar la cantidad de archivos adjuntos
  const handleAddAttachment = async () => {
    if (attachments.length >= MAX_ATTACHMENTS) {
      setAttachmentsError(`You can attach up to ${MAX_ATTACHMENTS} files.`);
      Alert.alert("Limit reached", `You can only attach up to ${MAX_ATTACHMENTS} files.`);
      return;
    }
    await handlePickAttachment();
  };

  const handleSubmit = async () => {
    if (title.length === 0 || title.length > 100) {
      setTitleError("Title must be between 1 and 100 characters.");
      return;
    }
    if (description.length === 0 || description.length > 500) {
      setDescriptionError("Description must be between 1 and 500 characters.");
      return;
    }
    if (tags.length === 0) {
      Alert.alert("Error", "Please select at least one tag.");
      return;
    }
    if (attachments.length > MAX_ATTACHMENTS) {
      setAttachmentsError(`You can attach up to ${MAX_ATTACHMENTS} files.`);
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("courseId", courseId as string);
      formData.append("title", title);
      formData.append("description", description);
      tags.forEach((tag) => formData.append("tags", tag));
      // Adjuntos nuevos (todos son nuevos en crear)
      attachments.forEach((file, idx) => {
        formData.append("attachments", {
          uri: file.uri,
          name: file.name || `file_${idx}`,
          type: file.mimeType || "application/octet-stream",
        } as any);
      });

      await createForumQuestion(formData);

      const data = await fetchForumQuestions(String(courseId), 0, 10, {});
      setQuestions(data.questions);

      Alert.alert("Success", "Question created!");
      router.replace(`/(protected)/course/${courseId}/more/forum`);
    } catch (e: any) {
      Alert.alert("Error", e?.message || "Unexpected error");
    } finally {
      setLoading(false);
    }
  };

  const showNoTags = !loadingTags && availableTags.length === 0;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
    >
      <ScrollView
        contentContainerStyle={{
          padding: 20,
          backgroundColor: colors.background,
          flexGrow: 1,
        }}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={{ fontWeight: "bold", fontSize: 22, color: colors.primary, marginBottom: 20 }}>
          New Question
        </Text>
        <TextInput
          label="Title"
          value={title}
          onChangeText={setTitle}
          mode="outlined"
          style={{
            marginBottom: 8,
            backgroundColor: colors.inputBackground,
            fontSize: 17,
          }}
          theme={{
            colors: {
              background: colors.inputBackground,
              primary: colors.primary,
              text: colors.text,
              placeholder: colors.textMuted,
            },
          }}
          maxLength={100}
          error={!!titleError}
        />
        {titleError && (
          <Text style={{ color: colors.error, marginBottom: 8, marginLeft: 4 }}>{titleError}</Text>
        )}
        <TextInput
          label="Description"
          value={description}
          onChangeText={setDescription}
          mode="outlined"
          multiline
          style={{
            marginBottom: 8,
            backgroundColor: colors.inputBackground,
            minHeight: 90,
            fontSize: 16,
          }}
          theme={{
            colors: {
              background: colors.inputBackground,
              primary: colors.primary,
              text: colors.text,
              placeholder: colors.textMuted,
            },
          }}
          maxLength={500}
          error={!!descriptionError}
        />
        {descriptionError && (
          <Text style={{ color: colors.error, marginBottom: 8, marginLeft: 4 }}>{descriptionError}</Text>
        )}
        <Text style={{ marginBottom: 8, fontWeight: "bold", color: colors.primary, fontSize: 16 }}>
          Tags <Text style={{ color: colors.textMuted, fontWeight: "normal", fontSize: 13 }}>{`(max ${MAX_TAGS})`}</Text>
        </Text>
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            marginBottom: 14,
            minHeight: 44,
            alignItems: "flex-start",
            gap: 8,
          }}
        >
          {loadingTags ? (
            <Text style={{ color: colors.textMuted }}>Loading tags...</Text>
          ) : (
            <>
              {availableTags.length > 0 &&
                availableTags.map((tag) => (
                  <Chip
                    key={tag.id}
                    selected={tags.includes(tag.name)}
                    onPress={() => toggleTag(tag.name)}
                    style={{
                      marginRight: 8,
                      marginBottom: 8,
                      backgroundColor: tags.includes(tag.name) ? colors.primary : colors.inputBackground,
                      borderColor: tags.includes(tag.name) ? colors.primary : colors.textMuted,
                      borderWidth: 1,
                      alignSelf: "flex-start",
                      minHeight: 36,
                      paddingHorizontal: 12,
                    }}
                    textStyle={{
                      color: tags.includes(tag.name) ? colors.buttonText : colors.text,
                      fontWeight: "bold",
                      fontSize: 15,
                    }}
                  >
                    <Text
                      style={{
                        color: tags.includes(tag.name) ? colors.buttonText : colors.text,
                        fontWeight: "bold",
                        fontSize: 15,
                      }}
                    >
                      {tag.name}
                    </Text>
                  </Chip>
                ))}
              {showNoTags && (
                <Text style={{ color: colors.textMuted, marginTop: 6 }}>No tags found.</Text>
              )}
            </>
          )}
        </View>
        {/* Campo para crear nuevo tag */}
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
          <TextInput
            label="Create new tag"
            value={newTag}
            onChangeText={(text) => {
              setNewTag(text);
              setNewTagError(null);
            }}
            mode="outlined"
            style={{
              flex: 1,
              backgroundColor: colors.inputBackground,
              fontSize: 15,
              marginRight: 8,
            }}
            theme={{
              colors: {
                background: colors.inputBackground,
                primary: colors.primary,
                text: colors.text,
                placeholder: colors.textMuted,
              },
            }}
            maxLength={MAX_TAG_LENGTH}
            error={!!newTagError}
            onSubmitEditing={handleAddNewTag}
            returnKeyType="done"
            placeholder="Add custom tag"
          />
          <Button
            mode="contained"
            onPress={handleAddNewTag}
            buttonColor={colors.primary}
            style={{ borderRadius: 8, height: 44, justifyContent: "center" }}
            labelStyle={{ color: colors.buttonText, fontWeight: "bold" }}
            disabled={tags.length >= MAX_TAGS}
          >
            Add
          </Button>
        </View>
        {newTagError && (
          <Text style={{ color: colors.error, marginBottom: 8, marginLeft: 4 }}>{newTagError}</Text>
        )}
        <View style={styles.tagsSelectedContainer}>
          {tags.map((tag, idx) => (
            <View key={tag + idx} style={styles.tag}>
              <Text style={styles.tagText} numberOfLines={1} ellipsizeMode="tail">
                {tag}
              </Text>
              <TouchableOpacity
                onPress={() => setTags((prev) => prev.filter((t) => t !== tag))}
                style={styles.closeBtn}
              >
                <MaterialIcons name="close" size={16} color="#fff" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
        <Text style={{ marginBottom: 8, fontWeight: "bold", color: colors.primary, fontSize: 16 }}>
          Attachments <Text style={{ color: colors.textMuted, fontWeight: "normal", fontSize: 13 }}>
            ({attachments.length}/{MAX_ATTACHMENTS})
          </Text>
        </Text>
        {/* --- Adjuntos igual que en editar --- */}
        <Button
          icon="attachment"
          mode="outlined"
          onPress={handleAddAttachment}
          style={{
            borderRadius: 8,
            borderColor: colors.primary,
            borderWidth: 1,
            marginBottom: 10,
            height: 40,
            justifyContent: "center",
            alignSelf: "flex-start",
          }}
          labelStyle={{ color: colors.primary, fontWeight: "bold" }}
          disabled={attachments.length >= MAX_ATTACHMENTS}
        >
          Add file
        </Button>
        <AttachmentList
          attachments={attachments}
          onRemove={handleRemoveAttachment}
          onPreview={handlePreviewAttachment}
          modalImageUri={modalImageUri}
          setModalImageUri={setModalImageUri}
          iconSize={100}
        />
        {attachmentsError && (
          <Text style={{ color: colors.error, marginBottom: 8, marginLeft: 4 }}>{attachmentsError}</Text>
        )}
        <Button
          mode="contained"
          onPress={handleSubmit}
          buttonColor={colors.primary}
          loading={loading}
          disabled={
            !title ||
            !description ||
            tags.length === 0 ||
            loading ||
            !!titleError ||
            !!descriptionError ||
            !!attachmentsError
          }
          style={{
            borderRadius: 12,
            paddingVertical: 10,
            marginTop: 10,
          }}
          labelStyle={{ fontWeight: "bold", fontSize: 17, color: colors.buttonText }}
        >
          Post Question
        </Button>
        <Text style={{ color: colors.textMuted, marginTop: 10, fontSize: 13 }}>
          You can select up to 5 tags. Title: 1-100 chars. Description: 1-500 chars. Max 5 attachments.
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  tagsSelectedContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 10,
    gap: 8,
    minHeight: 36,
  },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 8,
    marginBottom: 8,
    maxWidth: 180,
  },
  tagText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
    marginRight: 4,
    flexShrink: 1,
    maxWidth: 120,
  },
  closeBtn: {
    marginLeft: 2,
    backgroundColor: colors.secondary,
    borderRadius: 10,
    padding: 2,
    alignItems: "center",
    justifyContent: "center",
  },
});