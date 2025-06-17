import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Keyboard,
} from "react-native";
import { Button, TextInput, Chip, Avatar, IconButton, Portal, Modal } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { colors } from "@theme/colors";
import {
  fetchForumQuestions,
  ForumTagResponse,
  ForumQuestionWithProfile,
  fetchForumTags,
} from "@services/ForumService";
import { formatDistanceToNow } from "date-fns";
import { ForumQuestionsProvider, useForumQuestions } from "@context/ForumQuestionsContext";

const MAX_TAGS_VISIBLE = 6;
const PAGE_SIZE = 10;

function hasAcceptedAnswer(acceptedAnswerId?: string | null) {
  return (
    acceptedAnswerId &&
    acceptedAnswerId !== "00000000-0000-0000-0000-000000000000"
  );
}

function ForumScreenInner() {
  const router = useRouter();
  const { id: courseId } = useLocalSearchParams<{ id: string }>();
  const [search, setSearch] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sort, setSort] = useState<"recent" | "votes" | "answers">("recent");
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [showAllTags, setShowAllTags] = useState(false);
  const [tags, setTags] = useState<ForumTagResponse[]>([]);
  const [loadingTags, setLoadingTags] = useState(false);
  const [filtersVisible, setFiltersVisible] = useState(false);

  const { questions, setQuestions } = useForumQuestions();
  const isFetchingMore = useRef(false);

  // --- FETCH TAGS ---
  useEffect(() => {
    const loadTags = async () => {
      setLoadingTags(true);
      try {
        const tagList = await fetchForumTags(String(courseId));
        setTags(tagList);
      } catch {
        setTags([]);
      } finally {
        setLoadingTags(false);
      }
    };
    loadTags();
  }, []);

  const visibleTags = showAllTags ? tags : tags.slice(0, MAX_TAGS_VISIBLE);

  // --- FETCH QUESTIONS ---
  const fetchQuestionsHandler = async ({
    reset = false,
    pageToFetch = 0,
    append = false,
  }: {
    reset?: boolean;
    pageToFetch?: number;
    append?: boolean;
  }) => {
    if (!courseId) return;
    if (isFetchingMore.current) return;
    if (append) isFetchingMore.current = true;

    try {
      if (reset) setLoading(true);
      else if (append) setLoadingMore(true);

      const data = await fetchForumQuestions(
        String(courseId),
        pageToFetch,
        PAGE_SIZE,
        {
          tags: selectedTags.length > 0 ? selectedTags : undefined,
          search: search || undefined,
          sort,
        }
      );

      if (reset) {
        setQuestions(data.questions);
        setTotalItems(data.totalItems);
        setPage(data.page);
      } else if (append) {
        if (data.questions.length > 0) {
          setQuestions((prev) => [...prev, ...data.questions]);
          setPage(data.page);
        }
        setTotalItems(data.totalItems);
      }
    } catch (e) {
      if (reset) setQuestions([]);
    } finally {
      setLoading(false);
      setLoadingMore(false);
      isFetchingMore.current = false;
    }
  };

  useEffect(() => {
    fetchQuestionsHandler({ reset: true, pageToFetch: 0 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId, selectedTags, search, sort]);

  const handleLoadMore = () => {
    if (
      !loadingMore &&
      !loading &&
      questions.length < totalItems
    ) {
      fetchQuestionsHandler({
        append: true,
        pageToFetch: page + 1,
      });
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchQuestionsHandler({ reset: true, pageToFetch: 0 });
    setRefreshing(false);
  }, [courseId, selectedTags, search, sort]);

  // Mejor UX: cerrar teclado al buscar
  const handleSearchSubmit = () => {
    Keyboard.dismiss();
    fetchQuestionsHandler({ reset: true, pageToFetch: 0 });
  };

  // --- TAG SELECTION ---
  const toggleTag = (tagName: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagName)
        ? prev.filter((t) => t !== tagName)
        : [...prev, tagName]
    );
  };

  // --- FILTERS MODAL (solo Sort by) ---
  const renderFiltersModal = () => (
    <Portal>
      <Modal
        visible={filtersVisible}
        onDismiss={() => setFiltersVisible(false)}
        contentContainerStyle={styles.modalContainer}
      >
        <Text style={styles.modalTitle}>Sort by</Text>
        <View style={{ flexDirection: "row", marginBottom: 12, justifyContent: "center" }}>
          <Chip
            selected={sort === "recent"}
            onPress={() => setSort("recent")}
            style={[
              styles.filterChip,
              sort === "recent" && { backgroundColor: colors.primary },
            ]}
            textStyle={{
              color: sort === "recent" ? colors.buttonText : colors.text,
              fontWeight: "bold",
              fontSize: 15,
            }}
          >
            Recent
          </Chip>
          <Chip
            selected={sort === "votes"}
            onPress={() => setSort("votes")}
            style={[
              styles.filterChip,
              sort === "votes" && { backgroundColor: colors.primary },
            ]}
            textStyle={{
              color: sort === "votes" ? colors.buttonText : colors.text,
              fontWeight: "bold",
              fontSize: 15,
            }}
          >
            Votes
          </Chip>
          <Chip
            selected={sort === "answers"}
            onPress={() => setSort("answers")}
            style={[
              styles.filterChip,
              sort === "answers" && { backgroundColor: colors.primary },
            ]}
            textStyle={{
              color: sort === "answers" ? colors.buttonText : colors.text,
              fontWeight: "bold",
              fontSize: 15,
            }}
          >
            Answers
          </Chip>
        </View>
        <Button
          mode="contained"
          onPress={() => setFiltersVisible(false)}
          style={styles.applyFilterButton}
          buttonColor={colors.primary}
          textColor={colors.buttonText}
          labelStyle={{ fontSize: 16, fontWeight: "bold" }}
        >
          Apply
        </Button>
      </Modal>
    </Portal>
  );

  return (
    <View style={styles.container}>
      {/* Search and Filters */}
      <View style={styles.searchBarContainer}>
        <View style={styles.searchBar}>
          <MaterialCommunityIcons name="magnify" size={26} color={colors.textMuted} style={{ marginRight: 8 }} />
          <TextInput
            mode="flat"
            placeholder="Search questions"
            value={search}
            onChangeText={setSearch}
            onSubmitEditing={handleSearchSubmit}
            style={styles.searchInput}
            underlineColor="transparent"
            selectionColor={colors.primary}
            placeholderTextColor={colors.textMuted}
            returnKeyType="search"
            theme={{
              colors: {
                text: colors.text,
                placeholder: colors.textMuted,
                primary: colors.primary,
                background: "transparent",
              },
            }}
            dense={false}
          />
          {search.length > 0 && (
            <IconButton
              icon="close"
              size={22}
              onPress={() => setSearch("")}
              style={styles.clearIcon}
              rippleColor={colors.primary + "22"}
            />
          )}
          <IconButton
            icon="filter-variant"
            size={26}
            onPress={() => setFiltersVisible(true)}
            style={styles.filterIcon}
            rippleColor={colors.primary + "22"}
            accessibilityLabel="Show filters"
          />
        </View>
      </View>
      {/* Popular Tags */}
      <View style={styles.tagsRow}>
        {loadingTags ? (
          <Text style={{ color: colors.textMuted, marginBottom: 10, fontSize: 16 }}>Loading tags...</Text>
        ) : tags.length === 0 ? (
          <Text style={{ color: colors.textMuted, marginBottom: 10, fontSize: 16 }}>No tags found.</Text>
        ) : (
          visibleTags.map((tag) => (
            <Chip
              key={tag.id}
              style={[
                styles.tagChip,
                selectedTags.includes(tag.name) && { backgroundColor: colors.primary },
              ]}
              textStyle={{
                color: selectedTags.includes(tag.name) ? colors.buttonText : colors.text,
                fontWeight: "bold",
                fontSize: 16,
              }}
              selected={selectedTags.includes(tag.name)}
              onPress={() => toggleTag(tag.name)}
              compact={false}
            >
              {tag.name}
            </Chip>
          ))
        )}
        {tags.length > MAX_TAGS_VISIBLE && (
          <Button
            mode="text"
            compact
            onPress={() => setShowAllTags((prev) => !prev)}
            style={{ marginBottom: 10, marginLeft: 4, height: 36, minHeight: 36 }}
            textColor={colors.primary}
            icon={showAllTags ? "chevron-up" : "chevron-down"}
            labelStyle={{ fontSize: 15, fontWeight: "bold" }}
          >
            {showAllTags ? "Show less" : "Show more"}
          </Button>
        )}
      </View>
      {/* New Question Button */}
      <View style={styles.newQuestionButtonWrapper}>
        <Button
          mode="contained"
          icon="plus"
          style={styles.newQuestionButton}
          onPress={() => router.push(`/(protected)/course/${courseId}/more/forum/create`)}
          buttonColor={colors.primary}
          textColor={colors.buttonText}
          labelStyle={{ fontWeight: "bold", fontSize: 16, letterSpacing: 0.5 }}
          contentStyle={{
            flexDirection: "row-reverse",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          New question
        </Button>
      </View>
      {/* List of Questions */}
      {loading && page === 0 ? (
        <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 32 }} />
      ) : (
        <FlatList
          data={questions as ForumQuestionWithProfile[]}
          keyExtractor={(item) => item.id}
          style={{ marginTop: 8 }}
          renderItem={({ item }) => {
            const tagsString = item.tags && item.tags.length > 0
              ? item.tags.map((tag, idx) => (
                  <Text key={tag} style={styles.tagText}>
                    {idx > 0 && <Text style={styles.tagDot}> · </Text>}#{tag}
                  </Text>
                ))
              : null;

            const accepted = hasAcceptedAnswer(item.acceptedAnswerId);

            const hasName =
              (item.authorProfile?.first_name && item.authorProfile.first_name.trim() !== "") ||
              (item.authorProfile?.last_name && item.authorProfile.last_name.trim() !== "");
            const displayName = hasName
              ? `${item.authorProfile.first_name || ""} ${item.authorProfile.last_name || ""}`.trim()
              : item.authorProfile?.user_name || "Unknown";
            const avatarSource =
              item.authorProfile?.banner && item.authorProfile.banner.trim() !== ""
                ? { uri: item.authorProfile.banner }
                : undefined;
            const avatarLabel =
              item.authorProfile?.first_name && item.authorProfile.first_name.length > 0
                ? item.authorProfile.first_name[0]
                : item.authorProfile?.user_name && item.authorProfile.user_name.length > 0
                ? item.authorProfile.user_name[0]
                : "?";

            return (
              <TouchableOpacity
                onPress={() => {
                  router.push(`/(protected)/course/${courseId}/more/forum/${item.id}`)
                }}
                activeOpacity={0.88}
              >
                <View style={[
                  styles.questionBox,
                  accepted && { borderColor: colors.success, borderWidth: 1.5, shadowColor: colors.success }
                ]}>
                  <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 4 }}>
                    {avatarSource ? (
                      <Avatar.Image
                        size={32}
                        source={avatarSource}
                        style={{ backgroundColor: colors.primary, marginRight: 10 }}
                      />
                    ) : (
                      <Avatar.Text
                        size={32}
                        label={avatarLabel}
                        style={{ backgroundColor: colors.primary, marginRight: 10 }}
                        labelStyle={{ color: "#fff", fontWeight: "bold" }}
                      />
                    )}
                    <View style={{ flex: 1 }}>
                      <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <Text style={styles.questionTitleList}>{item.title}</Text>
                        {item.isEdited && (
                          <MaterialCommunityIcons
                            name="pencil"
                            size={16}
                            color={colors.info}
                            style={{ marginLeft: 6 }}
                          />
                        )}
                      </View>
                      <View style={styles.metaRow}>
                        <Text style={styles.questionMeta}>
                          {displayName}
                        </Text>
                        <Text style={styles.questionMeta}>
                          {" · "}
                          {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                        </Text>
                        {item.tags.length > 0 && (
                          <Text style={styles.tagsInline}>
                            {" "}
                            {tagsString}
                          </Text>
                        )}
                        {item.isPinned && (
                          <Text style={{ color: colors.error, fontWeight: "bold", fontSize: 13, marginLeft: 8 }}>
                            <MaterialCommunityIcons name="pin" size={14} color={colors.error} /> Pinned
                          </Text>
                        )}
                        {item.isClosed && (
                          <Text style={{ color: colors.textMuted, fontWeight: "bold", fontSize: 13, marginLeft: 8 }}>
                            <MaterialCommunityIcons name="lock" size={14} color={colors.textMuted} /> Closed
                          </Text>
                        )}
                      </View>
                    </View>
                    <View style={{ alignItems: "center" }}>
                      <MaterialCommunityIcons name="arrow-up-bold" size={14} color={colors.success} />
                      <Text style={styles.voteCountSmall}>{item.upvotes - item.downvotes}</Text>
                      <MaterialCommunityIcons name="arrow-down-bold" size={14} color={colors.error} />
                    </View>
                  </View>
                  <Text style={styles.questionDescPreview} numberOfLines={2}>
                    {item.description}
                  </Text>
                  <View style={{ flexDirection: "row", alignItems: "center", marginTop: 4 }}>
                    <MaterialCommunityIcons name="comment-question-outline" size={16} color={colors.info} style={{ marginRight: 2 }} />
                    <Text style={styles.acceptedMark}>{item.answerCount} answers</Text>
                    {accepted && (
                      <View style={styles.acceptedBadge}>
                        <MaterialCommunityIcons name="check-decagram" size={16} color={colors.success} />
                        <Text style={styles.acceptedBadgeText}>Accepted answer</Text>
                      </View>
                    )}
                  </View>
                </View>
                <View style={{ height: 2 }} />
              </TouchableOpacity>
            );
          }}
          ListEmptyComponent={
            <Text style={{ textAlign: "center", marginTop: 32, color: colors.textMuted, fontSize: 14 }}>
              No questions found.
            </Text>
          }
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.2}
          ListFooterComponent={
            loadingMore ? (
              <Text style={{ textAlign: "center", color: colors.primary, marginVertical: 10, fontSize: 13 }}>
                Loading more...
              </Text>
            ) : null
          }
          showsVerticalScrollIndicator={false}
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      )}
      {renderFiltersModal()}
    </View>
  );
}

