import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { Chip } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { fetchModules, createModule, Module } from "@services/ModuleService";
import { useCourse } from "@context/CourseContext";
import { viewModulesStyles } from "@styles/viewModulesStyles";
import { handleApiError } from "@utils/handleApiError";
import { useSnackbar } from "@hooks/useSnackbar";
import { AppSnackbar } from "@components/AppSnackbar";
import { colors } from "@theme/colors";
import { AnimatedFAB, Button, Modal, TextInput } from "react-native-paper";
import { CreateModuleModal } from "@components/CreateModuleModal";
import { useAuth } from "@context/authContext";
import { SNACKBAR_VARIANTS } from "@constants/snackbarVariants";
import { useModule } from "@context/ModuleContext";

const CourseModulesScreen = () => {
  const router = useRouter();
  const {
    snackbarVisible,
    snackbarMessage,
    snackbarVariant,
    showSnackbar,
    hideSnackbar,
  } = useSnackbar();
  const { courseId, isTeacher, courseTitle } = useCourse();

  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [order, setOrder] = useState("");

  const [creating, setCreating] = useState(false);

  const { logout } = useAuth();
  const { setModuleTitle } = useModule();

  useEffect(() => {
    const loadModules = async () => {
      try {
        if (courseId) {
          const data = await fetchModules(courseId);
          console.log("Modules data:", data);
          setModules(data);
        }
      } catch (error) {
        showSnackbar("No modules available", SNACKBAR_VARIANTS.INFO);
        //handleApiError(error, showSnackbar, "Error loading modules", logout);
        setModules([]);
      } finally {
        setLoading(false);
      }
    };

    loadModules();
  }, [courseId]);

  const handleAddModule = async () => {
    if (!title.trim()) {
      showSnackbar("Title is required", "error");
      return;
    }

    if (!description.trim()) {
      showSnackbar("Description is required", "error");
      return;
    }

    if (description.length > 255) {
      showSnackbar("Description must be at most 255 characters", "error");
      return;
    }

    const parsedOrder = parseInt(order);
    if (isNaN(parsedOrder) || parsedOrder <= 0) {
      showSnackbar("Order must be a number greater than 0", "error");
      return;
    }

    try {
      setCreating(true);
      await createModule(courseId ?? "", title, description, parsedOrder);
      setModalVisible(false);
      setTitle("");
      setDescription("");
      setOrder("");
      showSnackbar("Module created successfully", "success");

      const updatedModules = await fetchModules(courseId ?? "");
      setModules(updatedModules);
    } catch (error) {
      handleApiError(error, showSnackbar, "Error creating module", logout);
    } finally {
      setCreating(false);
    }
  };

  const renderItem = ({ item }: { item: Module }) => (
    <TouchableOpacity
      onPress={() => {
        setModuleTitle(item.title);
        router.push(`/course/${courseId}/module/${item.moduleId}`);
      }}
    >
      <View style={viewModulesStyles.moduleCard}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <MaterialCommunityIcons
            name="book-open-page-variant"
            size={24}
            color={colors.primary}
            style={{ marginRight: 8 }}
          />
          <Text style={viewModulesStyles.title}>{item.title}</Text>
        </View>
        <Text style={viewModulesStyles.description}>{item.description}</Text>
        <Chip style={viewModulesStyles.order}>{item.order}</Chip>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <ActivityIndicator
        size="large"
        color="#0000ff"
        style={viewModulesStyles.loader}
      />
    );
  }

  return (
    <View style={viewModulesStyles.container}>
      <FlatList
        data={modules}
        keyExtractor={(item) => item.moduleId.toString()}
        renderItem={renderItem}
        contentContainerStyle={viewModulesStyles.list}
        ListEmptyComponent={
          <Text style={viewModulesStyles.empty}>No modules available.</Text>
        }
      />
      <CreateModuleModal
        visible={modalVisible}
        onDismiss={() => setModalVisible(false)}
        title={title}
        setTitle={setTitle}
        description={description}
        setDescription={setDescription}
        order={order}
        setOrder={setOrder}
        onSubmit={handleAddModule}
        loading={creating}
      />

      {isTeacher && (
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
      )}

      <AppSnackbar
        visible={snackbarVisible}
        message={snackbarMessage}
        onDismiss={hideSnackbar}
        variant={snackbarVariant}
      />
    </View>
  );
};

export default CourseModulesScreen;
