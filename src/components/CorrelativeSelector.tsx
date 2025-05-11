import { MaterialIcons } from "@expo/vector-icons";
import { colors } from "@theme/colors";
import { View, Pressable, ActivityIndicator } from "react-native";
import { Text, TextInput } from "react-native-paper";
import { createCourseStyles as styles } from "@styles/createCourseStyles";
import { fetchCourses } from "@services/CourseService";
import { useState } from "react";

type CourseOption = { id: string; title: string };

interface Props {
  searchQuery: string;
  setSearchQuery: (text: string) => void;
  allCourses: CourseOption[];
  setAllCourses: (value: CourseOption[]) => void;
  selectedCourses: CourseOption[];
  setSelectedCourses: React.Dispatch<React.SetStateAction<CourseOption[]>>;
}

export const CorrelativeSelector = ({
  searchQuery,
  setSearchQuery,
  allCourses,
  setAllCourses,
  selectedCourses,
  setSelectedCourses,
}: Props) => {
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    const trimmed = searchQuery.trim();
    if (trimmed.length === 0) {
      setAllCourses([]);
      return;
    }

    setLoading(true);
    try {
      const result = await fetchCourses(undefined, undefined, {
        title: trimmed,
      });
      setAllCourses(
        result.courses.map((course: any) => ({
          title: course.title,
          id: course.id,
        }))
      );
    } catch (error) {
      console.error("Error al buscar cursos:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ marginTop: 10 }}>
      <Text style={styles.dateLabel}>Prerequisites (opcional)</Text>

      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <TextInput
          placeholder="Buscar cursos..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          mode="outlined"
          style={[styles.input, { flex: 1, marginRight: 8 }]}
        />
        <Pressable onPress={handleSearch} style={{ padding: 4 }}>
          {loading ? (
            <ActivityIndicator size={24} color={colors.primary} />
          ) : (
            <MaterialIcons name="search" size={24} color={colors.primary} />
          )}
        </Pressable>
      </View>

      {searchQuery.length > 0 && allCourses.length > 0 && (
        <View style={{ marginTop: 6 }}>
          {allCourses.map((course) => (
            <Pressable
              key={course.id}
              onPress={() => {
                if (!selectedCourses.some((c) => c.id === course.id)) {
                  setSelectedCourses((prev) => [...prev, course]);
                }
                setSearchQuery("");
                setAllCourses([]);
              }}
              style={{
                paddingVertical: 6,
                borderBottomWidth: 1,
                borderBottomColor: "#ccc",
              }}
            >
              <Text>{course.title}</Text>
            </Pressable>
          ))}
        </View>
      )}

      {selectedCourses.length > 0 && (
        <View style={{ marginTop: 10 }}>
          <Text style={styles.dateLabel}>Seleccionadas:</Text>
          {selectedCourses.map((course) => (
            <View
              key={course.id}
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                paddingVertical: 4,
              }}
            >
              <Text>{course.title}</Text>
              <Pressable
                onPress={() =>
                  setSelectedCourses((prev) =>
                    prev.filter((c) => c.id !== course.id)
                  )
                }
              >
                <MaterialIcons name="close" size={20} color={colors.primary} />
              </Pressable>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};
