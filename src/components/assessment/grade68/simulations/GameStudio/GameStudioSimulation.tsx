"use client";

import { useState, useCallback } from "react";
import type { QuestionAnswer } from "../../types";
import NarrativeScreen from "../../shared/NarrativeScreen";
import DiagnoseDesign from "./stages/DiagnoseDesign";
import TestAnalyseModify from "./stages/TestAnalyseModify";
import NewProblemOldSolution from "./stages/NewProblemOldSolution";

type Phase = "intro1" | "stage1" | "intro2" | "stage2" | "intro3" | "stage3";

interface Props {
  onComplete: (answers: QuestionAnswer[]) => void;
}

export default function GameStudioSimulation({ onComplete }: Props) {
  const [phase, setPhase] = useState<Phase>("intro1");
  const [answers, setAnswers] = useState<QuestionAnswer[]>([]);
  const [modification, setModification] = useState("difficulty_curve");

  const handleS1 = useCallback((_answer: QuestionAnswer, _diag: string, mod: string) => {
    setModification(mod);
    setAnswers((prev) => [...prev, _answer]);
    setPhase("intro2");
  }, []);

  const handleS2 = useCallback((answer: QuestionAnswer) => {
    setAnswers((prev) => [...prev, answer]);
    setPhase("intro3");
  }, []);

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
          emoji="🎮"
          title="Game Studio: Dragon Dash"
          narrative="Welcome to the Game Studio! Dragon Dash was a hit, but players are leaving in droves. As lead designer, you need to diagnose the problem and fix it."
          buttonLabel="Open Analytics"
          onContinue={() => setPhase("stage1")}
        />
      );
    case "stage1":
      return <DiagnoseDesign onComplete={handleS1} />;
    case "intro2":
      return (
        <NarrativeScreen
          emoji="🧪"
          title="Testing Your Changes"
          narrative="Your changes are being tested with real players. The first results are in — time to iterate and refine."
          buttonLabel="See Results"
          onContinue={() => setPhase("stage2")}
        />
      );
    case "stage2":
      return <TestAnalyseModify modification={modification} onComplete={handleS2} />;
    case "intro3":
      return (
        <NarrativeScreen
          emoji="👨‍🍳"
          title="A Second Game Needs Help"
          narrative="Another game, Space Chef, has the same symptoms. But be careful — what worked before might not work here."
          buttonLabel="Investigate"
          onContinue={() => setPhase("stage3")}
        />
      );
    case "stage3":
      return <NewProblemOldSolution previousModification={modification} onComplete={handleS3} />;
  }
}
