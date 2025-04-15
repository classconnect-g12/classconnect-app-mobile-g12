import React, { useState } from "react";
import { Appbar, Menu } from "react-native-paper";
import { useRouter } from "expo-router";
import { useAuth } from "../context/authContext";

interface AppbarMenuProps {
  title: string;
}

const AppbarMenu: React.FC<AppbarMenuProps> = ({ title }) => {
  const { logout } = useAuth();
  const router = useRouter();
  const [menuVisible, setMenuVisible] = useState(false);

  const handleLogout = async () => {
    setMenuVisible(false);
    await logout();
    router.replace("/login");
  };

  const handleMyProfile = () => {
    setMenuVisible(false);
    router.push("./profile/profileEdit");
  };

  return (
    <Appbar.Header
      style={{ backgroundColor: "rgba(255,255,255,0.95)", elevation: 4 }}
    >
      <Appbar.Content title={title} titleStyle={{ opacity: 0.6 }} />
      <Menu
        visible={menuVisible}
        onDismiss={() => setMenuVisible(false)}
        anchor={
          <Appbar.Action
            icon="dots-vertical"
            onPress={() => setMenuVisible(true)}
          />
        }
      >
        <Menu.Item
          onPress={handleMyProfile}
          title="My Profile"
          titleStyle={{ fontWeight: "bold" }}
        />
        <Menu.Item
          onPress={handleLogout}
          title="Log out"
          titleStyle={{ fontWeight: "bold", color: "#d9534f" }}
        />
      </Menu>
    </Appbar.Header>
  );
};

export default AppbarMenu;
