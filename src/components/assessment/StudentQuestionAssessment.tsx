"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { QuestionAnswer, computeScores } from "@/lib/questionBankScoring";
import RescueMissionGame from "./RescueMissionGame";
import SimulationSelector from "./simulations/SimulationSelector";
import SimulationFlow from "./simulations/SimulationFlow";
import { SimulationTheme } from "./simulations/themes";

type Phase = "rescue" | "select" | "simulation";

export default function StudentQuestionAssessment() {
  const router = useRouter();
  const [grade, setGrade] = useState<string | null>(null);
  const [phase, setPhase] = useState<Phase>("rescue");
  const [answers, setAnswers] = useState<QuestionAnswer[]>([]);
  const [selectedTheme, setSelectedTheme] = useState<SimulationTheme | null>(null);

  useEffect(() => {
    setGrade(localStorage.getItem("student_grade"));
  }, []);

  if (grade === null) return null;

  if (grade !== "Grade 4-5") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="text-5xl mb-4">🚧</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Coming Soon</h2>
          <p className="text-gray-500 mb-6">
            The assessment for {grade} is being prepared. Please select Grade 4-5 for now.
          </p>
          <button
            onClick={() => router.push("/dashboard/student/onboarding")}
            className="w-full bg-emerald-600 hover:bg-emerald-700 rounded-lg h-11 text-white font-medium transition-colors"
          >
            Back to Onboarding
          </button>
        </div>
      </div>
    );
  }

  const handleRescueComplete = (answer: QuestionAnswer) => {
    setAnswers([answer]);
    setPhase("select");
  };

  const handleThemeSelect = (theme: SimulationTheme) => {
    setSelectedTheme(theme);
    setPhase("simulation");
  };

  const handleSimulationComplete = (simAnswers: QuestionAnswer[]) => {
    const allAnswers = [...answers, ...simAnswers];
    const scores = computeScores(allAnswers);
    localStorage.setItem("assessment_scores", JSON.stringify(scores));
    router.push("/dashboard/student");
  };

  if (phase === "rescue") {
    return <RescueMissionGame onComplete={handleRescueComplete} />;
  }

  if (phase === "select") {
    return <SimulationSelector onSelect={handleThemeSelect} />;
  }

  if (phase === "simulation" && selectedTheme) {
    return <SimulationFlow theme={selectedTheme} onComplete={handleSimulationComplete} />;
  }

  return null;
}
