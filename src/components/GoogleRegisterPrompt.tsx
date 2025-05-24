import React from "react";
import { Modal, View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { TextInput } from "react-native-paper";
import { colors } from "@theme/colors";
import { signInStyles as styles } from "@styles/signInStyles";
import { validateUsername } from "@utils/validators";



export function GoogleRegisterPrompt({
  visible,
  onClose,
  username,
  setUsername,
  isLoading,
  onRegister,
}: {
  visible: boolean;
  onClose: () => void;
  username: string;
  setUsername: (v: string) => void;
  isLoading: boolean;
  onRegister: () => void;
}) {
    
  const [error, setError] = React.useState<string | null>(null);

    React.useEffect(() => {
        if (!visible) setError(null);
    }, [visible]);

  const handleRegister = () => {
    const validation = validateUsername(username);
    if (validation) {
      setError(validation);
      return;
    }
    setError(null);
    onRegister();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.4)",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View
          style={{
            backgroundColor: colors.background,
            borderRadius: 16,
            padding: 28,
            width: "88%",
            alignItems: "center",
            shadowColor: "#000",
            shadowOpacity: 0.15,
            shadowRadius: 8,
            elevation: 8,
          }}
        >
          <Text
            style={{
              fontWeight: "bold",
              fontSize: 20,
              marginBottom: 10,
              color: colors.primary,
              textAlign: "center",
            }}
          >
            Complete your registration
          </Text>
          <Text
            style={{
              color: colors.text,
              fontSize: 15,
              marginBottom: 18,
              textAlign: "center",
            }}
          >
            Choose a username to finish creating your account.
          </Text>
          <TextInput
            style={styles.input}
            label="Username"
            mode="outlined"
            theme={{ colors: { primary: colors.secondary } }}
            value={username}
            onChangeText={text => {
              setUsername(text);
              setError(null);
            }}
            autoCapitalize="none"
            editable={!isLoading}
            disabled={isLoading}
            error={!!error}
          />
          {error && (
            <Text style={{ color: colors.error, marginBottom: 8, marginTop: -8 }}>
              {error}
            </Text>
          )}
          <TouchableOpacity
            style={{
              backgroundColor: colors.primary,
              borderRadius: 8,
              paddingVertical: 12,
              width: "100%",
              alignItems: "center",
              marginBottom: 8,
              opacity: isLoading ? 0.7 : 1,
            }}
            onPress={handleRegister}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={colors.buttonText} />
            ) : (
              <Text style={{ color: colors.buttonText, fontWeight: "bold", fontSize: 16 }}>
                Register with Google
              </Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              marginTop: 4,
              paddingVertical: 8,
              width: "100%",
              alignItems: "center",
            }}
            onPress={onClose}
            disabled={isLoading}
          >
            <Text style={{ color: colors.secondary, fontWeight: "bold", fontSize: 15 }}>
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

