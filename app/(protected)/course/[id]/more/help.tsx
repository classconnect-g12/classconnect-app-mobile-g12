import { useCourse } from "@context/CourseContext";
import { View, Text } from "react-native";

export default function Settings() {

    const { courseId, courseDetail } = useCourse();

    return (
        <View>
            <Text>Settings</Text>
        </View>
    );
}