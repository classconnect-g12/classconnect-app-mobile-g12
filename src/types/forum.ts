// Forum Attachment
export interface ForumAttachment {
  url: string;
  mimeType: string;
}

// User Profile (from ForumService)
export interface UserProfileResponse {
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
}

// Forum Question Summary
export interface ForumQuestionSummaryResponse {
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
}

// Forum Question with Profile
export interface ForumQuestionWithProfile extends ForumQuestionSummaryResponse {
  authorProfile: UserProfileResponse;
}

// Forum Question List Response
export interface ForumQuestionListResponse {
  questions: ForumQuestionWithProfile[];
  totalPages: number;
  totalItems: number;
  page: number;
  size: number;
}

// Forum Tag
export interface ForumTagResponse {
  id: string;
  name: string;
  usageCount: number;
}

// Forum Answer
export interface ForumAnswerResponse {
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
}

// Forum Answer List Response
export interface ForumAnswerListResponse {
  answers: ForumAnswerResponse[];
  totalPages: number;
  totalItems: number;
  currentPage: number;
  pageSize: number;
}