import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { fetchForumQuestions } from "../services/ForumService";
import { ForumQuestionWithProfile } from "@src/types/forum";

// Context type
type ForumQuestionsContextType = {
  questions: ForumQuestionWithProfile[];
  setQuestions: React.Dispatch<React.SetStateAction<ForumQuestionWithProfile[]>>;
  refreshQuestions: (courseId?: string) => Promise<void>;
  loading: boolean;
};

// Context
const ForumQuestionsContext = createContext<ForumQuestionsContextType>({
  questions: [],
  setQuestions: () => {},
  refreshQuestions: async () => {},
  loading: false,
});

// Hook para consumir el contexto
export const useForumQuestions = () => useContext(ForumQuestionsContext);

// Provider
type Props = {
  courseId: string;
  children: ReactNode;
};

export const ForumQuestionsProvider = ({ courseId, children }: Props) => {
  const [questions, setQuestions] = useState<ForumQuestionWithProfile[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchInitialQuestions = async () => {
      setLoading(true);
      try {
        const data = await fetchForumQuestions(courseId, 0, 10);
        if (isMounted) setQuestions(data.questions || []);
      } catch {
        if (isMounted) setQuestions([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    if (courseId) fetchInitialQuestions();
    return () => {
      isMounted = false;
    };
  }, [courseId]);

  const refreshQuestions = async (courseIdParam?: string) => {
    setLoading(true);
    try {
      const data = await fetchForumQuestions(courseIdParam || courseId, 0, 10);
      setQuestions(data.questions || []);
    } catch {
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ForumQuestionsContext.Provider
      value={{
        questions,
        setQuestions,
        refreshQuestions,
        loading,
      }}
    >
      {children}
    </ForumQuestionsContext.Provider>
  );
};