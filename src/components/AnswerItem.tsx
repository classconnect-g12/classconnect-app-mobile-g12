import React from "react";
import { View, ScrollView, TouchableOpacity } from "react-native";
import { Text, Avatar, Menu, IconButton, Chip } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { formatDistanceToNow } from "date-fns";
import { ForumAnswerResponse, ForumAttachment } from "@src/types/forum";
import { colors } from "@theme/colors";

type Props = {
  answer: ForumAnswerResponse;
  isAuthor: boolean;
  canEdit: boolean;
  canDelete: boolean;
  menuVisible: boolean;
  setMenuVisible: (id: string | null) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onAccept: (id: string) => void;
  onUpvote: (id: string) => void;
  onDownvote: (id: string) => void;
  vote: number | null;
  accepted: boolean;
  answers: ForumAnswerResponse[];
  renderAttachment: (att: ForumAttachment, idx: number, attachments: ForumAttachment[]) => React.ReactNode;
};

export const AnswerItem: React.FC<Props> = ({
  answer,
  isAuthor,
  canEdit,
  canDelete,
  menuVisible,
  setMenuVisible,
  onEdit,
  onDelete,
  onAccept,
  onUpvote,
  onDownvote,
  vote,
  accepted,
  answers,
  renderAttachment,
}) => {
  const hasName =
    (answer.authorProfile?.first_name && answer.authorProfile.first_name.trim() !== "") ||
    (answer.authorProfile?.last_name && answer.authorProfile.last_name.trim() !== "");
  const displayName = hasName
    ? `${answer.authorProfile.first_name || ""} ${answer.authorProfile.last_name || ""}`.trim()
    : answer.authorProfile?.user_name || "Unknown";
  const avatarSource =
    answer.authorProfile?.banner && answer.authorProfile.banner.trim() !== ""
      ? { uri: answer.authorProfile.banner }
      : undefined;
  const avatarLabel =
    answer.authorProfile?.first_name && answer.authorProfile.first_name.length > 0
      ? answer.authorProfile.first_name[0]
      : answer.authorProfile?.user_name && answer.authorProfile.user_name.length > 0
      ? answer.authorProfile.user_name[0]
      : "?";

  return (
    <View key={answer.id} style={{
      marginBottom: 22,
      borderRadius: 12,
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: "gray",
    }}>
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 6 }}>
        {avatarSource ? (
          <Avatar.Image
            size={38}
            source={avatarSource}
            style={{ backgroundColor: colors.primary, marginRight: 12 }}
          />
        ) : (
          <Avatar.Text
            size={38}
            label={avatarLabel}
            style={{ backgroundColor: colors.primary, marginRight: 12 }}
            labelStyle={{ color: "#fff", fontWeight: "bold", fontSize: 22 }}
          />
        )}
        <View style={{ flex: 1 }}>
          <Text style={{ fontWeight: "bold", color: colors.text, fontSize: 18 }}>
            {displayName}
          </Text>
          <Text style={{ color: colors.textMuted, fontSize: 15 }}>
            {formatDistanceToNow(new Date(answer.createdAt), { addSuffix: true })}
          </Text>
        </View>
        {(canEdit || canDelete) && (
          <Menu
            visible={menuVisible}
            onDismiss={() => setMenuVisible(null)}
            anchor={
              <IconButton
                icon="dots-vertical"
                size={24}
                onPress={() => setMenuVisible(answer.id)}
                style={{ marginLeft: 2 }}
                rippleColor={colors.inputBackground}
              />
            }
            contentStyle={{
              borderRadius: 12,
              minWidth: 180,
              paddingVertical: 0,
              backgroundColor: "#fff",
              elevation: 4,
            }}
          >
            {canEdit && (
              <Menu.Item
                onPress={() => onEdit(answer.id)}
                title="Edit"
                leadingIcon="pencil"
                style={{ minHeight: 54, justifyContent: "center", paddingVertical: 0 }}
                titleStyle={{ fontSize: 18, color: colors.text, fontWeight: "500" }}
              />
            )}
            {canDelete && (
              <Menu.Item
                onPress={() => onDelete(answer.id)}
                title="Delete"
                leadingIcon="delete"
                style={{ minHeight: 54, justifyContent: "center", paddingVertical: 0 }}
                titleStyle={{ fontSize: 18, color: colors.error, fontWeight: "500" }}
              />
            )}
          </Menu>
        )}
        {isAuthor && !answers.some(a => a.accepted) && !answer.accepted && (
          <TouchableOpacity
            style={{ marginLeft: 8 }}
            onPress={() => onAccept(answer.id)}
          >
            <MaterialCommunityIcons
              name="check-decagram"
              size={28}
              color={colors.success}
            />
          </TouchableOpacity>
        )}
        {answer.accepted && (
          <MaterialCommunityIcons
            name="check-decagram"
            size={28}
            color={colors.success}
            style={{ marginLeft: 8 }}
          />
        )}
      </View>
      <Text style={{ color: colors.text, fontSize: 18 }}>{answer.text}</Text>
      {Array.isArray(answer.attachments) && answer.attachments.length > 0 && (
        <ScrollView horizontal style={{ marginTop: 10 }}>
          {answer.attachments.map((att: ForumAttachment, idx: number) =>
            renderAttachment(att, idx, answer.attachments)
          )}
        </ScrollView>
      )}
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", marginTop: 16, marginBottom: 2, gap: 8 }}>
        <TouchableOpacity
          onPress={() => onUpvote(answer.id)}
          style={[
            { padding: 2 },
            vote === 1 && { backgroundColor: colors.success, borderRadius: 20 },
          ]}
        >
          <MaterialCommunityIcons
            name="arrow-up-bold"
            size={28}
            color={vote === 1 ? "#fff" : colors.success}
          />
        </TouchableOpacity>
        <Text style={{ fontWeight: "bold", fontSize: 18, color: colors.text }}>{answer.upvotes}</Text>
        <TouchableOpacity
          onPress={() => onDownvote(answer.id)}
          style={[
            { padding: 2 },
            vote === -1 && { backgroundColor: colors.error, borderRadius: 20 },
          ]}
        >
          <MaterialCommunityIcons
            name="arrow-down-bold"
            size={28}
            color={vote === -1 ? "#fff" : colors.error}
          />
        </TouchableOpacity>
        <Text style={{ fontWeight: "bold", fontSize: 18, color: colors.text }}>{answer.downvotes}</Text>
        {answer.accepted && (
          <Text style={{ color: colors.success, marginLeft: 14, fontWeight: "bold", fontSize: 17 }}>
            Accepted
          </Text>
        )}
      </View>
    </View>
  );
};