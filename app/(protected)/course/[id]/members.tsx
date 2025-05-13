import { useEffect, useState } from "react";
import { FlatList, View, TouchableOpacity, Image } from "react-native";
import { Text, ActivityIndicator } from "react-native-paper";
import { router } from "expo-router";
import { getAcceptedMembers } from "@services/EnrollmentService";
import { membersStyles as styles } from "@styles/membersStyles";
import { useCourse } from "@context/CourseContext";

type Member = {
  enrollmentId: number;
  enrolleeId: number;
  createdByRole: string;
  userProfile: {
    id: number;
    user_name: string;
    first_name: string;
    last_name: string;
    email: string;
    banner: string;
  };
};

export default function Members() {
  const { courseId } = useCourse();
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMembers = async () => {
      if (!courseId) return;

      try {
        setLoading(true);
        const response = await getAcceptedMembers(courseId);
        const validMembers = response.enrollments.filter(
          (m: Member) => m.userProfile.user_name?.trim() !== ""
        );
        setMembers(validMembers);
      } catch (error) {
        console.error("Error fetching members:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, [courseId]);

  const renderMember = ({ item }: { item: Member }) => {
    const profile = item.userProfile;
    const fullName =
      [profile.first_name, profile.last_name].filter(Boolean).join(" ") ||
      profile.user_name;

    const roleText =
      item.createdByRole === "ASSISTANT" ? "ASSISTANT" : "STUDENT";

    return (
      <TouchableOpacity
        onPress={() => router.push(`/profile/${profile.user_name}`)}
        style={styles.memberItem}
      >
        <Image
          source={
            profile.banner
              ? { uri: profile.banner }
              : item.createdByRole === "ASSISTANT"
              ? require("@assets/images/default-assistant.png")
              : require("@assets/images/default-student.png")
          }
          style={styles.avatar}
        />
        <View style={styles.memberInfo}>
          <Text variant="titleLarge" style={styles.name}>
            {fullName}
          </Text>
          <Text variant="bodyMedium" style={styles.username}>
            @{profile.user_name}
          </Text>
          <Text variant="labelSmall" style={styles.role}>
            {roleText}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator style={{ marginTop: 20 }} />
      ) : members.length === 0 ? (
        <Text style={{ marginTop: 20, textAlign: "center" }}>
          No students enrolled yet.
        </Text>
      ) : (
        <FlatList
          data={members}
          renderItem={renderMember}
          keyExtractor={(item) => String(item.enrollmentId)}
        />
      )}
    </View>
  );
}
