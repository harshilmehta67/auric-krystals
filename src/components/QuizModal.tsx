"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface QuizModalProps {
  open: boolean;
  onClose: () => void;
}

const questions = [
  {
    id: 1,
    question: "When you wake up most days, how do you usually feel?",
    options: [
      { text: "Calm but emotionally sensitive", value: "A" },
      { text: "Mentally tired or overthinking", value: "B" },
      { text: "Energetic but restless", value: "C" },
      { text: "Heavy, drained, or low", value: "D" },
    ],
  },
  {
    id: 2,
    question: "Which area of life feels most out of balance right now?",
    options: [
      { text: "Love, emotions, or relationships", value: "A" },
      { text: "Mental peace and clarity", value: "B" },
      { text: "Career, money, or growth", value: "C" },
      { text: "Protection and stability", value: "D" },
    ],
  },
  {
    id: 3,
    question: "What are you seeking the most at this phase of life?",
    options: [
      { text: "Emotional healing and self-love", value: "A" },
      { text: "Guidance and inner clarity", value: "B" },
      { text: "Confidence, success, and motivation", value: "C" },
      { text: "Grounding and protection", value: "D" },
    ],
  },
  {
    id: 4,
    question: "How do you usually react to stressful situations?",
    options: [
      { text: "I get emotionally affected easily", value: "A" },
      { text: "I overthink and feel mentally exhausted", value: "B" },
      { text: "I push myself harder to overcome it", value: "C" },
      { text: "I withdraw and feel low on energy", value: "D" },
    ],
  },
  {
    id: 5,
    question: "What kind of energy do you wish to attract right now?",
    options: [
      { text: "Gentle, loving, and soothing", value: "A" },
      { text: "Calm, peaceful, and balanced", value: "B" },
      { text: "Powerful, confident, and abundant", value: "C" },
      { text: "Protective, grounding, and stable", value: "D" },
    ],
  },
  {
    id: 6,
    question: "Which affirmation resonates most with you?",
    options: [
      { text: "\u201cI am worthy of love and healing.\u201d", value: "A" },
      { text: "\u201cMy mind is calm and clear.\u201d", value: "B" },
      { text: "\u201cI attract success and abundance.\u201d", value: "C" },
      { text: "\u201cI am safe, protected, and grounded.\u201d", value: "D" },
    ],
  },
  {
    id: 7,
    question: "How would you like your crystal to support you?",
    options: [
      { text: "Heal my emotions and bring comfort", value: "A" },
      { text: "Clear my mind and improve focus", value: "B" },
      { text: "Boost my confidence and growth", value: "C" },
      { text: "Protect my energy and keep me grounded", value: "D" },
    ],
  },
];

const crystalResults: Record<string, { emoji: string; name: string; theme: string; description: string }> = {
  A: {
    emoji: "\uD83D\uDC97",
    name: "Rose Quartz",
    theme: "The Heart Healer",
    description:
      "Known as the stone of unconditional love, Rose Quartz opens your heart chakra and deepens your capacity for self-love and compassion. Perfect for emotional healing and attracting love into your life.",
  },
  B: {
    emoji: "\uD83D\uDC9C",
    name: "Amethyst",
    theme: "The Spiritual Guardian",
    description:
      "A powerful protective stone that enhances intuition and spiritual awareness. Amethyst calms the mind, aids meditation, and connects you to higher consciousness.",
  },
  C: {
    emoji: "\u2728",
    name: "Citrine",
    theme: "The Abundance Attractor",
    description:
      "The ultimate manifestation stone, Citrine radiates joy, confidence, and prosperity. It amplifies your personal power and attracts success and abundance.",
  },
  D: {
    emoji: "\uD83D\uDDA4",
    name: "Black Tourmaline",
    theme: "The Protective Guardian",
    description:
      "A powerful grounding stone that shields you from negative energy. Black Tourmaline roots you to the earth and creates a protective shield around your aura.",
  },
};

export default function QuizModal({ open, onClose }: QuizModalProps) {
  const router = useRouter();
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [result, setResult] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setCurrent(0);
      setAnswers([]);
      setResult(null);
    }
  }, [open]);

  function selectAnswer(value: string) {
    const newAnswers = [...answers, value];
    setAnswers(newAnswers);
    if (current + 1 < questions.length) {
      setCurrent(current + 1);
    } else {
      const freq: Record<string, number> = {};
      newAnswers.forEach((a) => (freq[a] = (freq[a] || 0) + 1));
      const winner = Object.entries(freq).sort((a, b) => b[1] - a[1])[0][0];
      setResult(winner);
      localStorage.setItem("quizTaken", "true");
    }
  }

  function goBack() {
    if (current > 0) {
      setCurrent(current - 1);
      setAnswers(answers.slice(0, -1));
    }
  }

  if (!open) return null;

  const crystal = result ? crystalResults[result] : null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/45 ak-nav-blur px-4">
      <div className="ak-modal-card max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 sm:p-8">
          {!crystal ? (
            <div className="space-y-6">
              <div className="flex justify-between items-center gap-4">
                <h3 className="text-[0.65rem] sm:text-xs font-bold uppercase tracking-[0.14em] text-primary/90">
                  Question {current + 1}/{questions.length}
                </h3>
                <button
                  type="button"
                  onClick={onClose}
                  className="shrink-0 text-on-surface-variant hover:text-primary text-2xl leading-none"
                  aria-label="Close quiz"
                >
                  &times;
                </button>
              </div>
              <div className="h-1.5 rounded-full bg-outline-variant/30 overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-300"
                  style={{
                    width: `${Math.round(((current + 1) / questions.length) * 100)}%`,
                  }}
                />
              </div>
              <p className="text-base sm:text-lg text-on-surface font-semibold leading-snug">
                {questions[current].question}
              </p>
              <div className="space-y-3">
                {questions[current].options.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => selectAnswer(opt.value)}
                    className="w-full text-left p-4 rounded-xl border-2 border-outline-variant/60 hover:border-primary hover:bg-primary-fixed/50 transition-all text-sm sm:text-base"
                  >
                    {opt.text}
                  </button>
                ))}
              </div>
              <div className="flex gap-3 pt-2">
                {current > 0 && (
                  <button
                    type="button"
                    onClick={goBack}
                    className="flex-1 py-3 border-2 border-primary text-primary rounded-xl font-semibold hover:bg-primary-fixed/40 transition-colors"
                  >
                    Back
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center space-y-5">
              <div className="text-6xl mb-2" aria-hidden="true">
                {crystal.emoji}
              </div>
              <h3 className="text-2xl font-bold text-primary">{crystal.name}</h3>
              <p className="text-sm text-secondary font-semibold italic">
                {crystal.theme}
              </p>
              <p className="text-base leading-relaxed text-on-surface text-left sm:text-center">
                {crystal.description}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    router.push("/shop");
                  }}
                  className="flex-1 py-3.5 bg-primary text-on-primary rounded-xl font-bold hover:opacity-95 transition-opacity"
                >
                  Shop {crystal.name}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCurrent(0);
                    setAnswers([]);
                    setResult(null);
                  }}
                  className="flex-1 py-3.5 border-2 border-primary text-primary rounded-xl font-bold hover:bg-primary-fixed/40 transition-colors"
                >
                  Retake Quiz
                </button>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="w-full py-2 text-on-surface-variant hover:text-primary text-sm"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
