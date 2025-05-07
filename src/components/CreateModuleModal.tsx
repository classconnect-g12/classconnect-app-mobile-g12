import { colors } from "@theme/colors";
import React from "react";
import { Button, Modal, TextInput } from "react-native-paper";

type Props = {
  visible: boolean;
  onDismiss: () => void;
  title: string;
  setTitle: (text: string) => void;
  description: string;
  setDescription: (text: string) => void;
  order: string;
  setOrder: (text: string) => void;
  onSubmit: () => void;
};

export const CreateModuleModal: React.FC<Props> = ({
  visible,
  onDismiss,
  title,
  setTitle,
  description,
  setDescription,
  order,
  setOrder,
  onSubmit,
}) => {
  return (
    <Modal
      visible={visible}
      onDismiss={onDismiss}
      contentContainerStyle={{
        backgroundColor: "white",
        padding: 20,
        margin: 20,
        borderRadius: 8,
      }}
    >
      <TextInput
        label="Título"
        value={title}
        onChangeText={setTitle}
        mode="outlined"
        style={{ marginBottom: 10 }}
      />
      <TextInput
        label="Descripción"
        value={description}
        onChangeText={setDescription}
        mode="outlined"
        style={{ marginBottom: 10 }}
      />
      <TextInput
        label="Orden"
        value={order}
        onChangeText={setOrder}
        mode="outlined"
        keyboardType="numeric"
        style={{ marginBottom: 10 }}
      />
      <Button
        mode="contained"
        style={{ backgroundColor: colors.primary }}
        onPress={onSubmit}
      >
        Crear módulo
      </Button>
    </Modal>
  );
};
