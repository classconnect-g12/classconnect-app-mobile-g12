import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import {
  getMessagesByChatId,
  createMessage,
  askIa,
  calificateMessage,
} from "@services/ChatService";
import { useLocalSearchParams } from "expo-router";
import { colors } from "@theme/colors";
import Markdown from "react-native-markdown-display";

type Message = {
  id: string;
  content: string;
  created_at: string;
  is_from_ai: boolean;
  user_id: number;
};

export default function ChatDetailScreen() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loadingMore, setLoadingMore] = useState(false);
  const [sending, setSending] = useState(false);
  const [messageRatings, setMessageRatings] = useState<{
    [messageId: string]: "like" | "dislike";
  }>({});

  const { chatId } = useLocalSearchParams<{ chatId: string }>();
  const scrollViewRef = useRef<ScrollView>(null);

  const scrollToBottom = () => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  };

  const fetchAllMessages = async () => {
    if (!chatId) return;

    let allMessages: Message[] = [];
    let cursor: string | null | undefined = undefined;

    try {
      setLoadingMore(true);
      while (true) {
        const response = await getMessagesByChatId(chatId, cursor);
        const newMessages = response.data || [];
        allMessages = [...allMessages, ...newMessages];

        cursor = response.pagination?.next;
        if (!cursor) break;
      }

      setMessages(allMessages);
    } finally {
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchAllMessages().then(() => {
      setTimeout(scrollToBottom, 1000);
    });
  }, [chatId]);

  const handleLike = (messageId: string) => {
    calificateMessage(chatId, messageId, true);
    setMessageRatings((prev) => ({ ...prev, [messageId]: "like" }));
  };

  const handleDislike = (messageId: string) => {
    calificateMessage(chatId, messageId, false);
    setMessageRatings((prev) => ({ ...prev, [messageId]: "dislike" }));
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !chatId) return;

    setSending(true);
    try {
      const response = await createMessage(chatId, newMessage);
      await askIa(chatId, response.data.id);
      setNewMessage("");
      await fetchAllMessages();
      scrollToBottom();
    } finally {
      setSending(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "white" }}
      behavior={Platform.select({ ios: "padding", android: undefined })}
      keyboardVerticalOffset={80}
    >
      <View style={styles.container}>
        <ScrollView
          ref={scrollViewRef}
          onContentSizeChange={scrollToBottom}
          contentContainerStyle={{
            paddingBottom: 80,
            paddingHorizontal: 20,
            paddingVertical: 10,
          }}
        >
          {messages
            .slice()
            .reverse()
            .map((item) => (
              <View
                key={item.id}
                style={[
                  styles.messageBubble,
                  item.user_id === 0 ? styles.messageAI : styles.messageUser,
                ]}
              >
                <Markdown style={{ body: styles.content }}>
                  {item.content}
                </Markdown>
                <Text style={styles.timestamp}>
                  {new Date(item.created_at).toLocaleTimeString()}
                </Text>

                {item.user_id === 0 && (
                  <View style={styles.feedbackContainer}>
                    <Text style={styles.feedbackPrompt}>
                      ¿Qué te pareció la respuesta?
                    </Text>
                    <View style={styles.feedbackButtons}>
                      {messageRatings[item.id] !== "dislike" && (
                        <TouchableOpacity
                          onPress={() => handleLike(item.id)}
                          disabled={!!messageRatings[item.id]}
                          style={[
                            styles.iconButton,
                            messageRatings[item.id] === "like" &&
                              styles.activeIconButton,
                            messageRatings[item.id] && styles.disabledButton,
                          ]}
                        >
                          <Text
                            style={[
                              styles.iconText,
                              messageRatings[item.id] === "like" &&
                                styles.activeIconText,
                              messageRatings[item.id] &&
                                styles.disabledIconText,
                            ]}
                          >
                            👍
                          </Text>
                        </TouchableOpacity>
                      )}

                      {messageRatings[item.id] !== "like" && (
                        <TouchableOpacity
                          onPress={() => handleDislike(item.id)}
                          disabled={!!messageRatings[item.id]}
                          style={[
                            styles.iconButton,
                            messageRatings[item.id] === "dislike" &&
                              styles.activeIconButton,
                            messageRatings[item.id] && styles.disabledButton,
                          ]}
                        >
                          <Text
                            style={[
                              styles.iconText,
                              messageRatings[item.id] === "dislike" &&
                                styles.activeIconText,
                              messageRatings[item.id] &&
                                styles.disabledIconText,
                            ]}
                          >
                            👎
                          </Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                )}
              </View>
            ))}
        </ScrollView>

        <View style={styles.inputContainer}>
          <TextInput
            value={newMessage}
            onChangeText={setNewMessage}
            placeholder="Type a message"
            style={styles.input}
            editable={!sending}
          />
          {sending ? (
            <ActivityIndicator
              color={colors.primary}
              style={{ marginLeft: 10 }}
            />
          ) : (
            <Button
              color={colors.primary}
              title="Send"
              onPress={handleSendMessage}
              disabled={sending}
            />
          )}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  messageBubble: {
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
    maxWidth: "80%",
  },
  messageUser: {
    backgroundColor: colors.primary,
    alignSelf: "flex-end",
  },
  messageAI: {
    backgroundColor: colors.secondary,
    alignSelf: "flex-start",
  },
  timestamp: {
    fontSize: 12,
    marginTop: 5,
    color: colors.border,
  },
  content: {
    color: "white",
    fontSize: 16,
  },
  inputContainer: {
    position: "absolute",
    bottom: 10,
    left: 10,
    right: 10,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    elevation: 3,
  },
  input: {
    flex: 1,
    marginRight: 10,
    borderBottomWidth: 1,
    height: 40,
  },
  feedbackButtons: {
    flexDirection: "row",
    marginTop: 8,
    gap: 8,
  },
  iconButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 6,
  },
  iconText: {
    fontSize: 18,
    color: "white",
  },
  feedbackContainer: {
    marginTop: 10,
  },
  feedbackPrompt: {
    color: "white",
    fontSize: 14,
    marginBottom: 4,
  },
  activeIconButton: {
    backgroundColor: colors.primary,
  },

  activeIconText: {
    color: colors.secondary,
    fontWeight: "bold",
  },
  disabledButton: {
    opacity: 1,
  },

  disabledIconText: {
    opacity: 1,
  },
});
