import { useEffect, useState } from "react";
import {
  SectionList,
  View,
  TouchableOpacity,
  Image,
  Modal,
  ScrollView,
} from "react-native";
import {
  Text,
  ActivityIndicator,
  IconButton,
  Portal,
  Button,
  Checkbox,
} from "react-native-paper";
import { router } from "expo-router";
import {
  getAcceptedMembers,
  addAssistantToCourse,
  removeAssistantFromCourse,
  removeStudentFromCourse,
} from "@services/EnrollmentService";
import { membersStyles as styles } from "@styles/membersStyles";
import { useCourse } from "@context/CourseContext";
import { useSnackbar } from "@context/SnackbarContext";
import { SNACKBAR_VARIANTS } from "@constants/snackbarVariants";
import {
  ASSISTANT_PERMISSIONS,
  PERMISSION_LABELS,
} from "@constants/permissions";
import { handleApiError } from "@utils/handleApiError";
import { useAuth } from "@context/authContext";

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
  const { courseId, isTeacher } = useCourse();
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(false);
  const [promoting, setPromoting] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const { logout } = useAuth();

  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [permissionsModalVisible, setPermissionsModalVisible] = useState(false);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  const [studentToRemove, setStudentToRemove] = useState<Member | null>(null);
  const [confirmRemoveStudentVisible, setConfirmRemoveStudentVisible] =
    useState(false);
  const [removingStudent, setRemovingStudent] = useState(false);

  const [confirmRemoveModalVisible, setConfirmRemoveModalVisible] =
    useState(false);
  const [memberToRemove, setMemberToRemove] = useState<Member | null>(null);

  const { showSnackbar } = useSnackbar();

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
      handleApiError(error, showSnackbar, "Error fetching members", logout);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [courseId]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchMembers();
    setRefreshing(false);
  };

  const handlePromoteToAssistant = (member: Member) => {
    setSelectedMember(member);
    setSelectedPermissions([]);
    setPermissionsModalVisible(true);
  };

  const handleDemoteAssistant = (member: Member) => {
    setMemberToRemove(member);
    setConfirmRemoveModalVisible(true);
  };

  const confirmPromoteToAssistant = async () => {
    if (!selectedMember || !courseId) return;

    setPromoting(true);
    try {
      await addAssistantToCourse({
        courseId,
        assistantId: selectedMember.userProfile.id,
        permissions: selectedPermissions,
      });

      showSnackbar(
        `${selectedMember.userProfile.user_name} promoted to assistant`,
        SNACKBAR_VARIANTS.SUCCESS
      );

      await fetchMembers();
    } catch (error) {
      handleApiError(
        error,
        showSnackbar,
        `Failed to promote ${selectedMember.userProfile.user_name}`,
        logout
      );
    } finally {
      setPromoting(false);
      setPermissionsModalVisible(false);
      setSelectedMember(null);
    }
  };

  const confirmRemoveAssistant = async () => {
    if (!memberToRemove || !courseId) return;

    setRemoving(true);
    try {
      await removeAssistantFromCourse(courseId, memberToRemove.userProfile.id);

      showSnackbar(
        `${memberToRemove.userProfile.user_name} removed from assistants`,
        SNACKBAR_VARIANTS.SUCCESS
      );

      await fetchMembers();
    } catch (error) {
      handleApiError(
        error,
        showSnackbar,
        `Failed to remove ${memberToRemove.userProfile.user_name}`,
        logout
      );
    } finally {
      setRemoving(false);
      setConfirmRemoveModalVisible(false);
      setMemberToRemove(null);
    }
  };

  const handleRemoveStudent = (member: Member) => {
    setStudentToRemove(member);
    setConfirmRemoveStudentVisible(true);
  };

  const confirmRemoveStudent = async () => {
    if (!studentToRemove || !courseId) return;

    setRemovingStudent(true);
    try {
      await removeStudentFromCourse(courseId, studentToRemove.userProfile.id);

      showSnackbar(
        `${studentToRemove.userProfile.user_name} removed from course`,
        SNACKBAR_VARIANTS.SUCCESS
      );

      await fetchMembers();
    } catch (error) {
      handleApiError(
        error,
        showSnackbar,
        `Failed to remove ${studentToRemove.userProfile.user_name}`,
        logout
      );
    } finally {
      setRemovingStudent(false);
      setConfirmRemoveStudentVisible(false);
      setStudentToRemove(null);
    }
  };

  const renderMember = ({ item }: { item: Member }) => {
    const profile = item.userProfile;
    const fullName =
      [profile.first_name, profile.last_name].filter(Boolean).join(" ") ||
      profile.user_name;

    const isAssistant = item.createdByRole === "ASSISTANT";
    const isStudent = item.createdByRole === "STUDENT";

    return (
      <TouchableOpacity
        onPress={() => router.push(`/profile/${profile.user_name}`)}
        style={styles.memberItem}
      >
        <Image
          source={
            profile.banner
              ? { uri: profile.banner }
              : isAssistant
              ? require("@assets/images/default-assistant.png")
              : item.createdByRole === "TEACHER"
              ? require("@assets/images/default-assistant.png")
              : require("@assets/images/default-student.png")
          }
          style={styles.avatar}
        />
        <View style={styles.memberInfo}>
          <Text style={styles.name}>{fullName}</Text>
          <Text variant="bodyMedium" style={styles.username}>
            @{profile.user_name}
          </Text>
        </View>

        {isTeacher && (
          <View style={styles.actions}>
            {isAssistant && (
              <IconButton
                icon="account-remove"
                iconColor="#d32f2f"
                onPress={() => handleDemoteAssistant(item)}
              />
            )}
            {isStudent && (
              <>
                <IconButton
                  icon="account-arrow-up"
                  iconColor="#388e3c"
                  onPress={() => handlePromoteToAssistant(item)}
                />
                <IconButton
                  icon="account-remove"
                  iconColor="#d32f2f"
                  onPress={() => handleRemoveStudent(item)}
                />
              </>
            )}
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
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
          refreshing={refreshing}
          onRefresh={handleRefresh}
        />
      )}

      <Portal>
        {permissionsModalVisible && (
          <View style={styles.modalOverlay}>
            <View style={styles.modalBox}>
              <Text style={styles.modalTitle}>Promote to assistant</Text>
              <Text style={styles.modalSubTitle}>Select Permissions</Text>

              <ScrollView
                style={styles.scrollContainer}
                contentContainerStyle={{ paddingBottom: 4 }}
              >
                {ASSISTANT_PERMISSIONS.map((permission) => (
                  <View key={permission} style={styles.permissionItem}>
                    <Checkbox
                      status={
                        selectedPermissions.includes(permission)
                          ? "checked"
                          : "unchecked"
                      }
                      onPress={() => {
                        setSelectedPermissions((prev) =>
                          prev.includes(permission)
                            ? prev.filter((p) => p !== permission)
                            : [...prev, permission]
                        );
                      }}
                    />
                    <Text style={styles.permissionLabel}>
                      {PERMISSION_LABELS[permission] ?? permission}
                    </Text>
                  </View>
                ))}
              </ScrollView>
              <Button
                mode="outlined"
                onPress={() => {
                  if (
                    selectedPermissions.length === ASSISTANT_PERMISSIONS.length
                  ) {
                    setSelectedPermissions([]);
                  } else {
                    setSelectedPermissions([...ASSISTANT_PERMISSIONS]);
                  }
                }}
                style={styles.selectButton}
              >
                {selectedPermissions.length === ASSISTANT_PERMISSIONS.length
                  ? "Deselect All"
                  : "Select All"}
              </Button>
              <View style={{ flexDirection: "row-reverse" }}>
                <Button
                  mode="contained"
                  onPress={confirmPromoteToAssistant}
                  disabled={promoting}
                  loading={promoting}
                  style={styles.confirmButton}
                >
                  Promote
                </Button>

                <Button
                  onPress={() => setPermissionsModalVisible(false)}
                  style={styles.cancelButton}
                >
                  Cancel
                </Button>
              </View>
            </View>
          </View>
        )}
      </Portal>

      <Portal>
        <Modal
          visible={confirmRemoveModalVisible}
          transparent
          onRequestClose={() => setConfirmRemoveModalVisible(false)}
          animationType="fade"
        >
          <View style={styles.modalOverlay}>
            <View style={styles.confirmModalBox}>
              <Text style={styles.modalTitle}>
                Are you sure you want to remove assistant{" "}
                <Text style={{ fontWeight: "bold" }}>
                  {memberToRemove?.userProfile.user_name}
                </Text>
                ?
              </Text>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "flex-end",
                  marginTop: 20,
                }}
              >
                <Button
                  onPress={() => setConfirmRemoveModalVisible(false)}
                  style={{ marginRight: 10 }}
                >
                  Cancel
                </Button>
                <Button
                  mode="contained"
                  onPress={confirmRemoveAssistant}
                  disabled={removing}
                  loading={removing}
                  style={styles.confirmButtonRemove}
                >
                  Remove
                </Button>
              </View>
            </View>
          </View>
        </Modal>
      </Portal>

      <Portal>
        <Modal
          visible={confirmRemoveStudentVisible}
          transparent
          onRequestClose={() => setConfirmRemoveStudentVisible(false)}
          animationType="fade"
        >
          <View style={styles.modalOverlay}>
            <View style={styles.confirmModalBox}>
              <Text style={styles.modalTitle}>
                Are you sure you want to remove student{" "}
                <Text style={{ fontWeight: "bold" }}>
                  {studentToRemove?.userProfile.user_name}
                </Text>
                ?
              </Text>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "flex-end",
                  marginTop: 20,
                }}
              >
                <Button
                  onPress={() => setConfirmRemoveStudentVisible(false)}
                  style={{ marginRight: 10 }}
                >
                  Cancel
                </Button>
                <Button
                  mode="contained"
                  onPress={confirmRemoveStudent}
                  disabled={removingStudent}
                  loading={removingStudent}
                  style={styles.confirmButtonRemove}
                >
                  Remove
                </Button>
              </View>
            </View>
          </View>
        </Modal>
      </Portal>
    </View>
  );
}
