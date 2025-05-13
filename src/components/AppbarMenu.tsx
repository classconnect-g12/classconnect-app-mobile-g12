import React, { useState, useContext } from "react";
import { View, FlatList } from "react-native";
import { Appbar, Menu, IconButton, Portal, Modal, Text, Card, Button, Badge } from "react-native-paper";
import { RelativePathString, useRouter } from "expo-router";
import { useAuth } from "../context/authContext";
import { colors } from "@theme/colors";
import { NotificationContext } from "../context/notificationContext"; 
import { deleteNotification, updateNotificationPreferences } from "@services/NotificationService";
import { NotificationType, PreferencesResponse } from "@src/types/notification";
import { appbarMenuStyles } from "@styles/appBarMenuStyles";

const getDaysAgo = (createdAt: string) => {
  let cleanedDate = createdAt;
  if (createdAt.includes("UTC")) {
    cleanedDate = createdAt.split(" ")[0] + "T" + createdAt.split(" ")[1] + "Z";
  }
  const notificationDate = new Date(cleanedDate);
  if (isNaN(notificationDate.getTime())) {
    console.warn("⚠️ Fecha inválida después de limpiar:", cleanedDate);
    return "Unknown";
  }
  const today = new Date();
  const differenceInTime = today.getTime() - notificationDate.getTime();
  const differenceInDays = Math.floor(differenceInTime / (1000 * 60 * 60 * 24));
  return differenceInDays === 0 ? "Today" : `${differenceInDays} days ago`;
};

const AppbarMenu: React.FC<{ title: string }> = ({ title }) => {
  const { logout } = useAuth();
  const router = useRouter();
  const [menuVisible, setMenuVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [settingsModalVisible, setSettingsModalVisible] = useState(false);

  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("NotificationContext debe estar dentro de un NotificationProvider");
  }
  const { 
    hasNewNotifications, 
    setHasNewNotifications, 
    notifications, 
    setNotifications, 
    notificationPreferences, 
    setNotificationPreferences 
  } = context;

  const savePreferences = async () => {
    try {
      const selectedPrefs: NotificationType[] = Object.keys(notificationPreferences).filter(
        (key) => notificationPreferences[key]
      ) as NotificationType[];
  
      const preferencesPayload = { preferences: selectedPrefs };
      await updateNotificationPreferences(preferencesPayload);
  
      setNotificationPreferences((prev) => {
        const updatedPrefs = selectedPrefs.reduce((acc, type) => {
          acc[type] = true;
          return acc;
        }, {} as { [key: string]: boolean });
        return { ...prev, ...updatedPrefs };
      });
  
      setSettingsModalVisible(false);
      console.log("✅ Preferences updated successfully!");
    } catch (error) {
      console.error("❌ Error updating notification preferences:", error);
    }
  };

  const handleNotifications = () => {
    setModalVisible(true);
    setHasNewNotifications(false);
  };

  const handleDeleteNotification = async (notificationId: string) => {
    try {
      await deleteNotification(notificationId, notifications, setNotifications);
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  const togglePreference = (type: string) => {
    setNotificationPreferences((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  return (
    <>
      <Appbar.Header style={appbarMenuStyles.header}>
        <Appbar.Content title={title} titleStyle={appbarMenuStyles.title} />
        <View style={appbarMenuStyles.notificationContainer}>
          <IconButton
            icon={hasNewNotifications ? "bell-badge" : "bell-outline"}
            size={24}
            onPress={handleNotifications}
          />
          {hasNewNotifications && (
            <Badge style={appbarMenuStyles.badge} size={10} />
          )}
        </View>
        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={<Appbar.Action icon="dots-vertical" onPress={() => setMenuVisible(true)} />}
        >
          <Menu.Item onPress={() => {setMenuVisible(false); router.push("/profile/profileEdit")}} title="My Profile" titleStyle={{ fontWeight: "bold" }} />
          <Menu.Item onPress={() => {setMenuVisible(false); router.push("/course/myCourses")}} title="My Courses" titleStyle={{ fontWeight: "bold" }} />
          <Menu.Item onPress={() => {setMenuVisible(false); logout}} title="Log out" titleStyle={{ fontWeight: "bold", color: "#d9534f" }} />
        </Menu>
      </Appbar.Header>

      <Portal>
        {/* Modal de Notificaciones */}
        <Modal
          visible={modalVisible}
          onDismiss={() => setModalVisible(false)}
          contentContainerStyle={appbarMenuStyles.modalContainer}
        >
          <View style={appbarMenuStyles.modalHeader}>
            <Text variant="headlineSmall" style={appbarMenuStyles.modalTitle}>Notifications</Text>
            <IconButton
              icon="cog-outline"
              size={24}
              iconColor={colors.primary}
              onPress={() => setSettingsModalVisible(true)}
              style={appbarMenuStyles.settingsIcon}
            />
          </View>
          {notifications.length > 0 ? (
            <FlatList
              data={notifications}
              keyExtractor={(item) => item.id}
              style={{ maxHeight: "80%" }} 
              renderItem={({ item }) => (
                <Card
                  style={appbarMenuStyles.card}
                  onPress={() => {
                    setModalVisible(false);
                    if (item.detail) {
                      router.push(item.detail as RelativePathString);
                    } else {
                      console.warn("⚠️ No route found for notification:", item);
                    }
                  }}
                >
                  <Card.Content>
                    <Text variant="titleMedium" style={appbarMenuStyles.cardTitle}>{item.title}</Text>
                    <Text variant="bodyMedium" style={appbarMenuStyles.cardBody}>{item.body}</Text>
                    <Text style={appbarMenuStyles.cardDate}>{getDaysAgo(item.createdAt)}</Text>
                  </Card.Content>
                  <Card.Actions>
                    <IconButton
                      icon="trash-can-outline"
                      size={24}
                      iconColor={colors.primary}
                      onPress={() => handleDeleteNotification(item.id)}
                    />
                  </Card.Actions>
                </Card>
              )}
            />
          ) : (
            <Text style={appbarMenuStyles.noNotificationsText}>No notifications available.</Text>
          )}
          <Button
            onPress={() => setModalVisible(false)}
            mode="contained"
            style={appbarMenuStyles.closeButton}
            labelStyle={appbarMenuStyles.closeButtonLabel}
          >
            Close
          </Button>
        </Modal>

        {/* Modal de Settings */}
        <Modal
          visible={settingsModalVisible}
          onDismiss={() => setSettingsModalVisible(false)}
          contentContainerStyle={appbarMenuStyles.modalContainer}
        >
          <Text variant="headlineSmall" style={appbarMenuStyles.settingsModalTitle}>Notification Settings</Text>
          {Object.entries(notificationPreferences).map(([type, isEnabled]) => (
            <View key={type} style={appbarMenuStyles.settingsItem}>
              <Text style={appbarMenuStyles.settingsText}>{type.replace(/_/g, " ")}</Text>
              <IconButton
                icon={isEnabled ? "toggle-switch" : "toggle-switch-off"}
                size={70}
                iconColor={isEnabled ? colors.primary : "gray"}
                onPress={() => togglePreference(type)}
              />
            </View>
          ))}
          <Button
            onPress={savePreferences}
            mode="contained"
            style={appbarMenuStyles.closeButton}
            labelStyle={appbarMenuStyles.closeButtonLabel}
          >
            Save & Close
          </Button>
        </Modal>
      </Portal>
    </>
  );
};

export default AppbarMenu;
