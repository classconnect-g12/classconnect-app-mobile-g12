import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { useCourse } from "@context/CourseContext";
import { useSnackbar } from "@context/SnackbarContext";
import { useAuth } from "@context/authContext";
import { deleteCourse } from "@services/CourseService";
import { handleApiError } from "@utils/handleApiError";
import { SNACKBAR_VARIANTS } from "@constants/snackbarVariants";
import { colors } from "@theme/colors";
import { Button } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import { settingsStyles as styles } from "@styles/settingsStyle";
import { DELETE_COURSE, EDIT_COURSE } from "@constants/permissions";

export default function Settings() {
  const { courseId } = useCourse();
  const { courseDetail } = useCourse();
  const { course } = courseDetail;
  const { permissions } = course;
  const { showSnackbar } = useSnackbar();
  const { logout } = useAuth();
  const router = useRouter();

  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const canEditCourse = permissions.includes(EDIT_COURSE);
  const canDeleteCourse = permissions.includes(DELETE_COURSE);

  const handleEdit = () => {
    router.push(`/course/editCourse/${courseId}`);
  };

  const handleConfirmDelete = async () => {
    if (!courseId) {
      showSnackbar("Invalid course ID", SNACKBAR_VARIANTS.ERROR);
      return;
    }
    setLoading(true);
    try {
      await deleteCourse(courseId);
      showSnackbar("Course deleted successfully", SNACKBAR_VARIANTS.SUCCESS);
      router.replace("/(protected)/course/myCourses");
    } catch (error) {
      handleApiError(
        error,
        showSnackbar,
        "An error occurred while deleting the course",
        logout
      );
    } finally {
      setLoading(false);
      setShowModal(false);
    }
  };

  const hasAnyPermission = canEditCourse || canDeleteCourse;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Manage your course configuration and administrative options.
      </Text>

      {hasAnyPermission ? (
        <>
          {canEditCourse && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>General</Text>
              <Button
                mode="contained"
                onPress={handleEdit}
                style={styles.button}
                icon="pencil"
              >
                Edit course
              </Button>
            </View>
          )}

          {canDeleteCourse && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Danger Zone</Text>
              <Button
                mode="contained"
                onPress={() => setShowModal(true)}
                buttonColor={colors.error}
                style={styles.deleteButton}
                icon={({ size, color }) => (
                  <MaterialIcons
                    name="delete-forever"
                    size={size}
                    color={color}
                  />
                )}
              >
                Delete course
              </Button>
            </View>
          )}
        </>
      ) : (
        <View style={styles.section}>
          <Text style={styles.noPermissionsText}>
            You do not have permission to access sensitive course data or
            settings.
          </Text>
        </View>
      )}

      <ConfirmDeleteModal
        visible={showModal}
        onCancel={() => setShowModal(false)}
        onConfirm={handleConfirmDelete}
        loading={loading}
      />
    </View>
  );
}

type ConfirmDeleteModalProps = {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  loading: boolean;
};

function ConfirmDeleteModal({
  visible,
  onCancel,
  onConfirm,
  loading,
}: ConfirmDeleteModalProps) {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Confirm deletion</Text>
          <Text style={styles.modalMessage}>
            Are you sure you want to delete this course? This action cannot be
            undone.
          </Text>
          <View style={styles.modalActions}>
            <TouchableOpacity
              onPress={onCancel}
              disabled={loading}
              style={[styles.buttonConfirm, styles.cancelButton]}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onConfirm}
              disabled={loading}
              style={[styles.buttonConfirm, styles.deleteButton]}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.deleteText}>Delete</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
