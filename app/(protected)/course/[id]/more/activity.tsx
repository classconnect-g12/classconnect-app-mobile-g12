import { useContext, useEffect, useState } from "react";
import { useCourse } from "@context/CourseContext";
import { View, ScrollView } from "react-native";
import { Text } from "react-native-paper";
import { getCourseActivityLogs } from "@services/CourseService";
import { format } from "date-fns";
import { handleApiError } from "@utils/handleApiError";
import { useSnackbar } from "@context/SnackbarContext";
import { useAuth } from "@context/authContext";
import Spinner from "@components/Spinner";

type ActivityLog = {
  id: number;
  action: string;
  timestamp: string;
  user: {
    user_name: string;
    email: string;
  };
};

export default function Activity() {
  const { courseId, courseTitle } = useCourse();
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const { logout } = useAuth();
  const { showSnackbar } = useSnackbar();

  useEffect(() => {
    const fetchLogs = async () => {
      if (!courseId) return;

      try {
        const response = await getCourseActivityLogs(courseId);
        console.log("Logs:", response);
        setLogs(response.logs || []);
      } catch (error) {
        handleApiError(error, showSnackbar, "Error fetching logs", logout);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, [courseId]);

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: "white" }}>
      {loading ? (
          <Spinner />
      ) : logs.length === 0 ? (
        <Text>No activity logs found.</Text>
      ) : (
        <ScrollView>
          {logs.map((log) => (
            <View
              key={log.id}
              style={{
                padding: 12,
                marginBottom: 10,
              }}
            >
              <Text style={{ fontWeight: "bold", fontSize: 16 }}>
                {log.action}
              </Text>
              <Text style={{ marginTop: 4 }}>
                By {log.user.user_name} ({log.user.email})
              </Text>
              <Text style={{ fontSize: 12, color: "gray", marginTop: 4 }}>
                {format(new Date(log.timestamp), "yyyy-MM-dd HH:mm:ss")}
              </Text>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}
