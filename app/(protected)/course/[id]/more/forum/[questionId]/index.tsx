import React, { useEffect, useState, useRef } from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  Linking,
} from "react-native";
import {
  Text,
  Button,
  TextInput,
  IconButton,
} from "react-native-paper";
import { useLocalSearchParams, useRouter } from "expo-router";
import { colors } from "@theme/colors";
import {
  fetchForumAnswers,
  upvoteForumQuestion,
  downvoteForumQuestion,
  upvoteForumAnswer,
  downvoteForumAnswer,
  acceptForumAnswer,
  createForumAnswer,
  deleteForumQuestion,
  deleteForumAnswer,
  ForumAttachment,
  fetchForumQuestionFull
} from "@services/ForumService";
import { useForumQuestions } from "@context/ForumQuestionsContext";
import { useCourse } from "@context/CourseContext";
import { useAuth } from "@context/authContext";
import {
  FORUM_DELETE_QUESTION,
  FORUM_EDIT_QUESTION,
  FORUM_EDIT_ANSWER,
  FORUM_DELETE_ANSWER,
} from "@constants/permissions";
import * as DocumentPicker from "expo-document-picker";
import * as WebBrowser from "expo-web-browser";
import ImageViewing from "react-native-image-viewing";
import { getFileTypeLabel, getFileIcon, getFileExtension } from "@utils/fileUtils";
import { ALLOWED_MIME_TYPES, ALLOWED_EXTENSIONS } from "@constants/fileTypes";
import { ForumQuestionWithProfile, ForumAnswerResponse, UserProfileResponse } from "@src/types/forum";
import { ForumHeader } from "@components/ForumHeader";
import { AnswerItem } from "@components/AnswerItem";
import { AttachmentPreview } from "@components/AttachmentPreview";

type ForumAnswerWithProfile = ForumAnswerResponse & {
  authorProfile: UserProfileResponse;
};

const PAGE_SIZE = 10;
const MAX_ATTACHMENTS = 5;

function hasAcceptedAnswer(acceptedAnswerId?: string | null) {
  return (
    acceptedAnswerId &&
    acceptedAnswerId !== "00000000-0000-0000-0000-000000000000"
  );
}

async function openFile(url: string) {
  try {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      await WebBrowser.openBrowserAsync(url);
    }
  } catch {
    await WebBrowser.openBrowserAsync(url);
  }
}

function validateFiles(files: any[]): string | null {
  for (const file of files) {
    const ext = getFileExtension(file.name);
    if (
      !ALLOWED_MIME_TYPES.includes(file.mimeType) &&
      !ALLOWED_EXTENSIONS.includes(ext)
    ) {
      return `El archivo "${file.name}" no es un tipo permitido.`;
    }
  }
  return null;
}

// Utilidad para extraer el key de S3 de una URL firmada
function getS3KeyFromUrl(url: string) {
  if (url.startsWith("http")) {
    const path = url.split(".com/")[1] || url;
    return path.split("?")[0];
  }
  return url.split("?")[0];
}

