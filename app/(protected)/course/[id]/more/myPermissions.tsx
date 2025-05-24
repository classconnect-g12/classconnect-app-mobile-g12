import { useCourse } from "@context/CourseContext";
import { View, Text, StyleSheet } from "react-native";
import {
  PERMISSION_LABELS,
  ASSISTANT_PERMISSIONS,
} from "@constants/permissions";

export default function MyPermissions() {
  const { courseDetail } = useCourse();
  const { course } = courseDetail;

  const enabledPermissions = ASSISTANT_PERMISSIONS.filter((permission) =>
    course.permissions.includes(permission)
  );

  const disabledPermissions = ASSISTANT_PERMISSIONS.filter(
    (permission) => !course.permissions.includes(permission)
  );

  const renderPermission = (permission: string, isEnabled: boolean) => (
    <View key={permission} style={styles.permissionItem}>
      <Text style={styles.permissionLabel}>
        {PERMISSION_LABELS[permission] || permission}
      </Text>
      <View style={[styles.tag, isEnabled ? styles.enabled : styles.disabled]}>
        <Text style={styles.tagText}>{isEnabled ? "ENABLED" : "DISABLED"}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {enabledPermissions.length > 0 && (
        <View>
          <Text style={styles.sectionTitle}>Enabled Permissions</Text>
          {enabledPermissions.map((permission) =>
            renderPermission(permission, true)
          )}
        </View>
      )}

      {disabledPermissions.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Disabled Permissions</Text>
          {disabledPermissions.map((permission) =>
            renderPermission(permission, false)
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  section: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  permissionItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
    paddingVertical: 4,
  },
  permissionLabel: {
    fontSize: 16,
    flex: 1,
  },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  enabled: {
    backgroundColor: "#28a745",
  },
  disabled: {
    backgroundColor: "#d73a49",
  },
  tagText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 12,
  },
});
