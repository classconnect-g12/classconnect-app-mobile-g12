import { Redirect } from "expo-router";
import { useAuth } from "../src/context/authContext";
import { LogBox } from 'react-native';

LogBox.ignoreAllLogs(true); //Para que no salgan carteles de errores en producción.

export default function Index() {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated === undefined) {
    return null;
  }
  return (
    <Redirect href={isAuthenticated ? "/(protected)/home" : "/(signin)"} />
  );
}
