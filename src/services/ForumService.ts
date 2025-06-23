import { privateClient } from "@utils/apiClient";

// --- Types ---
export type UserProfileResponse = {
  id: number;
  user_name: string;
  first_name?: string;
  last_name?: string;
  email: string;
  description: string;
  banner: string;
  banned: boolean;
  role: string;
  created_at: string;
  is_activated: boolean;
};

export type ForumAttachment = {
  url: string;
  mimeType: string;
};

export type ForumQuestionSummaryResponse = {
  id: string;
  courseId: string;
  title: string;
  description: string;
  tags: string[];
  upvotes: number;
  downvotes: number;
  answerCount: number;
  isPinned: boolean;
  isClosed: boolean;
  createdAt: string;
  updatedAt: string;
  authorId: number;
  userVote?: number | null; 
  attachments: ForumAttachment[];
  isEdited: boolean;    
  acceptedAnswerId?: string | null;
};

export type ForumQuestionWithProfile = ForumQuestionSummaryResponse & {
  authorProfile: UserProfileResponse;
};

export type ForumQuestionListResponse = {
  questions: ForumQuestionWithProfile[];
  totalPages: number;
  totalItems: number;
  page: number;
  size: number;
};

export type ForumTagResponse = {
  id: string;
  name: string;
  usageCount: number;
};

export type ForumAnswerResponse = {
  id: string;
  questionId: string;
  authorId: number;
  text: string;
  attachments: ForumAttachment[];
  upvotes: number;
  downvotes: number;
  accepted: boolean;
  isEdited: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  authorProfile: UserProfileResponse; 
  userVote?: number | null;
};

export type ForumAnswerListResponse = {
  answers: ForumAnswerResponse[];
  totalPages: number;
  totalItems: number;
  currentPage: number;
  pageSize: number;
};



// --- Services ---

export async function fetchForumQuestions(
  courseId: string,
  page = 0,
  size = 10,
  options?: { tags?: string[]; search?: string; sort?: "recent" | "votes" | "answers" }
): Promise<ForumQuestionListResponse> {
  const params = new URLSearchParams({
    courseId,
    page: String(page),
    size: String(size),
    sort: options?.sort || "recent",
  });

  if (options?.tags && Array.isArray(options.tags)) {
    options.tags.forEach(tag => params.append("tags", tag));
  }
  if (options?.search) params.append("search", options.search);

  const response = await privateClient.get<ForumQuestionListResponse>(
    `/forums/questions?${params.toString()}`
  );
  return response.data;
}

export async function fetchForumTags(courseId: string): Promise<ForumTagResponse[]> {
  const response = await privateClient.get<ForumTagResponse[]>(
    `/forums/tags/by-course/${courseId}`
  );
  return response.data;
}

export async function createForumQuestion(formData: FormData): Promise<void> {
  await privateClient.post("/forums/questions", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

export async function fetchForumAnswers(
  courseId: string,
  questionId: string,
  page = 0,
  size = 10,
  sort: "recent" | "oldest" = "recent"
): Promise<ForumAnswerListResponse> {
  const params = new URLSearchParams({
    page: String(page),
    size: String(size),
    sort,
  });

  const response = await privateClient.get<ForumAnswerListResponse>(
    `/forums/questions/${questionId}/answers?${params.toString()}`
  );
  return response.data;
}

export async function createForumAnswer(formData: FormData): Promise<void> {
  await privateClient.post("/forums/questions/answers", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

export async function upvoteForumQuestion(questionId: string) {
  await privateClient.post(`/forums/questions/${questionId}/vote`, {
    vote: "up",
  });
}

export async function downvoteForumQuestion(questionId: string) {
  await privateClient.post(`/forums/questions/${questionId}/vote`, {
    vote: "down",
  });
}

export async function upvoteForumAnswer(answerId: string) {
  await privateClient.post(`/forums/answers/${answerId}/vote`, {
    vote: "up",
  });
}

export async function downvoteForumAnswer(answerId: string) {
  await privateClient.post(`/forums/answers/${answerId}/vote`, {
    vote: "down",
  });
}

export async function acceptForumAnswer(questionId: string, answerId: string) {
  await privateClient.post(`/forums/questions/${questionId}/accept`, {
    answerId,
  });
}

export async function deleteForumQuestion(questionId: string): Promise<void> {
  await privateClient.delete(`/forums/questions/${questionId}`);
}

export async function deleteForumAnswer(answerId: string): Promise<void> {
  await privateClient.delete(`/forums/answers/${answerId}`);
}


export async function editForumQuestion(
  questionId: string,
  formData: FormData
): Promise<void> {
  console.log("Form data in editForumQuestion:", formData.get("attachments"));
  await privateClient.patch(`/forums/questions/${questionId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

export async function editForumAnswer(
  answerId: string,
  formData: FormData
): Promise<void> {
  //console.log("Form data in editForumAnswer:", formData);
  await privateClient.patch(`/forums/answers/${answerId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

export async function fetchForumQuestionFull(questionId: string): Promise<ForumQuestionWithProfile> {
  const response = await privateClient.get<ForumQuestionWithProfile>(
    `/forums/questions/${questionId}/full`
  );
  return response.data;
}