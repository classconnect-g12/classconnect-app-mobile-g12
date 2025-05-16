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
  loading?: boolean;
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
  loading,
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
        label="Title"
        value={title}
        onChangeText={setTitle}
        mode="outlined"
        style={{ marginBottom: 10 }}
      />
      <TextInput
        label="Description"
        value={description}
        onChangeText={setDescription}
        mode="outlined"
        style={{ marginBottom: 10 }}
      />
      <TextInput
        label="Order"
        value={order}
        onChangeText={setOrder}
        mode="outlined"
        keyboardType="numeric"
        style={{ marginBottom: 10 }}
      />
      <Button
        mode="contained"
        style={{ backgroundColor: colors.primary, borderRadius: 6 }}
        onPress={onSubmit}
        disabled={loading}
        loading={loading}
      >
        Create module
      </Button>
    </Modal>
  );
};
