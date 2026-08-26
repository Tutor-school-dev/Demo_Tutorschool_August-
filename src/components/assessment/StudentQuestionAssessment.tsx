"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { LoadingButton } from "@/components/ui/LoadingButton";
import questionBank from "@/data/questionBank4-5.json";
import { QuestionAnswer, computeScores } from "@/lib/questionBankScoring";

interface Question {
  id: string;
  title: string;
  scenario: string;
  options: { key: string; text: string; primarySignal: string; secondarySignal: string }[];
  primaryParam: string;
  secondaryParam: string;
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function selectQuestions(allQuestions: Question[], count: number): Question[] {
  const params = ["ATT", "WM", "FB", "STR", "ABS", "PER", "PAC"];
  const selected: Question[] = [];
  const used = new Set<string>();

  for (const param of params) {
    const matching = allQuestions.filter(
      (q) => (q.primaryParam === param || q.secondaryParam === param) && !used.has(q.id)
    );
    if (matching.length > 0) {
      const pick = matching[Math.floor(Math.random() * matching.length)];
      selected.push(pick);
      used.add(pick.id);
    }
  }

  const remaining = allQuestions.filter((q) => !used.has(q.id));
  const shuffled = shuffleArray(remaining);
  for (const q of shuffled) {
    if (selected.length >= count) break;
    selected.push(q);
    used.add(q.id);
  }

  return shuffleArray(selected);
}

const PARAM_LABELS: Record<string, string> = {
  ATT: "Attention & Focus",
  WM: "Working Memory",
  FB: "Feedback Sensitivity",
  STR: "Strategy & Reasoning",
  ABS: "Abstraction",
  PER: "Persistence & Pacing",
  PAC: "Self-Pacing",
};

export default function StudentQuestionAssessment() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<QuestionAnswer[]>([]);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const questions = useMemo(() => {
    return selectQuestions(questionBank.questions as Question[], 15);
  }, []);

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  const handleSelect = (key: string) => {
    setSelectedKey(key);
  };

  const handleNext = () => {
    if (!selectedKey || !currentQuestion) return;

    const option = currentQuestion.options.find((o) => o.key === selectedKey);
    if (!option) return;

    const answer: QuestionAnswer = {
      questionId: currentQuestion.id,
      selectedKey,
      primaryParam: currentQuestion.primaryParam,
      secondaryParam: currentQuestion.secondaryParam,
      primarySignal: option.primarySignal,
      secondarySignal: option.secondarySignal,
    };

    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);
    setSelectedKey(null);

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setShowResults(true);
    }
  };

  const handleSubmit = () => {
    setSubmitting(true);
    localStorage.setItem("assessment_scores", JSON.stringify(computeScores(answers)));
    router.push("/dashboard/student");
  };

  if (showResults) {
    const scores = computeScores(answers);
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center p-4">
        <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">Assessment Complete!</h2>
          <p className="text-gray-500 text-center mb-6">Here&apos;s your cognitive profile</p>

          <div className="space-y-3">
            {Object.entries(scores).map(([param, val]) => (
              <div key={param} className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-600 w-40">
                  {PARAM_LABELS[param] || param}
                </span>
                <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                    style={{ width: `${val.score * 100}%` }}
                  />
                </div>
                <span className="text-sm font-bold text-gray-700 w-12 text-right">
                  {Math.round(val.score * 100)}%
                </span>
              </div>
            ))}
          </div>

          <LoadingButton
            isLoading={submitting}
            onClick={handleSubmit}
            className="w-full mt-8 bg-emerald-600 hover:bg-emerald-700 rounded-lg h-12 text-white font-medium transition-colors"
          >
            Continue to Dashboard
          </LoadingButton>
        </div>
      </div>
    );
  }

  if (!currentQuestion) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-500">
              Question {currentIndex + 1} of {questions.length}
            </span>
            <span className="text-sm text-emerald-600 font-medium">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-800 mb-3">{currentQuestion.title}</h3>
          <p className="text-gray-600 leading-relaxed">{currentQuestion.scenario}</p>
        </div>

        <div className="space-y-3">
          {currentQuestion.options.map((option) => (
            <button
              key={option.key}
              onClick={() => handleSelect(option.key)}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${
                selectedKey === option.key
                  ? "border-emerald-500 bg-emerald-50 shadow-sm"
                  : "border-gray-200 hover:border-emerald-200 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-start gap-3">
                <span
                  className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    selectedKey === option.key
                      ? "bg-emerald-500 text-white"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {option.key}
                </span>
                <span className="text-sm font-medium text-gray-700 pt-1">{option.text}</span>
              </div>
            </button>
          ))}
        </div>

        <button
          onClick={handleNext}
          disabled={!selectedKey}
          className="w-full mt-6 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed rounded-lg h-12 text-white font-medium transition-colors"
        >
          {currentIndex === questions.length - 1 ? "Finish" : "Next"}
        </button>
      </div>
    </div>
  );
}
