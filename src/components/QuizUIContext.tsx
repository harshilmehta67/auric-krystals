"use client";

import { createContext, useContext } from "react";

const QuizOpenContext = createContext<(() => void) | null>(null);

export function QuizOpenProvider({
  openQuiz,
  children,
}: {
  openQuiz: () => void;
  children: React.ReactNode;
}) {
  return (
    <QuizOpenContext.Provider value={openQuiz}>{children}</QuizOpenContext.Provider>
  );
}

export function useOpenQuiz() {
  return useContext(QuizOpenContext);
}
