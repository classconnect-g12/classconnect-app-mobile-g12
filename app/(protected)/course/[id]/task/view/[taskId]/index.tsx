import { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { getAssessmentDetailsById } from "@services/AssessmentService";
import AssessmentDetail from "@components/AssessmentDetail";

export default function TaskDetailScreen() {
  const { id, taskId } = useLocalSearchParams<{ id: string; taskId: string }>();
  const [assessment, setAssessment] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getAssessmentDetailsById(id, taskId);
        setAssessment(data);
      } catch (error) {
        console.error("Error fetching assessment", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id, taskId]);

  return (
    <AssessmentDetail
      assessment={assessment}
      loading={loading}
      typeAssessment="task"
    />
  );
}
