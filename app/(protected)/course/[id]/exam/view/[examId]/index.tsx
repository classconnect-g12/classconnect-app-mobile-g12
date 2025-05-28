import { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { getAssessmentDetailsById } from "@services/AssessmentService";
import AssessmentDetail from "@components/AssessmentDetail";

export default function ExamDetailScreen() {
  const { id, examId } = useLocalSearchParams<{ id: string; examId: string }>();
  const [assessment, setAssessment] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getAssessmentDetailsById(id, examId);
        setAssessment(data);
      } catch (error) {
        console.error("Error fetching assessment", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id, examId]);

  return (
    <AssessmentDetail
      assessment={assessment}
      loading={loading}
      typeAssessment="exam"
    />
  );
}
