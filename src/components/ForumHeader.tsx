import React from "react";
import { View, ScrollView, TouchableOpacity } from "react-native";
import { Text, Avatar, Button, Menu, IconButton, Chip, Surface } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { formatDistanceToNow } from "date-fns";
import { ForumQuestionWithProfile, ForumAttachment } from "@src/types/forum";
import { colors } from "@theme/colors";

type Props = {
  question: ForumQuestionWithProfile;
  canEdit: boolean;
  canDelete: boolean;
  menuVisible: boolean;
  setMenuVisible: (v: boolean) => void;
  onEdit: () => void;
  onDelete: () => void;
  onUpvote: () => void;
  onDownvote: () => void;
  vote: number | null;
  renderAttachment: (att: ForumAttachment, idx: number, attachments: ForumAttachment[]) => React.ReactNode;
};

export const ForumHeader: React.FC<Props> = ({
  question,
  canEdit,
  canDelete,
  menuVisible,
  setMenuVisible,
  onEdit,
  onDelete,
  onUpvote,
  onDownvote,
  vote,
  renderAttachment,
}) => {
  const hasName =
    (question.authorProfile?.first_name && question.authorProfile.first_name.trim() !== "") ||
    (question.authorProfile?.last_name && question.authorProfile.last_name.trim() !== "");
  const displayName = hasName
    ? `${question.authorProfile.first_name || ""} ${question.authorProfile.last_name || ""}`.trim()
    : question.authorProfile?.user_name || "Unknown";
  const avatarSource =
    question.authorProfile?.banner && question.authorProfile.banner.trim() !== ""
      ? { uri: question.authorProfile.banner }
      : undefined;
  const avatarLabel =
    question.authorProfile?.first_name && question.authorProfile.first_name.length > 0
      ? question.authorProfile.first_name[0]
      : question.authorProfile?.user_name && question.authorProfile.user_name.length > 0
      ? question.authorProfile.user_name[0]
      : "?";
  const accepted = !!question.acceptedAnswerId && question.acceptedAnswerId !== "00000000-0000-0000-0000-000000000000";

  return (
    <>
      <Surface
        style={[
          {
            backgroundColor: colors.cardBackground,
            borderRadius: 18,
            padding: 22,
            marginBottom: 22,
            elevation: 3,
            shadowColor: "#000",
            shadowOpacity: 0.08,
            shadowRadius: 8,
            shadowOffset: { width: 0, height: 2 },
            borderColor: accepted ? colors.success : undefined,
            borderWidth: accepted ? 2 : undefined,
          },
        ]}
        elevation={3}
      >
        {/* Top: Avatar, user, date */}
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
          {avatarSource ? (
            <Avatar.Image
              size={48}
              source={avatarSource}
              style={{ backgroundColor: colors.primary, marginRight: 14 }}
            />
          ) : (
            <Avatar.Text
              size={48}
              label={avatarLabel}
              style={{ backgroundColor: colors.primary, marginRight: 14 }}
              labelStyle={{ color: "#fff", fontWeight: "bold", fontSize: 22 }}
            />
          )}
          <View style={{ flex: 1 }}>
            <Text style={{ fontWeight: "bold", fontSize: 18, color: colors.primary }}>{displayName}</Text>
            <View style={{ flexDirection: "row", alignItems: "center", marginTop: 2 }}>
              <MaterialCommunityIcons
                name="clock-outline"
                size={18}
                color={colors.textMuted}
                style={{ marginRight: 4 }}
              />
              <Text style={{ color: colors.textMuted, fontSize: 15 }}>
                {formatDistanceToNow(new Date(question.createdAt), { addSuffix: true })}
              </Text>
            </View>
          </View>
          {(canEdit || canDelete) && (
            <Menu
              visible={menuVisible}
              onDismiss={() => setMenuVisible(false)}
              anchor={
                <IconButton
                  icon="dots-vertical"
                  size={26}
                  onPress={() => setMenuVisible(true)}
                  style={{ margin: 0, padding: 0, alignSelf: "flex-end", backgroundColor: "transparent" }}
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
                  onPress={onEdit}
                  title="Edit"
                  leadingIcon="pencil"
                  style={{ minHeight: 54, justifyContent: "center", paddingVertical: 0 }}
                  titleStyle={{ fontSize: 18, color: colors.text, fontWeight: "500" }}
                />
              )}
              {canDelete && (
                <Menu.Item
                  onPress={onDelete}
                  title="Delete"
                  leadingIcon="delete"
                  style={{ minHeight: 54, justifyContent: "center", paddingVertical: 0 }}
                  titleStyle={{ fontSize: 18, color: colors.error, fontWeight: "500" }}
                />
              )}
            </Menu>
          )}
        </View>
        {/* Title + accepted icon */}
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={{
            fontWeight: "bold",
            fontSize: 26,
            color: colors.text,
            marginBottom: 8,
            marginTop: 2,
            flexShrink: 1,
            width: "100%",
            lineHeight: 32,
            textAlign: "left",
          }}>{question.title}</Text>
          {question.isEdited && (
            <MaterialCommunityIcons
              name="pencil"
              size={20}
              color={colors.info}
              style={{ marginLeft: 8 }}
            />
          )}
          {accepted && (
            <View style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "#eafaf1",
              borderRadius: 8,
              paddingHorizontal: 8,
              marginLeft: 10,
              height: 26,
            }}>
              <MaterialCommunityIcons name="check-decagram" size={20} color={colors.success} />
              <Text style={{
                color: colors.success,
                fontWeight: "bold",
                fontSize: 14,
                marginLeft: 4,
              }}>Accepted answer</Text>
            </View>
          )}
        </View>
        {/* Tags */}
        {question.tags.length > 0 && (
          <View style={{ flexDirection: "row", flexWrap: "wrap", marginBottom: 8, gap: 6 }}>
            {question.tags.map((tag) => (
              <Chip
                key={tag}
                style={{
                  backgroundColor: "#f3f3f3",
                  marginRight: 4,
                  height: 30,
                  borderRadius: 16,
                  paddingHorizontal: 6,
                }}
                textStyle={{
                  color: "#3b5bb6",
                  fontWeight: "bold",
                  fontSize: 15,
                  lineHeight: 16,
                }}
                icon="tag"
                compact
              >
                {tag}
              </Chip>
            ))}
          </View>
        )}
        {/* Attachments */}
        {Array.isArray(question.attachments) && question.attachments.length > 0 && (
          <ScrollView horizontal style={{ marginTop: 10, marginBottom: 10 }}>
            {question.attachments.map((att: ForumAttachment, idx: number) =>
              renderAttachment(att, idx, question.attachments)
            )}
          </ScrollView>
        )}
        {/* Description */}
        <Text style={{
          fontSize: 18,
          color: colors.text,
          opacity: 0.97,
          marginTop: 8,
          marginBottom: 8,
        }}>{question.description}</Text>
        {/* Status and answers */}
        <View style={{ flexDirection: "row", alignItems: "center", flexWrap: "wrap", marginTop: 6, marginBottom: 2, gap: 10 }}>
          {question.answerCount > 0 && (
            <>
              <MaterialCommunityIcons
                name="comment-question-outline"
                size={20}
                color={colors.info}
                style={{ marginRight: 4 }}
              />
              <Text style={{ color: colors.success, fontWeight: "bold", fontSize: 16 }}>{question.answerCount} answers</Text>
            </>
          )}
          {question.isPinned && (
            <View style={{ flexDirection: "row", alignItems: "center", marginLeft: 10 }}>
              <MaterialCommunityIcons
                name="pin"
                size={20}
                color={colors.error}
                style={{ marginRight: 4 }}
              />
              <Text style={{ color: colors.error, fontWeight: "bold", fontSize: 16 }}>
                Pinned
              </Text>
            </View>
          )}
          {question.isClosed && (
            <View style={{ flexDirection: "row", alignItems: "center", marginLeft: 10 }}>
              <MaterialCommunityIcons
                name="lock"
                size={20}
                color={colors.textMuted}
                style={{ marginRight: 4 }}
              />
              <Text style={{ color: colors.textMuted, fontWeight: "bold", fontSize: 16 }}>
                Closed
              </Text>
            </View>
          )}
        </View>
        {/* Votes */}
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", marginTop: 16, marginBottom: 2, gap: 8 }}>
          <TouchableOpacity
            onPress={onUpvote}
            style={[
              { padding: 2 },
              vote === 1 && { backgroundColor: colors.success, borderRadius: 20 },
            ]}
          >
            <MaterialCommunityIcons
              name="arrow-up-bold-circle"
              size={36}
              color={vote === 1 ? "#fff" : colors.success}
            />
          </TouchableOpacity>
          <Text style={{
            fontWeight: "bold",
            fontSize: 22,
            color: colors.primary,
            textAlign: "center",
            marginHorizontal: 8,
          }}>{question.upvotes}</Text>
          <TouchableOpacity
            onPress={onDownvote}
            style={[
              { padding: 2 },
              vote === -1 && { backgroundColor: colors.error, borderRadius: 20 },
            ]}
          >
            <MaterialCommunityIcons
              name="arrow-down-bold-circle"
              size={36}
              color={vote === -1 ? "#fff" : colors.error}
            />
          </TouchableOpacity>
          <Text style={{
            fontWeight: "bold",
            fontSize: 22,
            color: colors.primary,
            textAlign: "center",
            marginHorizontal: 8,
          }}>{question.downvotes}</Text>
        </View>
      </Surface>
    </>
  );
};