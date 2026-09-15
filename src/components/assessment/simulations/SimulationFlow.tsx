"use client";

import { useState } from "react";
import { SimulationTheme } from "./themes";
import { QuestionAnswer } from "@/lib/questionBankScoring";
import AttentionGame from "./stages/AttentionGame";
import MemoryGame from "./stages/MemoryGame";
import RuleSortingGame from "./stages/RuleSortingGame";
import PuzzleGame from "./stages/PuzzleGame";
import ChoiceGame from "./stages/ChoiceGame";

const STAGE_NAMES = ["Attention", "Memory", "Rule Sorting", "Puzzle", "Exploration"];
const TOTAL_STAGES = 5;

interface SimulationFlowProps {
  theme: SimulationTheme;
  onComplete: (answers: QuestionAnswer[]) => void;
}

export default function SimulationFlow({ theme, onComplete }: SimulationFlowProps) {
  const [currentStage, setCurrentStage] = useState(0);
  const [answers, setAnswers] = useState<QuestionAnswer[]>([]);
  const [showIntro, setShowIntro] = useState(true);

  const handleStageComplete = (answer: QuestionAnswer) => {
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);

    if (currentStage < TOTAL_STAGES - 1) {
      setCurrentStage(currentStage + 1);
      setShowIntro(true);
    } else {
      onComplete(newAnswers);
    }
  };

  const stageConfigs = [
    { name: theme.attention.stageName, desc: theme.attention.instruction },
    { name: theme.memory.stageName, desc: theme.memory.instruction },
    { name: theme.sorting.stageName, desc: theme.sorting.instruction },
    { name: theme.puzzle.stageName, desc: theme.puzzle.instruction },
    { name: theme.choice.stageName, desc: theme.choice.instruction },
  ];

  if (showIntro) {
    const stage = stageConfigs[currentStage];
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="mb-4">
            <span className="text-sm font-medium text-gray-400">
              {theme.name} — Stage {currentStage + 1} of {TOTAL_STAGES}
            </span>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mt-2">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                style={{ width: `${(currentStage / TOTAL_STAGES) * 100}%` }}
              />
            </div>
          </div>

          <div className="text-5xl mb-4">{theme.emoji}</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">{stage.name}</h2>
          <p className="text-gray-500 mb-6">{stage.desc}</p>

          <button
            onClick={() => setShowIntro(false)}
            className="w-full bg-emerald-600 hover:bg-emerald-700 rounded-lg h-12 text-white font-medium transition-colors"
          >
            Start Stage
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {currentStage === 0 && (
        <AttentionGame config={theme.attention} themeId={theme.id} onComplete={handleStageComplete} />
      )}
      {currentStage === 1 && (
        <MemoryGame config={theme.memory} themeId={theme.id} onComplete={handleStageComplete} />
      )}
      {currentStage === 2 && (
        <RuleSortingGame config={theme.sorting} themeId={theme.id} onComplete={handleStageComplete} />
      )}
      {currentStage === 3 && (
        <PuzzleGame config={theme.puzzle} themeId={theme.id} onComplete={handleStageComplete} />
      )}
      {currentStage === 4 && (
        <ChoiceGame config={theme.choice} themeId={theme.id} onComplete={handleStageComplete} />
      )}
    </>
  );
}
