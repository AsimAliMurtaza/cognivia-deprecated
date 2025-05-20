import { create } from "zustand";

interface QuizData {
  _id: string;
  topic: string;
  questions: string[];
  options: string[][];
  answers: string[];
  userID: string;
  isTaken?: boolean;
  difficulty: string;
  questionCount: number;
}

interface QuizStore {
  quizData: QuizData | null;
  setQuizData: (data: QuizData) => void;
  clearQuizData: () => void;
}

export const useQuizStore = create<QuizStore>((set) => ({
  quizData: null,
  setQuizData: (data) => set({ quizData: data }),
  clearQuizData: () => set({ quizData: null }),
}));
