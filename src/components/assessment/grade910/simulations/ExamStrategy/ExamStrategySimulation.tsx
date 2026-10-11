"use client";

import { useState, useCallback } from "react";
import type { QuestionAnswer } from "../../types";
import NarrativeScreen from "../../../grade68/shared/NarrativeScreen";
import PlanPreview from "./stages/PlanPreview";
import StrategyUnderPressure from "./stages/StrategyUnderPressure";
import FinalConstraint from "./stages/FinalConstraint";

type Phase = "intro1" | "stage1" | "intro2" | "stage2" | "intro3" | "stage3";

interface Props {
  onComplete: (answers: QuestionAnswer[]) => void;
}

export default function ExamStrategySimulation({ onComplete }: Props) {
  const [phase, setPhase] = useState<Phase>("intro1");
  const [answers, setAnswers] = useState<QuestionAnswer[]>([]);
  const [sectionOrder, setSectionOrder] = useState<string[]>([]);
  const [flaggedSections, setFlaggedSections] = useState<string[]>([]);
  const [strategyChoice, setStrategyChoice] = useState("");

  const handleS1 = useCallback(
    (answer: QuestionAnswer, order: string[], flagged: string[]) => {
      setSectionOrder(order);
      setFlaggedSections(flagged);
      setAnswers((prev) => [...prev, answer]);
      setPhase("intro2");
    },
    []
  );

  const handleS2 = useCallback(
    (answer: QuestionAnswer, strategy: string) => {
      setStrategyChoice(strategy);
      setAnswers((prev) => [...prev, answer]);
      setPhase("intro3");
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
          emoji="📝"
          title="Exam Strategy Lab"
          narrative="You're about to take a mock final exam with 4 sections and limited time. Before the clock starts, you can preview the sections, plan your approach, and flag tricky areas. Smart planning leads to better results!"
          buttonLabel="Preview the Exam"
          onContinue={() => setPhase("stage1")}
        />
      );
    case "stage1":
      return <PlanPreview onComplete={handleS1} />;
    case "intro2":
      return (
        <NarrativeScreen
          emoji="⚠️"
          title="Progress Check"
          narrative="You're partway through the exam, but things aren't going as planned. A progress update shows you're behind schedule. How will you adapt?"
          buttonLabel="See Your Progress"
          onContinue={() => setPhase("stage2")}
        />
      );
    case "stage2":
      return (
        <StrategyUnderPressure
          sectionOrder={sectionOrder}
          flaggedSections={flaggedSections}
          onComplete={handleS2}
        />
      );
    case "intro3":
      return (
        <NarrativeScreen
          emoji="⏰"
          title="Final Minutes"
          narrative="Time is almost up. You have 10 minutes left and several questions remaining. Every minute counts now."
          buttonLabel="Make Final Decisions"
          onContinue={() => setPhase("stage3")}
        />
      );
    case "stage3":
      return (
        <FinalConstraint
          flaggedSections={flaggedSections}
          strategyChoice={strategyChoice}
          onComplete={handleS3}
        />
      );
  }
}