export default function ForumQuestionDetailScreen() {
  const router = useRouter();
  const { id: courseId, questionId } = useLocalSearchParams<{
    id: string;
    questionId: string;
  }>();
  const { setQuestions } = useForumQuestions();
  const [answers, setAnswers] = useState<ForumAnswerWithProfile[]>([]);
  const [loadingAnswers, setLoadingAnswers] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const { courseDetail } = useCourse();
  const { userId } = useAuth();
  const course = courseDetail?.course;

  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const isFetchingMore = useRef(false);

  const [answerText, setAnswerText] = useState("");
  const [answerAttachments, setAnswerAttachments] = useState<any[]>([]);
  const [postingAnswer, setPostingAnswer] = useState(false);

  const [imageViewerVisible, setImageViewerVisible] = useState(false);
  const [imageViewerImages, setImageViewerImages] = useState<{ uri: string }[]>([]);
  const [imageViewerIndex, setImageViewerIndex] = useState(0);

  const [answerMenuVisible, setAnswerMenuVisible] = useState<string | null>(null);

  const answerInputRef = useRef<any>(null);

  const [questionVote, setQuestionVote] = useState<number | null>(null);
  const [answerVotes, setAnswerVotes] = useState<{ [id: string]: number | null }>({});

  const [showAnswerInput, setShowAnswerInput] = useState(false);

  const [question, setQuestion] = useState<ForumQuestionWithProfile | null>(null);
  const [loadingQuestion, setLoadingQuestion] = useState(true);

  const loadQuestion = async () => {
    setLoadingQuestion(true);
    try {
      const data = await fetchForumQuestionFull(String(questionId));
      setQuestion(data);
      setQuestions((prev) =>
        prev.map((q) => (String(q.id) === String(questionId) ? data : q))
      );
    } catch {
      setQuestion(null);
    } finally {
      setLoadingQuestion(false);
    }
  };

  useEffect(() => {
    loadQuestion();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questionId]);

  useEffect(() => {
    setQuestionVote(question?.userVote ?? null);
  }, [question]);

  useEffect(() => {
    if (answers.length > 0) {
      const votes: { [id: string]: number | null } = {};
      answers.forEach((a) => {
        votes[a.id] = a.userVote ?? null;
      });
      setAnswerVotes(votes);
    }
  }, [answers]);

  const fetchAnswersHandler = async ({
    reset = false,
    pageToFetch = 0,
    append = false,
  }: {
    reset?: boolean;
    pageToFetch?: number;
    append?: boolean;
  }) => {
    if (!courseId || !questionId) return;
    if (isFetchingMore.current) return;
    if (append) isFetchingMore.current = true;

    try {
      if (reset) setLoadingAnswers(true);
      else if (append) setLoadingMore(true);

      const data = await fetchForumAnswers(
        String(courseId),
        String(questionId),
        pageToFetch,
        PAGE_SIZE
      );

      if (reset) {
        setAnswers(data.answers as ForumAnswerWithProfile[]);
        setHasMore((data.answers.length || 0) === PAGE_SIZE);
        setPage(pageToFetch);
      } else if (append) {
        if (data.answers.length > 0) {
          setAnswers((prev) => {
            const existingIds = new Set(prev.map((a) => a.id));
            const newAnswers = (data.answers as ForumAnswerWithProfile[]).filter(
              (a) => !existingIds.has(a.id)
            );
            return [...prev, ...newAnswers];
          });
          setPage(pageToFetch);
        }
        setHasMore((data.answers.length || 0) === PAGE_SIZE);
      }
    } catch (e: any) {
      if (reset) setAnswers([]);
      Alert.alert("Error", e?.message || "Could not load answers");
    } finally {
      setLoadingAnswers(false);
      setLoadingMore(false);
      isFetchingMore.current = false;
    }
  };

  useEffect(() => {
    fetchAnswersHandler({ reset: true, pageToFetch: 0 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId, questionId]);

  const handleLoadMore = () => {
    if (
      !loadingMore &&
      !loadingAnswers &&
      hasMore
    ) {
      fetchAnswersHandler({
        append: true,
        pageToFetch: page + 1,
      });
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadQuestion();
    await fetchAnswersHandler({ reset: true, pageToFetch: 0 });
    setRefreshing(false);
  };

  if (loadingQuestion) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!question) {
    return (
      <View style={styles.centered}>
        <Text style={{ color: colors.error, fontSize: 22 }}>Question not found.</Text>
      </View>
    );
  }

  const acceptedAnswerId = question.acceptedAnswerId;
  const hasAccepted = hasAcceptedAnswer(acceptedAnswerId);

  const isAuthor = question.authorProfile?.id === Number(userId);
  const canEdit =
    (isAuthor || (course?.permissions || []).includes(FORUM_EDIT_QUESTION)) &&
    !hasAccepted;

  const canDelete =
    isAuthor || (course?.permissions || []).includes(FORUM_DELETE_QUESTION);

  const canEditAnswer = (answer: ForumAnswerWithProfile) =>
    (answer.authorProfile?.id === Number(userId) ||
      (course?.permissions || []).includes(FORUM_EDIT_ANSWER)) &&
    !(acceptedAnswerId && answer.id === acceptedAnswerId);

  const canDeleteAnswer = (answer: ForumAnswerWithProfile) =>
    answer.authorProfile?.id === Number(userId) ||
    (course?.permissions || []).includes(FORUM_DELETE_ANSWER);

  const handleEdit = () => {
    setMenuVisible(false);
    router.push(
      `/(protected)/course/${courseId}/more/forum/${questionId}/edit`
    );
  };

  const handleDelete = () => {
    setMenuVisible(false);
    Alert.alert("Delete Question", "Are you sure you want to delete this question?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteForumQuestion(String(questionId));
            setQuestions((prev) => prev.filter((q) => String(q.id) !== String(questionId)));
            router.back();
          } catch (e: any) {
            Alert.alert("Error", e?.message || "Could not delete question");
          }
        },
      },
    ]);
  };

  const handleEditAnswer = (answerId: string) => {
    setAnswerMenuVisible(null);
    router.push(
      `/(protected)/course/${courseId}/more/forum/${questionId}/editAnswer/${answerId}`
    );
  };

  const handleDeleteAnswer = (answerId: string) => {
    setAnswerMenuVisible(null);
    Alert.alert(
      "Delete Answer",
      "Are you sure you want to delete this answer?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteForumAnswer(String(answerId));
              setAnswers((prev) => prev.filter((a) => a.id !== answerId));
            } catch (e: any) {
              Alert.alert("Error", e?.message || "Could not delete answer");
            }
          },
        },
      ]
    );
  };

  const handlePickAnswerAttachment = async () => {
    if (answerAttachments.length >= MAX_ATTACHMENTS) {
      Alert.alert("Límite alcanzado", `Solo puedes adjuntar hasta ${MAX_ATTACHMENTS} archivos.`);
      return;
    }
    const result = await DocumentPicker.getDocumentAsync({
      type: "*/*",
      multiple: true,
    });
    if (!result.canceled && result.assets) {
      // Limitar la cantidad de archivos adjuntos
      const total = answerAttachments.length + result.assets.length;
      if (total > MAX_ATTACHMENTS) {
        Alert.alert(
          "Límite alcanzado",
          `Solo puedes adjuntar hasta ${MAX_ATTACHMENTS} archivos.`
        );
        return;
      }
      const error = validateFiles(result.assets);
      if (error) {
        Alert.alert("Archivo no permitido", error);
        return;
      }
      setAnswerAttachments((prev) => [...prev, ...result.assets]);
    }
  };

  const handleRemoveAnswerAttachment = (uri: string) => {
    setAnswerAttachments((prev) => prev.filter((a) => a.uri !== uri));
  };

  const openImageViewer = (images: string[], index: number) => {
    setImageViewerImages(images.map(uri => ({ uri })));
    setImageViewerIndex(index);
    setImageViewerVisible(true);
  };

  // Tamaño grande para adjuntos en preguntas y respuestas
  const bigAttachmentSize = { width: 140, height: 140 };
  // Tamaño chico para adjuntos en el input
  const smallAttachmentSize = { width: 100, height: 100 };

  const renderAttachment = (
    att: ForumAttachment,
    idx: number,
    attachments: ForumAttachment[]
  ) => {
    const { url, mimeType } = att;
    if (mimeType.startsWith("image/")) {
      const images = attachments.filter(a => a.mimeType.startsWith("image/")).map(a => a.url);
      return (
        <AttachmentPreview
          key={`${url}-${idx}`}
          file={{ ...att, uri: url }}
          idx={idx}
          files={attachments}
          openImageViewer={openImageViewer}
          size={bigAttachmentSize}
        />
      );
    }
    if (mimeType.startsWith("video/")) {
      return (
        <AttachmentPreview
          key={`${url}-${idx}`}
          file={{ ...att, uri: url }}
          idx={idx}
          files={attachments}
          size={bigAttachmentSize}
        />
      );
    }
    return (
      <AttachmentPreview
        key={`${url}-${idx}`}
        file={{ ...att, uri: url }}
        idx={idx}
        files={attachments}
        openImageViewer={(images: string[], index: number) => {
          if (images && images[index]) {
            openFile(images[index]);
          }
        }}
        size={bigAttachmentSize}
      />
    );
  };

  const renderPreviewAttachment = (file: any, idx: number, files: any[]) => (
    <AttachmentPreview
      key={file.uri}
      file={file}
      idx={idx}
      files={files}
      onRemove={handleRemoveAnswerAttachment}
      openImageViewer={openImageViewer}
      size={smallAttachmentSize}
    />
  );

  const handlePostAnswer = async () => {
    if (!answerText.trim()) {
      Alert.alert("Error", "Answer text is required.");
      return;
    }
    setPostingAnswer(true);
    try {
      const formData = new FormData();
      formData.append("courseId", courseId as string);
      formData.append("questionId", questionId as string);
      formData.append("text", answerText);

      // Adjuntos nuevos (no existentes)
      answerAttachments.forEach((file, idx) => {
        if (!file.isExisting) {
          formData.append("attachments", {
            uri: file.uri,
            name: file.name || `file_${idx}`,
            type: file.mimeType || "application/octet-stream",
          } as any);
        }
      });

      // Adjuntos existentes: enviar los keys en existingAttachments
      const existingKeys = answerAttachments
        .filter((file) => file.isExisting)
        .map((file) => getS3KeyFromUrl(file.uri));
      formData.append("existingAttachments", JSON.stringify(existingKeys));

      await createForumAnswer(formData);

      await fetchAnswersHandler({ reset: true, pageToFetch: 0 });

      setAnswerText("");
      setAnswerAttachments([]);
      Keyboard.dismiss();
      setShowAnswerInput(false);
      Alert.alert("Success", "Answer posted!");
      await loadQuestion();
    } catch (e: any) {
      Alert.alert("Error", e?.message || "Could not post answer");
    } finally {
      setPostingAnswer(false);
    }
  };

  const handleUpvoteQuestion = async () => {
    setQuestionVote((prev) => (prev === 1 ? null : 1));
    setQuestion((prev) =>
      prev
        ? {
            ...prev,
            upvotes:
              questionVote === 1
                ? prev.upvotes - 1
                : questionVote === -1
                ? prev.upvotes + 1
                : prev.upvotes + 1,
            downvotes: questionVote === -1 ? prev.downvotes - 1 : prev.downvotes,
            userVote: questionVote === 1 ? null : 1,
          }
        : prev
    );
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === question?.id
          ? {
              ...q,
              upvotes:
                questionVote === 1
                  ? q.upvotes - 1
                  : questionVote === -1
                  ? q.upvotes + 1
                  : q.upvotes + 1,
              downvotes: questionVote === -1 ? q.downvotes - 1 : q.downvotes,
              userVote: questionVote === 1 ? null : 1,
            }
          : q
      )
    );
    try {
      await upvoteForumQuestion(question!.id);
    } catch (e) {}
  };

  const handleDownvoteQuestion = async () => {
    setQuestionVote((prev) => (prev === -1 ? null : -1));
    setQuestion((prev) =>
      prev
        ? {
            ...prev,
            downvotes:
              questionVote === -1
                ? prev.downvotes - 1
                : questionVote === 1
                ? prev.downvotes + 1
                : prev.downvotes + 1,
            upvotes: questionVote === 1 ? prev.upvotes - 1 : prev.upvotes,
            userVote: questionVote === -1 ? null : -1,
          }
        : prev
    );
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === question?.id
          ? {
              ...q,
              downvotes:
                questionVote === -1
                  ? q.downvotes - 1
                  : questionVote === 1
                  ? q.downvotes + 1
                  : q.downvotes + 1,
              upvotes: questionVote === 1 ? q.upvotes - 1 : q.upvotes,
              userVote: questionVote === -1 ? null : -1,
            }
          : q
      )
    );
    try {
      await downvoteForumQuestion(question!.id);
    } catch (e) {}
  };

  const handleUpvoteAnswer = async (answerId: string) => {
    setAnswerVotes((prev) => {
      const prevVote = prev[answerId];
      return { ...prev, [answerId]: prevVote === 1 ? null : 1 };
    });
    setAnswers((prev) =>
      prev.map((a) =>
        a.id === answerId
          ? {
              ...a,
              upvotes:
                a.userVote === 1
                  ? a.upvotes - 1
                  : a.userVote === -1
                  ? a.upvotes + 1
                  : a.upvotes + 1,
              downvotes: a.userVote === -1 ? a.downvotes - 1 : a.downvotes,
              userVote: a.userVote === 1 ? null : 1,
            }
          : a
      )
    );
    try {
      await upvoteForumAnswer(answerId);
    } catch (e) {}
  };

  const handleDownvoteAnswer = async (answerId: string) => {
    setAnswerVotes((prev) => {
      const prevVote = prev[answerId];
      return { ...prev, [answerId]: prevVote === -1 ? null : -1 };
    });
    setAnswers((prev) =>
      prev.map((a) =>
        a.id === answerId
          ? {
              ...a,
              downvotes:
                a.userVote === -1
                  ? a.downvotes - 1
                  : a.userVote === 1
                  ? a.downvotes + 1
                  : a.downvotes + 1,
              upvotes: a.userVote === 1 ? a.upvotes - 1 : a.upvotes,
              userVote: a.userVote === -1 ? null : -1,
            }
          : a
      )
    );
    try {
      await downvoteForumAnswer(answerId);
    } catch (e) {}
  };

  const handleAcceptAnswer = async (answerId: string) => {
    Alert.alert(
      "Accept answer",
      "Are you sure you want to accept this answer? This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Accept",
          style: "default",
          onPress: async () => {
            try {
              await acceptForumAnswer(String(questionId), answerId);
              setAnswers((prev) =>
                prev.map((a) =>
                  a.id === answerId ? { ...a, accepted: true } : { ...a, accepted: false }
                )
              );
              Alert.alert("Success", "Answer marked as accepted!");
              await loadQuestion();
            } catch (e) {
              Alert.alert("Error", "Could not accept answer");
            }
          },
        },
      ]
    );
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === "ios" ? undefined : undefined}
      keyboardVerticalOffset={0}
    >
      <FlatList
        data={answers}
        renderItem={({ item }) => (
          <AnswerItem
            answer={item}
            isAuthor={isAuthor}
            canEdit={canEditAnswer(item)}
            canDelete={canDeleteAnswer(item)}
            menuVisible={answerMenuVisible === item.id}
            setMenuVisible={setAnswerMenuVisible}
            onEdit={handleEditAnswer}
            onDelete={handleDeleteAnswer}
            onAccept={handleAcceptAnswer}
            onUpvote={handleUpvoteAnswer}
            onDownvote={handleDownvoteAnswer}
            vote={answerVotes[item.id]}
            accepted={item.accepted}
            answers={answers}
            renderAttachment={renderAttachment}
          />
        )}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <>
            <ForumHeader
              question={question}
              canEdit={canEdit}
              canDelete={canDelete}
              menuVisible={menuVisible}
              setMenuVisible={setMenuVisible}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onUpvote={handleUpvoteQuestion}
              onDownvote={handleDownvoteQuestion}
              vote={questionVote}
              renderAttachment={renderAttachment}
            />
            <View style={styles.sectionSeparator}>
              <Text style={styles.answersHeader}>Answers</Text>
            </View>
          </>
        }
        ListEmptyComponent={
          loadingAnswers ? (
            <ActivityIndicator size="large" color={colors.primary} />
          ) : (
            <Text style={{ color: colors.textMuted, fontSize: 18, textAlign: "center" }}>
              No answers yet.
            </Text>
          )
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.2}
        ListFooterComponent={
          loadingMore ? (
            <ActivityIndicator size="large" color={colors.primary} style={{ marginVertical: 16 }} />
          ) : null
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={{ padding: 22, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="always"
      />

      {/* BOTÓN PARA MOSTRAR INPUT DE RESPUESTA */}
      {!showAnswerInput && (
        <View style={styles.showAnswerInputButtonContainer}>
          <Button
            mode="contained"
            icon="plus"
            onPress={() => setShowAnswerInput(true)}
            buttonColor={colors.primary}
            style={{ borderRadius: 6 }}
            labelStyle={{ fontSize: 16, color: colors.buttonText }}
          >
            Write answer
          </Button>
        </View>
      )}

      {/* ANSWER INPUT */}
      {showAnswerInput && (
        <View style={styles.answerInputBoxSmall}>
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 6 }}>
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 16,
                color: colors.primary,
                flex: 1,
              }}
            >
              Write your answer
            </Text>
            <IconButton
              icon="close"
              size={22}
              onPress={() => setShowAnswerInput(false)}
              style={{ margin: 0 }}
              accessibilityLabel="Close answer input"
            />
          </View>
          <TextInput
            ref={answerInputRef}
            label="Your answer"
            value={answerText}
            onChangeText={text => setAnswerText(text)}
            mode="outlined"
            multiline
            returnKeyType="default"
            style={{
              marginBottom: 8,
              backgroundColor: colors.inputBackground,
              minHeight: 48,
              fontSize: 15,
              textAlignVertical: "top",
              color: colors.text,
            }}
            theme={{ colors: { primary: colors.primary, text: colors.text } }}
            onSubmitEditing={() => {}}
          />
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 8,
              flexWrap: "wrap",
            }}
          >
            <Button
              icon="attachment"
              mode="outlined"
              onPress={handlePickAnswerAttachment}
              style={{ marginRight: 8, borderColor: colors.primary }}
              textColor={colors.primary}
              disabled={answerAttachments.length >= MAX_ATTACHMENTS}
            >
              Add Attachment ({answerAttachments.length}/{MAX_ATTACHMENTS})
            </Button>
            <ScrollView horizontal style={{ flex: 1 }}>
              {answerAttachments.map((file, idx) =>
                renderPreviewAttachment(file, idx, answerAttachments)
              )}
            </ScrollView>
          </View>
          <Button
            mode="contained"
            onPress={handlePostAnswer}
            buttonColor={colors.primary}
            loading={postingAnswer}
            disabled={!answerText.trim() || postingAnswer}
            labelStyle={{ fontSize: 16, color: colors.buttonText }}
            style={{ paddingVertical: 0, marginTop: 10, borderRadius: 6 }}
          >
            Post answer
          </Button>
        </View>
      )}

      <ImageViewing
        images={imageViewerImages}
        imageIndex={imageViewerIndex}
        visible={imageViewerVisible}
        onRequestClose={() => setImageViewerVisible(false)}
        swipeToCloseEnabled
        doubleTapToZoomEnabled
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
  },
  answerInputBox: {
    backgroundColor: colors.cardBackground,
    borderRadius: 14,
    padding: 18,
    marginTop: 24,
    marginBottom: 24,
    elevation: 1,
  },
  answerInputBoxSmall: {
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    padding: 10,
    marginTop: 12,
    marginBottom: 12,
    elevation: 1,
  },
  previewBox: {
    marginBottom: 10,
    backgroundColor: "#f8fafd",
    borderRadius: 10,
    padding: 8,
    borderWidth: 1,
    borderColor: "#e3e8f0",
    flexDirection: "column",
  },
  sectionSeparator: {
    borderBottomWidth: 1,
    borderBottomColor: "#e3e8f0",
    marginTop: 18,
    marginBottom: 10,
    paddingBottom: 4,
    flexDirection: "row",
    alignItems: "center",
  },
  answersHeader: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.primary,
    marginLeft: 2,
  },
  showAnswerInputButtonContainer: {
    backgroundColor: colors.cardBackground,
    padding: 10,
    borderRadius: 12,
    marginHorizontal: 18,
    marginBottom: 16,
    alignItems: "center",
    elevation: 2,
  },
});