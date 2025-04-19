import { StyleSheet } from "react-native";

export const profileIdStyles = StyleSheet.create({
  scrollContainer: {
    padding: 20,
    alignItems: "center",
    backgroundColor: "#f4f6f8",
    flexGrow: 1,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f4f6f8",
  },
  header: {
    alignItems: "center",
    marginVertical: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: "#ccc",
    backgroundColor: "#e0e0e0",
  },
  userName: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#333",
  },
  inputCard: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 15,
    paddingVertical: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  label: {
    fontSize: 14,
    color: "#555",
    marginBottom: 6,
    fontWeight: "500",
  },
  readOnlyText: {
    fontSize: 16,
    color: "#333",
  },
  email: {
    fontSize: 14,
    color: "#888",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  loadingText: {
    fontSize: 18,
    color: "#333",
    marginTop: 10,
  },
  errorText: {
    fontSize: 18,
    color: "red",
    textAlign: "center",
    paddingHorizontal: 30,
  },
});