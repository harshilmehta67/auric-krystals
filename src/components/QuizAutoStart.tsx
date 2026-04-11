"use client";

import { useEffect } from "react";
import { useOpenQuiz } from "./QuizUIContext";

const QUIZ_TAKEN_KEY = "quizTaken";
const AUTO_OPEN_MS = 1800;

export default function QuizAutoStart() {
  const openQuiz = useOpenQuiz();

  useEffect(() => {
    if (!openQuiz || typeof window === "undefined") return;
    if (localStorage.getItem(QUIZ_TAKEN_KEY) === "true") return;

    const id = window.setTimeout(() => {
      if (localStorage.getItem(QUIZ_TAKEN_KEY) === "true") return;
      openQuiz();
    }, AUTO_OPEN_MS);

    return () => window.clearTimeout(id);
  }, [openQuiz]);

  return null;
}
