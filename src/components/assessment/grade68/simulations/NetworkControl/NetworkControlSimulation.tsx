"use client";

import { useState, useCallback } from "react";
import type { QuestionAnswer } from "../../types";
import NarrativeScreen from "../../shared/NarrativeScreen";
import WarmupPrioritization from "./stages/WarmupPrioritization";
import IncreasingLoad from "./stages/IncreasingLoad";
import RuleShiftUnderLoad from "./stages/RuleShiftUnderLoad";

type Phase = "intro1" | "stage1" | "intro2" | "stage2" | "intro3" | "stage3";

interface Props {
  onComplete: (answers: QuestionAnswer[]) => void;
}

export default function NetworkControlSimulation({ onComplete }: Props) {
  const [phase, setPhase] = useState<Phase>("intro1");
  const [answers, setAnswers] = useState<QuestionAnswer[]>([]);

  const handleStage = useCallback(
    (answer: QuestionAnswer, nextPhase: Phase) => {
      setAnswers((prev) => [...prev, answer]);
      setPhase(nextPhase);
    },
    []
  );

  const handleS3 = useCallback(
    (answer: QuestionAnswer) => {
      onComplete([...answers, answer]);
    },
    [answers, onComplete]
  );

  switch (phase) {
    case "intro1":
      return (
        <NarrativeScreen
          emoji="📡"
          title="Network Control"
          narrative="Welcome to the communication hub! You're the signal operator. Colored signals are incoming — route each one to the correct priority lane. Stay sharp!"
          buttonLabel="Start Routing"
          onContinue={() => setPhase("stage1")}
        />
      );
    case "stage1":
      return <WarmupPrioritization onComplete={(a) => handleStage(a, "intro2")} />;
    case "intro2":
      return (
        <NarrativeScreen
          emoji="⚡"
          title="Traffic Increasing!"
          narrative="Good work on the warm-up! But incoming traffic is increasing, and there's noise in the system. Watch out for static signals and duplicates."
          buttonLabel="Bring It On"
          onContinue={() => setPhase("stage2")}
        />
      );
    case "stage2":
      return <IncreasingLoad onComplete={(a) => handleStage(a, "intro3")} />;
    case "intro3":
      return (
        <NarrativeScreen
          emoji="🔄"
          title="Priority Shift!"
          narrative="Alert: Priority rules are changing mid-operation! The rules will reverse, then shift again with a new lane. Stay focused as everything changes around you."
          buttonLabel="Ready"
          onContinue={() => setPhase("stage3")}
        />
      );
    case "stage3":
      return <RuleShiftUnderLoad onComplete={handleS3} />;
  }
}
