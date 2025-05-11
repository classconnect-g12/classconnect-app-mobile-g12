import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { fetchModules, createModule, Module } from "@services/ModuleService";
import { useCourse } from "@context/CourseContext";
import { viewModulesStyles } from "@styles/viewModulesStyles";
import { handleApiError } from "@utils/handleApiError";
import { useSnackbar } from "@hooks/useSnackbar";
import { AppSnackbar } from "@components/AppSnackbar";
import { colors } from "@theme/colors";
import { AnimatedFAB, Button, Modal, TextInput } from "react-native-paper";
import { CreateModuleModal } from "@components/CreateModuleModal";

const CourseModulesScreen = () => {
  const router = useRouter();
  const {
    snackbarVisible,
    snackbarMessage,
    snackbarVariant,
    showSnackbar,
    hideSnackbar,
  } = useSnackbar();
  const { courseId, isTeacher } = useCourse();

  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [order, setOrder] = useState("");

  useEffect(() => {
    const loadModules = async () => {
      try {
        if (courseId) {
          const data = await fetchModules(courseId);
          console.log("Modules data:", data);
          setModules(data);
        }
      } catch (error) {
        handleApiError(error, showSnackbar, "Error loading modules");
        setModules([]);
      } finally {
        setLoading(false);
      }
    };

    loadModules();
  }, [courseId]);

  const handleAddModule = async () => {
    await createModule(courseId ?? "", title, description, parseInt(order));
    setModalVisible(false);
    setTitle("");
    setDescription("");
    setOrder("");
  };

  const renderItem = ({ item }: { item: Module }) => (
    <TouchableOpacity
      onPress={() => router.push(`/course/${courseId}/module/${item.moduleId}`)}
    >
      <View style={viewModulesStyles.moduleCard}>
        <Text style={viewModulesStyles.title}>{item.title}</Text>
        <Text style={viewModulesStyles.description}>{item.description}</Text>
        <Text style={viewModulesStyles.order}>Orden: {item.order}</Text>
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
      <Text style={viewModulesStyles.heading}>Modules</Text>
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
