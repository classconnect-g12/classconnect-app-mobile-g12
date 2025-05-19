import { useEffect, useState } from "react";
import { SectionList, View, TouchableOpacity, Image } from "react-native";
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

type Section = {
  title: string;
  data: Member[];
};

export default function Members() {
  const { courseId } = useCourse();
  const [sections, setSections] = useState<Section[]>([]);
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

        const grouped: Record<string, Member[]> = {
          TEACHER: [],
          ASSISTANT: [],
          STUDENT: [],
        };

        validMembers.forEach((member: Member) => {
          grouped[member.createdByRole]?.push(member);
        });

        const newSections: Section[] = [];

        if (grouped.TEACHER.length > 0)
          newSections.push({ title: "Teacher", data: grouped.TEACHER });
        if (grouped.ASSISTANT.length > 0)
          newSections.push({ title: "Assistants", data: grouped.ASSISTANT });
        if (grouped.STUDENT.length > 0)
          newSections.push({ title: "Students", data: grouped.STUDENT });

        setSections(newSections);
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
              : item.createdByRole === "TEACHER"
              ? require("@assets/images/default-assistant.png")
              : require("@assets/images/default-student.png")
          }
          style={styles.avatar}
        />
        <View style={styles.memberInfo}>
          <Text style={styles.name}>
            {fullName}
          </Text>
          <Text variant="bodyMedium" style={styles.username}>
            @{profile.user_name}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Members</Text>
      {loading ? (
        <ActivityIndicator style={{ marginTop: 20 }} />
      ) : sections.length === 0 ? (
        <Text style={{ marginTop: 20, textAlign: "center" }}>
          No students enrolled yet.
        </Text>
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={(item) => String(item.enrollmentId)}
          renderItem={renderMember}
          renderSectionHeader={({ section: { title } }) => (
            <Text style={styles.sectionHeader}>{title}</Text>
          )}
        />
      )}
    </View>
  );
}