export default function ForumScreenWrapper() {
  const { id: courseId } = useLocalSearchParams<{ id: string }>();
  if (!courseId) return null;
  return (
    <ForumQuestionsProvider courseId={String(courseId)}>
      <ForumScreenInner />
    </ForumQuestionsProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 0,
    paddingTop: 0,
  },
  searchBarContainer: {
    paddingHorizontal: 12,
    paddingTop: 18,
    paddingBottom: 0,
    backgroundColor: colors.background,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.inputBackground,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 0,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    minHeight: 52,
    height: 52,
  },
  searchInput: {
    flex: 1,
    backgroundColor: "transparent",
    fontSize: 18,
    color: colors.text,
    paddingVertical: 0,
    minHeight: 44,
    height: 44,
  },
  clearIcon: {
    margin: 0,
    marginLeft: 0,
    marginRight: 0,
    alignSelf: "center",
    height: 38,
    width: 38,
  },
  filterIcon: {
    margin: 0,
    marginLeft: 0,
    alignSelf: "center",
    height: 38,
    width: 38,
  },
  tagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginVertical: 10,
    alignItems: "center",
    paddingHorizontal: 12,
    minHeight: 38,
  },
  tagChip: {
    marginRight: 10,
    marginBottom: 10,
    backgroundColor: colors.inputBackground,
    borderRadius: 12,
    paddingHorizontal: 0,
    elevation: 0,
    height: 38,
    minHeight: 38,
  },
  filterChip: {
    marginRight: 10,
    marginBottom: 10,
    backgroundColor: colors.inputBackground,
    borderRadius: 12,
    elevation: 0,
    height: 38,
    minHeight: 38,
  },
  newQuestionButtonWrapper: {
    alignItems: "center",
    marginVertical: 16,
  },
  newQuestionButton: {
    borderRadius: 6,
    paddingHorizontal: 0,
    paddingVertical: 0,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    justifyContent: "center",
    alignItems: "center",
  },
  questionBox: {
    backgroundColor: colors.cardBackground,
    borderRadius: 10,
    padding: 14,
    marginBottom: 14,
    elevation: 2,
  },
  questionTitleList: { fontWeight: "bold", fontSize: 16, color: colors.text },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    marginTop: 2,
    marginBottom: 2,
  },
  tagsInline: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginLeft: 8,
    marginRight: 4,
    alignItems: "center",
    fontSize: 13,
  },
  tagText: {
    color: "#3b5bb6",
    fontWeight: "bold",
    fontSize: 13,
  },
  tagDot: {
    color: colors.textMuted,
    fontWeight: "bold",
    fontSize: 13,
  },
  questionMeta: { color: colors.textMuted, fontSize: 13 },
  acceptedMark: { color: colors.success, fontWeight: "bold", fontSize: 13 },
  questionDescPreview: { fontSize: 14, color: colors.text, opacity: 0.85, marginBottom: 2 },
  voteCountSmall: { fontWeight: "bold", fontSize: 13, color: colors.text },
  acceptedBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#eafaf1",
    borderRadius: 8,
    paddingHorizontal: 8,
    marginLeft: 10,
    height: 22,
  },
  acceptedBadgeText: {
    color: colors.success,
    fontWeight: "bold",
    fontSize: 12,
    marginLeft: 4,
  },
  modalContainer: {
    backgroundColor: colors.cardBackground,
    padding: 24,
    marginHorizontal: 24,
    borderRadius: 16,
    elevation: 6,
    minWidth: 260,
    minHeight: 120,
  },
  modalTitle: {
    fontWeight: "bold",
    fontSize: 18,
    color: colors.primary,
    marginBottom: 18,
    textAlign: "center",
  },
  applyFilterButton: {
    marginTop: 8,
    borderRadius: 8,
    alignSelf: "center",
    paddingHorizontal: 24,
    paddingVertical: 6,
  },
});