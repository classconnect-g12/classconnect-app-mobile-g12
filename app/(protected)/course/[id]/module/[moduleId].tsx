import {
  View,
  Text,
  Modal,
  TextInput,
  Button,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { viewModulesStyles } from "@styles/viewModulesStyles";
import { moduleDetailStyle } from "@styles/moduleDetailStyle";
import { useState, useEffect } from "react";
import { AnimatedFAB, RadioButton } from "react-native-paper";
import { colors } from "@theme/colors";
import * as DocumentPicker from "expo-document-picker";
import {
  createResource,
  fetchResources,
  Resource,
} from "@services/ModuleService";
import { handleApiError } from "@utils/handleApiError";
import { AppSnackbar } from "@components/AppSnackbar";
import { useSnackbar } from "@hooks/useSnackbar";
import { SNACKBAR_VARIANTS } from "@constants/snackbarVariants";

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
  const [resources, setResources] = useState<Resource[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    resource_type: "DOCUMENT",
    order: "1",
    file: null as DocumentPicker.DocumentPickerResult | null,
  });

  // Cargar los recursos al montar el componente y después de crear uno nuevo
  const loadResources = async () => {
    try {
      const fetchedResources = await fetchResources(id, moduleId);
      setResources(fetchedResources);
    } catch (error) {
      handleApiError(error, showSnackbar, "Error fetching resources");
    }
  };

  useEffect(() => {
    loadResources();
  }, [id, moduleId]);

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
      showSnackbar("Resource created successfully", SNACKBAR_VARIANTS.SUCCESS);
      await loadResources(); // Recargar los recursos después de crear uno nuevo
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

  // Renderizar cada recurso
  const renderResource = ({ item }: { item: Resource }) => (
    <TouchableOpacity
      style={moduleDetailStyle.resourceItem}
      onPress={() => {
        // Aquí puedes agregar lógica para abrir el recurso (ej. abrir la URL)
        showSnackbar(`Opening ${item.title}`, SNACKBAR_VARIANTS.INFO);
      }}
    >
      <Text style={moduleDetailStyle.resourceTitle}>
        {item.order}. {item.title}
      </Text>
      <Text style={moduleDetailStyle.resourceType}>{item.resourceType}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={viewModulesStyles.container}>
      {/* Lista de recursos */}
      {resources.length > 0 ? (
        <FlatList
          data={resources}
          renderItem={renderResource}
          keyExtractor={(item) => item.resourceId.toString()}
          style={moduleDetailStyle.resourceList}
        />
      ) : (
        <Text style={moduleDetailStyle.noResources}>
          No resources available
        </Text>
      )}

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
                <RadioButton value="DOCUMENT " />
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
