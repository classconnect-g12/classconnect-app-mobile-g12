import { privateClient } from "@utils/apiClient";
import { questionFormatter } from "@utils/questionFormatter";

export type AssessmentStatus = "PENDING" | "IN_PROGRES" | "FINISHED";
export type AssessmentType = "TASK" | "EXAM";

export type AssessmentEditRequest = {
  title?: string;
  description?: string;
  instructions?: string;
  type?: AssessmentType;
  startDate?: string;
  endDate?: string;
  maxScore?: number;
  minScore?: number;
  gracePeriodMinutes?: number;
  latePenaltyPercentage?: number;
  allowLateSubmission?: boolean;
  questions?: AssessmentQuestion[];
  questionImages?: ({ uri: string; name: string; mimeType: string } | null)[];
};

export type Assessment = {
  id: number;
  title: string;
  instructions: string;
  startDate: string;
  endDate: string;
  status: AssessmentStatus;
  type: AssessmentType;
  submissionCount: number;
};

export type AssessmentCreationBody = {
  title: string;
  description: string;
  instructions: string;
  type: AssessmentType;
  startDate: string;
  endDate: string;
  maxScore: number;
  minScore: number;
  gracePeriodMinutes: number;
  latePenaltyPercentage: number;
  allowLateSubmission: boolean;
  questions: AssessmentQuestion[];
  questionImages?: ({ uri: string; name: string; mimeType: string } | null)[];
};

export type QuestionType =
  | "MULTIPLE_CHOICE"
  | "WRITTEN_ANSWER"
  | "FILE_ATTACHMENT";

export type AssessmentQuestion = {
  text: string;
  score: number;
  type: QuestionType;
  options?: string[];
  correctOption?: string;
  sampleAnswer?: string;
  hasImage: boolean;
};

export async function getAssessmentsByCourse(
  courseId: string,
  page = 0,
  limit = 10,
  type?: AssessmentType
): Promise<Assessment[]> {
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
  id: string,
  data: AssessmentCreationBody
) {
  const formData = new FormData();

  formData.append("title", data.title);
  formData.append("description", data.description);
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
          type: image.mimeType || "image/jpeg",
        } as any);
      }
    });
  }

  const response = await privateClient.post(
    `/course/assessments/${id}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
}

export async function deleteAssessment(courseId: string, assessmentId: number) {
  await privateClient.delete(`course/${courseId}/assessments/${assessmentId}`);
}

export async function getAssessmentById(
  courseId: string,
  assessmentId: string
) {
  const response = await privateClient.get(
    `/course/${courseId}/assessments/${assessmentId}`
  );
  return response.data;
}

export async function updateAssessment(
  courseId: string,
  assessmentId: string,
  assessmentData: AssessmentEditRequest
) {
  const formData = new FormData();

  if (assessmentData.title) {
    formData.append("title", assessmentData.title);
  }
  if (assessmentData.description) {
    formData.append("description", assessmentData.description);
  }
  if (assessmentData.instructions) {
    formData.append("instructions", assessmentData.instructions);
  }
  if (assessmentData.startDate) {
    formData.append("startDate", assessmentData.startDate);
  }
  if (assessmentData.endDate) {
    formData.append("endDate", assessmentData.endDate);
  }
  if (assessmentData.maxScore) {
    formData.append("maxScore", String(assessmentData.maxScore));
  }
  if (assessmentData.minScore) {
    formData.append("minScore", String(assessmentData.minScore));
  }
  if (assessmentData.gracePeriodMinutes) {
    formData.append(
      "gracePeriodMinutes",
      String(assessmentData.gracePeriodMinutes)
    );
  }
  if (assessmentData.latePenaltyPercentage) {
    formData.append(
      "latePenaltyPercentage",
      String(assessmentData.latePenaltyPercentage)
    );
  }
  if (assessmentData.allowLateSubmission) {
    formData.append(
      "allowLateSubmission",
      String(assessmentData.allowLateSubmission)
    );
  }

  if (assessmentData.questions && assessmentData.questions.length > 0) {
    const cleanedQuestions = questionFormatter(assessmentData.questions);
    formData.append("questions", JSON.stringify(cleanedQuestions));
  }

  if (assessmentData.questionImages?.length) {
    assessmentData.questionImages.forEach((image: any, index: number) => {
      if (image?.uri) {
        formData.append(`questionImages[${index}]`, {
          uri: image.uri,
          name: image.name || `image${index}.jpg`,
          type: image.mimeType || "image/jpeg",
        } as any);
      }
    });
  }

  await privateClient.put(
    `course/${courseId}/assessments/${assessmentId}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
}
