"use client";

import { useOpenQuiz } from "./QuizUIContext";

export default function FindYourCrystalButton() {
  const openQuiz = useOpenQuiz();

  return (
    <button
      type="button"
      onClick={() => openQuiz?.()}
      className="inline-flex justify-center items-center px-8 py-4 border-2 border-primary text-primary rounded-full font-bold text-sm tracking-widest uppercase hover:bg-primary-fixed/50 transition-colors"
    >
      Find Your Crystal
    </button>
  );
}
