import React, { useEffect, useState } from "react";
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
} from "react-native";
import {
  getMessagesByChatId,
  createMessage,
  askIa,
  calificateMessage,
} from "@services/ChatService";
import { useLocalSearchParams } from "expo-router";
import { colors } from "@theme/colors";

type Message = {
  id: string;
  content: string;
  created_at: string;
  is_from_ai: boolean;
  user_id: number;
};

export default function ChatDetailScreen() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [newMessage, setNewMessage] = useState("");

  const { chatId } = useLocalSearchParams<{ chatId: string }>();

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
    fetchAllMessages();
  }, [chatId]);

  const handleLike = (messageId: string) => {
    calificateMessage(chatId, messageId, true);
    console.log("Liked message", messageId);
  };

  const handleDislike = (messageId: string) => {
    calificateMessage(chatId, messageId, false);
    console.log("Disliked message", messageId);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !chatId) return;

    const response = await createMessage(chatId, newMessage);
    await askIa(chatId, response.data.id);
    setNewMessage("");
    fetchAllMessages();
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "white" }}
      behavior={Platform.select({ ios: "padding", android: undefined })}
      keyboardVerticalOffset={80}
    >
      <View style={styles.container}>
        <ScrollView
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
                <Text style={styles.content}>{item.content}</Text>
                <Text style={styles.timestamp}>
                  {new Date(item.created_at).toLocaleTimeString()}
                </Text>

                {item.user_id === 0 && (
                  <View style={styles.feedbackContainer}>
                    <Text style={styles.feedbackPrompt}>
                      ¿Qué te pareció la respuesta?
                    </Text>
                    <View style={styles.feedbackButtons}>
                      <TouchableOpacity
                        onPress={() => handleLike(item.id)}
                        style={styles.iconButton}
                      >
                        <Text style={styles.iconText}>👍</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => handleDislike(item.id)}
                        style={styles.iconButton}
                      >
                        <Text style={styles.iconText}>👎</Text>
                      </TouchableOpacity>
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
          />
          <Button
            color={colors.primary}
            title="Send"
            onPress={handleSendMessage}
          />
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
    fontSize: 20,
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
});
