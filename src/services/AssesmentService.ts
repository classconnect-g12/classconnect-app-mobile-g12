import { privateClient } from "@utils/apiClient";
import { questionFormatter } from "@utils/questionFormatter";

export type AssesmentStatus = "PENDING" | "IN_PROGRES" | "FINISHED";
export type AssesmentType = "TASK" | "EXAM";

export type Assesment = {
  id: number;
  title: string;
  instructions: string;
  startDate: string;
  endDate: string;
  status: AssesmentStatus;
  type: AssesmentType;
  submissionCount: number;
};

export type AssesmentCreationBody = {
  title: string;
  description: string;
  instructions: string;
  type: AssesmentType;
  startDate: string;
  endDate: string;
  maxScore: number;
  minScore: number;
  gracePeriodMinutes: number;
  latePenaltyPercentage: number;
  allowLateSubmission: boolean;
  questions: AssesmentQuestion[];
  questionImages?: string[];
};

export type QuestionType =
  | "MULTIPLE_CHOICE"
  | "WRITTEN_ANSWER"
  | "FILE_ATTACHMENT";

export type AssesmentQuestion = {
  text: string;
  score: number;
  type: QuestionType;
  options?: string[];
  correctOption?: string;
  sampleAnswer?: string;
  hasImage: boolean;
};

export async function getAssesmentsByCourse(
  courseId: string,
  page = 0,
  limit = 10,
  type?: AssesmentType
): Promise<Assesment[]> {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  if (type) {
    params.append("type", type);
  }

  const response = await privateClient.get(
    `course/${courseId}/assessments/student?page=${page}&limit=${limit}&type=${type}`
  );

  return response.data.assessments;
}

export async function createAssessment(
  courseId: string,
  data: AssesmentCreationBody
) {
  const formData = new FormData();

  formData.append("title", data.title);
  if (data.description) {
    formData.append("description", data.description);
  } else {
    formData.append("description", "description");
  }
  formData.append("instructions", data.instructions);
  formData.append("type", data.type);
  formData.append("startDate", data.startDate);
  formData.append("endDate", data.endDate);
  formData.append("maxScore", String(data.maxScore));
  formData.append("minScore", String(data.minScore));
  formData.append("gracePeriodMinutes", String(data.gracePeriodMinutes));
  formData.append("latePenaltyPercentage", String(data.latePenaltyPercentage));
  formData.append("allowLateSubmission", String(data.allowLateSubmission));

  const cleanedQuestions = questionFormatter(data.questions);

  formData.append("questions", JSON.stringify(cleanedQuestions));

  if (data.questionImages?.length) {
    data.questionImages.forEach((image: any, index: number) => {
      if (image?.uri) {
        formData.append(`questionImages[${index}]`, {
          uri: image.uri,
          name: image.name || `image${index}.jpg`,
          type: image.type || "image/jpeg",
        } as any);
      }
    });
  }

  const response = await privateClient.post(
    `/course/assessments/${courseId}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
}
