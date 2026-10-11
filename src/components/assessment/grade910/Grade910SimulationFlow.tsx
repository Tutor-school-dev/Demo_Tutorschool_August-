"use client";

import { useState, useCallback } from "react";
import type { QuestionAnswer } from "./types";
import { GRADE910_SIMULATIONS } from "./types";
import NarrativeScreen from "../grade68/shared/NarrativeScreen";
import ExamStrategySimulation from "./simulations/ExamStrategy/ExamStrategySimulation";
import ResearchEvidenceSimulation from "./simulations/ResearchEvidence/ResearchEvidenceSimulation";
import ProjectCrisisSimulation from "./simulations/ProjectCrisis/ProjectCrisisSimulation";
import SystemResourceSimulation from "./simulations/SystemResource/SystemResourceSimulation";
import DecisionRoomSimulation from "./simulations/DecisionRoom/DecisionRoomSimulation";

interface Props {
  onComplete: (allAnswers: QuestionAnswer[]) => void;
}

const SIMULATION_COMPONENTS = [
  ExamStrategySimulation,
  ResearchEvidenceSimulation,
  ProjectCrisisSimulation,
  SystemResourceSimulation,
  DecisionRoomSimulation,
];

export default function Grade910SimulationFlow({ onComplete }: Props) {
  const [simIndex, setSimIndex] = useState(0);
  const [showIntro, setShowIntro] = useState(true);
  const [allAnswers, setAllAnswers] = useState<QuestionAnswer[]>([]);

  const handleSimComplete = useCallback(
    (answers: QuestionAnswer[]) => {
      const updated = [...allAnswers, ...answers];
      setAllAnswers(updated);

      const nextIdx = simIndex + 1;
      if (nextIdx >= SIMULATION_COMPONENTS.length) {
        onComplete(updated);
      } else {
        setSimIndex(nextIdx);
        setShowIntro(true);
      }
    },
    [allAnswers, simIndex, onComplete]
  );

  const meta = GRADE910_SIMULATIONS[simIndex];
  const SimComponent = SIMULATION_COMPONENTS[simIndex];

  if (showIntro && simIndex > 0) {
    return (
      <div className="w-full max-w-3xl mx-auto space-y-4">
        <div className="flex justify-center gap-1.5 mb-2">
          {GRADE910_SIMULATIONS.map((s, i) => (
            <div
              key={s.id}
              className={`h-2 rounded-full transition-all ${
                i < simIndex ? "bg-indigo-500 w-12" : i === simIndex ? "bg-indigo-400 w-12" : "bg-gray-200 w-12"
              }`}
            />
          ))}
        </div>
        <NarrativeScreen
          emoji={meta.emoji}
          title={`Simulation ${simIndex + 1}: ${meta.name}`}
          narrative={meta.tagline + ". Get ready for the next challenge!"}
          buttonLabel="Begin"
          onContinue={() => setShowIntro(false)}
        />
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto space-y-4">
      <div className="flex items-center gap-3 px-1">
        <span className="text-xs font-medium text-gray-500">
          Simulation {simIndex + 1} of {GRADE910_SIMULATIONS.length}
        </span>
        <div className="flex-1 flex gap-1.5">
          {GRADE910_SIMULATIONS.map((s, i) => (
            <div
              key={s.id}
              className={`flex-1 h-2 rounded-full transition-all ${
                i < simIndex ? "bg-indigo-500" : i === simIndex ? "bg-indigo-400" : "bg-gray-200"
              }`}
            />
          ))}
        </div>
        <span className="text-sm">{meta.emoji}</span>
      </div>

      <SimComponent onComplete={handleSimComplete} />
    </div>
  );
}
