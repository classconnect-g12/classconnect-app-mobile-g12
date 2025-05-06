import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { fetchModules, Module } from "@services/ModuleService";
import { useCourse } from "@context/CourseContext";
import { viewModulesStyles } from "@styles/viewModulesStyles";

const CourseModulesScreen = () => {
  const { courseId } = useCourse();
  console.log("Course ID:", courseId);
  console.log("Params:", useLocalSearchParams());

  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadModules = async () => {
      try {
        if (courseId) {
          const data = await fetchModules(courseId);
          console.log("Modules data:", data);
          setModules(data);
        }
      } catch (err) {
        setError("Error loading modules");
      } finally {
        setLoading(false);
      }
    };

    loadModules();
  }, [courseId]);

  const renderItem = ({ item }: { item: Module }) => (
    <View style={viewModulesStyles.moduleCard}>
      <Text style={viewModulesStyles.title}>{item.title}</Text>
      <Text style={viewModulesStyles.description}>{item.description}</Text>
      <Text style={viewModulesStyles.order}>Orden: {item.order}</Text>
    </View>
  );

  if (loading) {
    return (
      <ActivityIndicator size="large" color="#0000ff" style={viewModulesStyles.loader} />
    );
  }

  if (error) {
    return <Text style={viewModulesStyles.error}>{error}</Text>;
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
    </View>
  );
};

export default CourseModulesScreen;
