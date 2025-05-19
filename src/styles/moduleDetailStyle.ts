import { StyleSheet } from "react-native";

export const moduleDetailStyle = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginVertical: 8,
    borderRadius: 5,
  },
  radioOption: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 4,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 16,
  },
  resourceList: {
    marginTop: 16,
  },
  resourceItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  resourceTitle: {
    fontSize: 16,
    fontWeight: "500",
  },
  resourceType: {
    fontSize: 14,
    color: "#666",
  },
  noResources: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  resourceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    padding: 16,
    paddingBottom: 32,
    marginBottom: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  iconWrapper: {
    backgroundColor: "gray",
    padding: 10,
    borderRadius: 24,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  typeText: {
    fontSize: 13,
    color: "#6b7280",
    marginTop: 2,
  },
  instruction: {
    fontSize: 14,
    color: "#374151",
    marginTop: 8,
    textAlign: "justify",
  },
  image: {
    width: "100%",
    height: 180,
    marginTop: 12,
    borderRadius: 8,
  },
  audioText: {
    marginTop: 10,
    fontStyle: "italic",
    color: "#4b5563",
  },
  footer: {
    textAlign: "right",
    marginTop: 16,
    fontSize: 18,
    fontWeight: "bold",
    color: "gray"
  }
});
