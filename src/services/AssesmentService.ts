import { privateClient } from "@utils/apiClient";

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
  startDate: Date;
  endDate: Date;
  maxScore: number;
  minScore: number;
  gracePeriodMinutes: number;
  latePenaltyPercentage: number;
  allowLateSubmission: boolean;
  questions: AssesmentQuestion[];
  questionsImages: string[];
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
  type?: AssesmentStatus
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
