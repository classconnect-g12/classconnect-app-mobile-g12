import { View, Text, Modal, TextInput, Button, Alert } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { viewModulesStyles } from "@styles/viewModulesStyles";
import { useState } from "react";
import { AnimatedFAB, RadioButton } from "react-native-paper";
import { colors } from "@theme/colors";
import * as DocumentPicker from "expo-document-picker";
import { createResource } from "@services/ModuleService";
import { moduleDetailStyle } from "@styles/moduleDetailStyle";
import { handleApiError } from "@utils/handleApiError";
import { AppSnackbar } from "@components/AppSnackbar";
import { useSnackbar } from "@hooks/useSnackbar";
import { SNACKBAR_VARIANTS } from "../../../../../src/constants/snackbarVariants";

export default function ModulePage() {
  const {
    snackbarVisible,
    snackbarMessage,
    snackbarVariant,
    showSnackbar,
    hideSnackbar,
  } = useSnackbar();
  const { id, moduleId } = useLocalSearchParams<{
    id: string;
    moduleId: string;
  }>();
  const [modalVisible, setModalVisible] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    resource_type: "DOCUMENT",
    order: "1",
    file: null as DocumentPicker.DocumentPickerResult | null,
  });

  // Manejar la selección de archivo
  const pickFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*",
        copyToCacheDirectory: true,
      });
      if ("canceled" in result && !result.canceled) {
        setFormData({ ...formData, file: result });
      }
    } catch (error) {
      showSnackbar("Can't select the file", SNACKBAR_VARIANTS.ERROR);
    }
  };

  // Manejar el envío del formulario
  const handleSubmit = async () => {
    if (!formData.title || !formData.order || !formData.file) {
      showSnackbar("Complete all the required fields", SNACKBAR_VARIANTS.ERROR);
      return;
    }

    // Validar que order sea un número entero positivo
    const orderNum = parseInt(formData.order, 10);
    if (isNaN(orderNum) || orderNum < 1) {
      showSnackbar(
        "The order must be a positive number",
        SNACKBAR_VARIANTS.ERROR
      );
      return;
    }

    try {
      await createResource(
        id,
        moduleId,
        formData.title,
        formData.resource_type,
        formData.order,
        formData.file
      );
    } catch (error) {
      handleApiError(error, showSnackbar, "Error creating resource");
    } finally {
      setModalVisible(false);
      setFormData({
        title: "",
        resource_type: "DOCUMENT",
        order: "1",
        file: null as DocumentPicker.DocumentPickerResult | null,
      });
    }
  };

  return (
    <View style={viewModulesStyles.container}>
      <Text>Course ID: {id}</Text>
      <Text>Module ID: {moduleId}</Text>

      {/* Modal para el formulario */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={moduleDetailStyle.modalContainer}>
          <View style={moduleDetailStyle.modalContent}>
            <Text style={moduleDetailStyle.modalTitle}>
              Create new resource
            </Text>

            {/* Campo: Título */}
            <TextInput
              style={moduleDetailStyle.input}
              placeholder="Resource Title"
              value={formData.title}
              onChangeText={(text) => setFormData({ ...formData, title: text })}
            />

            {/* Campo: Tipo de recurso */}
            <Text>Resource Type</Text>
            <RadioButton.Group
              onValueChange={(value) =>
                setFormData({ ...formData, resource_type: value })
              }
              value={formData.resource_type}
            >
              <View style={moduleDetailStyle.radioOption}>
                <RadioButton value="DOCUMENT" />
                <Text>Document</Text>
              </View>
              <View style={moduleDetailStyle.radioOption}>
                <RadioButton value="VIDEO" />
                <Text>Video</Text>
              </View>
              <View style={moduleDetailStyle.radioOption}>
                <RadioButton value="IMAGE" />
                <Text>Image</Text>
              </View>
              <View style={moduleDetailStyle.radioOption}>
                <RadioButton value="AUDIO" />
                <Text>Audio</Text>
              </View>
            </RadioButton.Group>

            {/* Campo: Orden */}
            <TextInput
              style={moduleDetailStyle.input}
              placeholder="Order"
              keyboardType="numeric"
              value={formData.order}
              onChangeText={(text) => setFormData({ ...formData, order: text })}
            />

            {/* Campo: Archivo */}
            <Button title="Select File" onPress={pickFile} />
            {formData.file &&
              "canceled" in formData.file &&
              !formData.file.canceled && (
                <Text>Selected file: {formData.file.assets[0].name}</Text>
              )}

            {/* Botones */}
            <View style={moduleDetailStyle.modalButtons}>
              <Button title="Cancel" onPress={() => setModalVisible(false)} />
              <Button title="Create" onPress={handleSubmit} />
            </View>
          </View>
        </View>
      </Modal>

      {/* Botón FAB */}
      <AnimatedFAB
        icon="plus"
        label=""
        extended={false}
        onPress={() => setModalVisible(true)}
        style={viewModulesStyles.fab}
        visible
        animateFrom="right"
        color={colors.buttonText}
      />
      <AppSnackbar
        visible={snackbarVisible}
        message={snackbarMessage}
        onDismiss={hideSnackbar}
        variant={snackbarVariant}
      />
    </View>
  );
}
