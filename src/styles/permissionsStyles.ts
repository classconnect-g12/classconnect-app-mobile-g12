import { StyleSheet } from 'react-native';

export const permissionsStyles = StyleSheet.create({
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