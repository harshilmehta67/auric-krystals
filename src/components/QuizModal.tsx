"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface QuizModalProps {
  open: boolean;
  onClose: () => void;
}

const REGISTERED_KEY = "ak_quiz_registered";

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

type Phase = "questions" | "register" | "result";

function isRegistered(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(REGISTERED_KEY) === "true";
}

function markRegistered() {
  localStorage.setItem(REGISTERED_KEY, "true");
}

export default function QuizModal({ open, onClose }: QuizModalProps) {
  const router = useRouter();
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [resultKey, setResultKey] = useState<string | null>(null);
  const [phase, setPhase] = useState<Phase>("questions");
  const [regLoading, setRegLoading] = useState(false);
  const [regError, setRegError] = useState("");
  const [tcAccepted, setTcAccepted] = useState(false);
  const [marketingOptin, setMarketingOptin] = useState(false);

  useEffect(() => {
    if (open) {
      setCurrent(0);
      setAnswers([]);
      setResultKey(null);
      setPhase("questions");
      setRegLoading(false);
      setRegError("");
      setTcAccepted(false);
      setMarketingOptin(false);
    }
  }, [open]);

  function computeResult(allAnswers: string[]): string {
    const freq: Record<string, number> = {};
    allAnswers.forEach((a) => (freq[a] = (freq[a] || 0) + 1));
    return Object.entries(freq).sort((a, b) => b[1] - a[1])[0][0];
  }

  function selectAnswer(value: string) {
    const newAnswers = [...answers, value];
    setAnswers(newAnswers);
    if (current + 1 < questions.length) {
      setCurrent(current + 1);
    } else {
      const winner = computeResult(newAnswers);
      setResultKey(winner);
      localStorage.setItem("quizTaken", "true");

      if (isRegistered()) {
        setPhase("result");
      } else {
        setPhase("register");
      }
    }
  }

  function goBack() {
    if (current > 0) {
      setCurrent(current - 1);
      setAnswers(answers.slice(0, -1));
    }
  }

  async function handleRegister(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setRegLoading(true);
    setRegError("");

    const form = new FormData(e.currentTarget);
    const payload = {
      name: form.get("reg-name") as string,
      email: form.get("reg-email") as string,
      phone: form.get("reg-phone") as string,
      dob: form.get("reg-dob") as string,
      marketingOptin,
      quizResult: resultKey,
    };

    try {
      const res = await fetch("/api/quiz-register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Registration failed");
      }

      markRegistered();
      setPhase("result");
    } catch (err) {
      setRegError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setRegLoading(false);
    }
  }

  if (!open) return null;

  const crystal = resultKey ? crystalResults[resultKey] : null;

  const inputClass =
    "w-full px-4 py-3 bg-surface-container-low rounded-xl border border-outline-variant/25 focus:border-primary focus:ring-2 focus:ring-primary/15 outline-none transition-all text-on-surface placeholder:text-on-surface-variant/50 text-sm";

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/45 ak-nav-blur px-4">
      <div className="ak-modal-card max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 sm:p-8">
          {/* Phase: Questions */}
          {phase === "questions" && (
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
          )}

          {/* Phase: Registration */}
          {phase === "register" && (
            <form onSubmit={handleRegister} className="space-y-5">
              <div className="flex justify-between items-center gap-4">
                <h3 className="font-headline text-xl text-primary">Almost there!</h3>
                <button
                  type="button"
                  onClick={onClose}
                  className="shrink-0 text-on-surface-variant hover:text-primary text-2xl leading-none"
                  aria-label="Close"
                >
                  &times;
                </button>
              </div>
              <p className="text-sm text-on-surface-variant">
                Register to reveal your personalized crystal recommendation. We&apos;ll use this to tailor your experience.
              </p>

              <div>
                <label className="block text-xs font-label uppercase tracking-widest text-primary mb-1.5" htmlFor="reg-name">
                  Full Name
                </label>
                <input id="reg-name" name="reg-name" type="text" required autoComplete="name" placeholder="Your name" className={inputClass} />
              </div>
              <div>
                <label className="block text-xs font-label uppercase tracking-widest text-primary mb-1.5" htmlFor="reg-dob">
                  Date of Birth
                </label>
                <input id="reg-dob" name="reg-dob" type="date" required className={inputClass} />
              </div>
              <div>
                <label className="block text-xs font-label uppercase tracking-widest text-primary mb-1.5" htmlFor="reg-phone">
                  Mobile Number
                </label>
                <input id="reg-phone" name="reg-phone" type="tel" required autoComplete="tel" placeholder="+91 XXXXX XXXXX" className={inputClass} />
              </div>
              <div>
                <label className="block text-xs font-label uppercase tracking-widest text-primary mb-1.5" htmlFor="reg-email">
                  Email Address
                </label>
                <input id="reg-email" name="reg-email" type="email" required autoComplete="email" placeholder="you@email.com" className={inputClass} />
              </div>

              {/* Marketing opt-in */}
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={marketingOptin}
                  onChange={(e) => setMarketingOptin(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-outline-variant text-primary focus:ring-primary/30 accent-primary"
                />
                <span className="text-sm text-on-surface-variant group-hover:text-on-surface transition-colors">
                  I&apos;d like to receive personalized offers, crystal recommendations, and updates
                </span>
              </label>

              {/* T&C consent (required) */}
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={tcAccepted}
                  onChange={(e) => setTcAccepted(e.target.checked)}
                  required
                  className="mt-0.5 h-4 w-4 rounded border-outline-variant text-primary focus:ring-primary/30 accent-primary"
                />
                <span className="text-sm text-on-surface-variant group-hover:text-on-surface transition-colors">
                  I agree to the{" "}
                  <Link href="/terms" target="_blank" className="text-primary underline underline-offset-2 hover:text-primary/80">
                    Terms &amp; Conditions
                  </Link>{" "}
                  and{" "}
                  <Link href="/terms#privacy" target="_blank" className="text-primary underline underline-offset-2 hover:text-primary/80">
                    Privacy Policy
                  </Link>
                </span>
              </label>

              {regError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">{regError}</div>
              )}

              <button
                type="submit"
                disabled={regLoading || !tcAccepted}
                className="w-full py-3.5 bg-primary text-on-primary rounded-xl font-bold hover:opacity-95 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {regLoading ? "Saving..." : "Reveal My Crystal"}
              </button>
            </form>
          )}

          {/* Phase: Result */}
          {phase === "result" && crystal && (
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
                    setResultKey(null);
                    setPhase("questions");
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
