import {
  View,
  Text,
  Modal,
  TextInput,
  Button,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { viewModulesStyles } from "@styles/viewModulesStyles";
import { moduleDetailStyle } from "@styles/moduleDetailStyle";
import { useState, useEffect, use } from "react";
import { useCourse } from "@context/CourseContext";
import { AnimatedFAB, IconButton } from "react-native-paper";
import { colors } from "@theme/colors";
import * as DocumentPicker from "expo-document-picker";
import * as WebBrowser from "expo-web-browser";
import { Video, ResizeMode } from "expo-av";
import { Audio } from "expo-av";
import { ActivityIndicator } from "react-native";
import {
  createResource,
  fetchResources,
  Resource,
  fetchModuleById,
  updateModule,
  Module,
} from "@services/ModuleService";
import { handleApiError } from "@utils/handleApiError";
import { AppSnackbar } from "@components/AppSnackbar";
import { useSnackbar } from "@hooks/useSnackbar";
import { SNACKBAR_VARIANTS } from "@constants/snackbarVariants";
import { useAuth } from "@context/authContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useModule } from "@context/ModuleContext";

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
    instruction: "",
    order: "1",
    file: null as DocumentPicker.DocumentPickerResult | null,
  });

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [editedResources, setEditedResources] = useState<
    { ID: number; order: number }[]
  >([]);

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [moduleData, setModuleData] = useState<Module | null>(null);

  const [isSavingModule, setIsSavingModule] = useState(false);

  const isTeacher = useCourse().isTeacher;
  const moduleTitle = useModule().moduleTitle;
  const { logout } = useAuth();

  useEffect(() => {
    loadResources();
  }, [id, moduleId]);

  const loadResources = async () => {
    try {
      const fetchedResources = await fetchResources(id, moduleId);
      setResources(fetchedResources);
      if (fetchedResources.length === 0) {
        showSnackbar("No resources available", SNACKBAR_VARIANTS.INFO);
      }
    } catch (error) {
      showSnackbar("No resources available", SNACKBAR_VARIANTS.INFO);
      //handleApiError(error, showSnackbar, "Error fetching resources", logout);
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

  const handleSubmit = async () => {
    if (
      !formData.title ||
      !formData.order ||
      !formData.file ||
      !formData.instruction
    ) {
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

    setIsSubmitting(true);
    try {
      await createResource(
        id,
        moduleId,
        formData.title,
        formData.instruction,
        formData.order,
        formData.file
      );

      showSnackbar("Resource created successfully", SNACKBAR_VARIANTS.SUCCESS);
      await loadResources();
    } catch (error) {
      handleApiError(error, showSnackbar, "Error creating resource", logout);
    } finally {
      setIsSubmitting(false);
      setModalVisible(false);
      setFormData({
        title: "",
        instruction: "",
        order: "1",
        file: null,
      });
    }
  };

  const handleEditSubmit = async () => {
    if (!moduleData) return;

    if (!moduleData.title.trim()) {
      showSnackbar("Title cannot be empty", SNACKBAR_VARIANTS.ERROR);
      return;
    }

    if (
      moduleData.description.length < 55 ||
      moduleData.description.length > 255
    ) {
      showSnackbar(
        "Description must be between 55 and 255 characters",
        SNACKBAR_VARIANTS.ERROR
      );
      return;
    }

    if (isNaN(moduleData.order) || moduleData.order <= 0) {
      showSnackbar(
        "Order must be a number greater than 0",
        SNACKBAR_VARIANTS.ERROR
      );
      return;
    }

    setIsSavingModule(true);
    try {
      await updateModule(
        id,
        moduleId,
        moduleData.title,
        moduleData.description,
        editedResources
      );
      showSnackbar("Module updated successfully", SNACKBAR_VARIANTS.SUCCESS);
      await loadResources();
      setEditModalVisible(false);
    } catch (e) {
      handleApiError(e, showSnackbar, "Error updating module", logout);
    } finally {
      setIsSavingModule(false);
    }
  };

  const renderResource = ({ item }: { item: Resource }) => {
    const handlePress = async () => {
      switch (item.resourceType) {
        case "IMAGE":
          setSelectedImage(item.url);
          break;
        case "VIDEO":
          setSelectedVideo(item.url);
          break;
        case "DOCUMENT":
          try {
            await WebBrowser.openBrowserAsync(item.url);
            showSnackbar("Opening document...", SNACKBAR_VARIANTS.INFO);
          } catch (e) {
            showSnackbar("Failed to open document", SNACKBAR_VARIANTS.ERROR);
          }
          break;
        case "AUDIO":
          try {
            if (sound) {
              await sound.unloadAsync();
              setSound(null);
              setPlayingAudio(null);
            } else {
              const { sound: newSound } = await Audio.Sound.createAsync({
                uri: item.url,
              });
              setSound(newSound);
              setPlayingAudio(item.resourceId.toString());
              await newSound.playAsync();
            }
          } catch (e) {
            showSnackbar("Error playing audio", SNACKBAR_VARIANTS.ERROR);
          }
          break;
      }
    };

    const getIconName = () => {
      switch (item.resourceType) {
        case "IMAGE":
          return "image";
        case "VIDEO":
          return "video";
        case "DOCUMENT":
          return "file-document";
        case "AUDIO":
          return "music";
        default:
          return "file";
      }
    };

    return (
      <TouchableOpacity onPress={handlePress} style={moduleDetailStyle.card}>
        <View style={moduleDetailStyle.header}>
          <View style={moduleDetailStyle.iconWrapper}>
            <MaterialCommunityIcons
              name={getIconName()}
              size={18}
              color="#fff"
            />
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={moduleDetailStyle.title}>{item.title}</Text>
            <Text style={moduleDetailStyle.typeText}>{item.resourceType}</Text>
          </View>
        </View>
        <Text style={{ textDecorationLine: "underline", fontSize: 16 }}>
          Instructions:
        </Text>
        {item.instruction ? (
          <Text style={moduleDetailStyle.instruction}>{item.instruction}</Text>
        ) : null}

        {item.resourceType === "IMAGE" && (
          <Image
            source={{ uri: item.url }}
            style={moduleDetailStyle.image}
            resizeMode={ResizeMode.CONTAIN}
          />
        )}

        {item.resourceType === "AUDIO" &&
          playingAudio === item.resourceId.toString() && (
            <Text style={moduleDetailStyle.audioText}>Playing audio...</Text>
          )}

        <Text style={moduleDetailStyle.footer}>{item.order}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={viewModulesStyles.container}>
      <Text style={viewModulesStyles.heading}>{moduleTitle}</Text>

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
              placeholder="Title"
              value={formData.title}
              onChangeText={(text) => setFormData({ ...formData, title: text })}
            />

            {/* Campo: Instruction */}
            <TextInput
              style={moduleDetailStyle.input}
              placeholder="Instructions"
              value={formData.instruction}
              onChangeText={(text) =>
                setFormData({ ...formData, instruction: text })
              }
            />

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

            <View style={moduleDetailStyle.modalButtons}>
              <Button
                title="Cancel"
                onPress={() => setModalVisible(false)}
                disabled={isSubmitting}
              />
              {isSubmitting ? (
                <ActivityIndicator
                  size="small"
                  color={colors.primary}
                  style={{ marginTop: 10 }}
                />
              ) : (
                <Button title="Create" onPress={handleSubmit} />
              )}
            </View>
          </View>
        </View>
      </Modal>

      {/* Botones FAB visibles solo para docentes */}
      {isTeacher && (
        <>
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

          <AnimatedFAB
            icon="pencil"
            label=""
            extended={false}
            onPress={async () => {
              try {
                const module = await fetchModuleById(id, moduleId);
                setModuleData(module);
                const initialEditedResources = resources.map((res) => ({
                  ID: res.resourceId,
                  order: res.order,
                }));
                setEditedResources(initialEditedResources);
                setEditModalVisible(true);
              } catch (e) {
                handleApiError(
                  e,
                  showSnackbar,
                  "Error loading module info",
                  logout
                );
              }
            }}
            style={[viewModulesStyles.fab, { right: 80 }]}
            visible
            animateFrom="right"
            color={colors.buttonText}
          />
        </>
      )}
      <AppSnackbar
        visible={snackbarVisible}
        message={snackbarMessage}
        onDismiss={hideSnackbar}
        variant={snackbarVariant}
      />

      {/* Modal de imagen */}
      <Modal
        visible={!!selectedImage}
        transparent={true}
        onRequestClose={() => setSelectedImage(null)}
      >
        <View
          style={{ flex: 1, backgroundColor: "#000", justifyContent: "center" }}
        >
          <TouchableOpacity
            onPress={() => setSelectedImage(null)}
            style={{ flex: 1 }}
          >
            <Image
              source={{ uri: selectedImage! }}
              style={{ width: "100%", height: "100%", resizeMode: "contain" }}
            />
          </TouchableOpacity>
        </View>
      </Modal>
      
      {/* Modal de video */}
      <Modal
        visible={!!selectedVideo}
        transparent={true}
        onRequestClose={() => setSelectedVideo(null)}
      >
        <View
          style={{ flex: 1, backgroundColor: "#000", justifyContent: "center" }}
        >
          <TouchableOpacity
            onPress={() => setSelectedVideo(null)}
            style={{ flex: 1 }}
          >
            <Video
              source={{ uri: selectedVideo! }}
              rate={1.0}
              volume={1.0}
              isMuted={false}
              resizeMode={ResizeMode.CONTAIN}
              useNativeControls
              shouldPlay
              style={{ width: "100%", height: "100%" }}
            />
          </TouchableOpacity>
        </View>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={editModalVisible}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={moduleDetailStyle.modalContainer}>
          <View style={moduleDetailStyle.modalContent}>
            <Text style={moduleDetailStyle.modalTitle}>Edit Module</Text>

            {moduleData && (
              <>
                {/* Título */}
                <TextInput
                  style={moduleDetailStyle.input}
                  placeholder="Module Title"
                  value={moduleData.title}
                  onChangeText={(text) =>
                    setModuleData({ ...moduleData, title: text })
                  }
                />

                {/* Descripción */}
                <TextInput
                  style={moduleDetailStyle.input}
                  placeholder="Module Description"
                  value={moduleData.description}
                  onChangeText={(text) =>
                    setModuleData({ ...moduleData, description: text })
                  }
                />

                {/* Orden */}
                <TextInput
                  style={moduleDetailStyle.input}
                  placeholder="Module Order"
                  keyboardType="numeric"
                  value={moduleData.order.toString()}
                  onChangeText={(text) =>
                    setModuleData({
                      ...moduleData,
                      order: parseInt(text, 10) || 0,
                    })
                  }
                />

                {/* Orden de recursos */}
                <Text style={{ marginTop: 10 }}>Edit Resources Order</Text>
                {editedResources.map((res, index) => (
                  <View
                    key={res.ID}
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 8,
                    }}
                  >
                    <Text style={{ flex: 1 }}>
                      {resources.find((r) => r.resourceId === res.ID)?.title}
                    </Text>
                    <TextInput
                      style={[moduleDetailStyle.input, { width: 60 }]}
                      keyboardType="numeric"
                      value={res.order.toString()}
                      onChangeText={(text) => {
                        const updated = [...editedResources];
                        updated[index].order = parseInt(text, 10) || 0;
                        setEditedResources(updated);
                      }}
                    />
                  </View>
                ))}
                <View style={moduleDetailStyle.modalButtons}>
                  <Button
                    title="Cancel"
                    onPress={() => setEditModalVisible(false)}
                    disabled={isSavingModule}
                  />
                  {isSavingModule ? (
                    <ActivityIndicator
                      size="small"
                      color={colors.primary}
                      style={{ marginTop: 10 }}
                    />
                  ) : (
                    <Button title="Save" onPress={handleEditSubmit} />
                  )}
                </View>
                
                <AppSnackbar
                  visible={snackbarVisible}
                  message={snackbarMessage}
                  onDismiss={hideSnackbar}
                  variant={snackbarVariant}
                />
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}
