import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { fetchForumQuestions } from "../services/ForumService";
import { ForumQuestionWithProfile } from "@src/types/forum"; // Usá el alias o la ruta relativa según tu tsconfig

// Context type
type ForumQuestionsContextType = {
  questions: ForumQuestionWithProfile[];
  setQuestions: React.Dispatch<React.SetStateAction<ForumQuestionWithProfile[]>>;
  refreshQuestions: (courseId: string) => Promise<void>;
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

  const refreshQuestions = async (courseIdParam?: string) => {
    setLoading(true);
    try {
      const data = await fetchForumQuestions(courseIdParam || courseId, 0, 50);
      setQuestions(data.questions || []);
    } catch {
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (courseId) {
      refreshQuestions(courseId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId]);

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