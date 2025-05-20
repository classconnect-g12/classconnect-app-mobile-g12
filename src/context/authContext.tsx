import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NotificationContext } from "./notificationContext";

type AuthContextType = {
  isAuthenticated: boolean;
  username: string | null;
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState<string | null>(null);

  const notificationContext = useContext(NotificationContext);

  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem("token");
      const storedUsername = await AsyncStorage.getItem("username");
      setIsAuthenticated(!!token);
      setUsername(storedUsername);
    };
    checkAuth();
  }, []);

  const decodeToken = (token: string) => {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );

    return JSON.parse(jsonPayload);
  };

  const login = async (token: string) => {
    await AsyncStorage.setItem("token", token);
    const decodedToken = decodeToken(token);

    const userId = decodedToken.user_id;
    const username = decodedToken.user_name;

    await AsyncStorage.setItem("userId", userId.toString());
    await AsyncStorage.setItem("username", username);

    setIsAuthenticated(true);
    setUsername(username);
  };

  const logout = async () => {
    await AsyncStorage.multiRemove(["token", "userId", "username"]);
    setIsAuthenticated(false);
    setUsername(null);
    if (notificationContext) {
      notificationContext.setNotifications([]);
      notificationContext.setHasNewNotifications(false);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, username, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

export default AuthContext;
