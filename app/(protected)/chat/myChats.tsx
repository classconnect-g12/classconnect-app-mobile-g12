import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Modal,
  TextInput,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { getChats, createChat, deleteChat } from "@services/ChatService";
import Spinner from "@components/Spinner";
import { useRouter } from "expo-router";
import { colors } from "@theme/colors";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useSnackbar } from "@context/SnackbarContext";
import { SNACKBAR_VARIANTS } from "@constants/snackbarVariants";

type Chat = {
  id: string;
  title: string;
};

export default function ChatListScreen() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newChatTitle, setNewChatTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [creating, setCreating] = useState(false);
  const router = useRouter();
  const { showSnackbar } = useSnackbar();

  const fetchChats = async () => {
    setLoading(true);
    setError(false);
    const response = await getChats();
    if ("status" in response && "detail" in response) {
      setError(true);
      setLoading(false);
      return;
    }

    setChats(response.data);
    setLoading(false);
  };

  useEffect(() => {
    //fetchChats();
  }, []);

  const handleCreateChat = async () => {
    if (!newChatTitle.trim()) {
      showSnackbar("Please enter a chat title.", SNACKBAR_VARIANTS.ERROR);
      return;
    }
    setCreating(true);
    try {
      await createChat(newChatTitle);
      setModalVisible(false);
      setNewChatTitle("");
      fetchChats();
    } catch (error) {
      Alert.alert("Error", "Failed to create chat.");
    }
    setCreating(false);
  };

  const confirmDeleteChat = (chatId: string) => {
    Alert.alert(
      "Confirm delete",
      "Are you sure you want to delete this chat?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => handleDeleteChat(chatId),
        },
      ]
    );
  };

  const handleDeleteChat = async (chatId: string) => {
    await deleteChat(chatId);
    fetchChats();
  };

  const handleOpenChat = (chatId: string) => {
    router.push(`/chat/${chatId}`);
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <Spinner />
      ) : error ? (
        <View style={styles.centered}>
          <Text style={{ fontSize: 24, marginBottom: 12 }}>🔒</Text>
          <Text style={styles.errorText}>Service unavailable</Text>
        </View>
      ) : (
        <>
          <TouchableOpacity
            style={styles.createButtonMain}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.createButtonText}>New chat</Text>
          </TouchableOpacity>

          {chats.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                No chats yet. Create a new one to start!
              </Text>
            </View>
          ) : (
            <FlatList
              data={chats}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => handleOpenChat(item.id)}
                  style={styles.chatItem}
                >
                  <Text style={styles.chatTitle}>{item.title}</Text>
                  <TouchableOpacity
                    onPress={() => confirmDeleteChat(item.id)}
                    style={styles.deleteButton}
                  >
                    <Icon name="trash-can-outline" size={24} color="#E94E4E" />
                  </TouchableOpacity>
                </TouchableOpacity>
              )}
            />
          )}
        </>
      )}

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>New Chat</Text>
            <TextInput
              placeholder="Title"
              value={newChatTitle}
              onChangeText={setNewChatTitle}
              style={styles.input}
              autoFocus
              editable={!creating}
            />
            <View style={styles.modalButtonGroup}>
              <TouchableOpacity
                style={[styles.createButton, creating && styles.disabledButton]}
                onPress={handleCreateChat}
                disabled={creating}
              >
                {creating ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text style={styles.createButtonText}>Create</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}
                disabled={creating}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1,
    padding: 20,
  },
  chatItem: {
    marginVertical: 10,
    padding: 12,
    backgroundColor: "white",
    elevation: 3,
    borderRadius: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  chatTitle: {
    fontSize: 18,
  },
  deleteButton: {
    padding: 4,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#00000099",
  },
  modalContainer: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 8,
    padding: 20,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 10,
  },
  input: {
    borderBottomWidth: 1,
    marginBottom: 20,
    fontSize: 18,

    paddingVertical: 8,
  },
  errorText: {
    marginTop: 50,
    fontSize: 18,
    color: "red",
    textAlign: "center",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  createButton: {
    backgroundColor: "#4A90E2",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    flex: 1,
    marginRight: 5,
  },
  disabledButton: {
    opacity: 0.6,
  },
  createButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  modalButtonGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },

  cancelButton: {
    backgroundColor: "#E94E4E",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    flex: 1,
    marginLeft: 5,
  },

  cancelButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  createButtonMain: {
    backgroundColor: "#4A90E2",
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16,
    alignSelf: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#999",
    marginTop: 40,
  },
  emptyContainer: {
    alignItems: "center",
  },
});
