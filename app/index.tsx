import { Redirect } from "expo-router";
import { useAuth } from "./context/authContext";

export default function Index() {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated === undefined) {
    return null;
  }
  return (
    <Redirect href={isAuthenticated ? "/(protected)/home" : "/(signing)"} />
  );
}
