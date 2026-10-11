"use client";

import { useState, useCallback } from "react";
import type { QuestionAnswer } from "../../types";
import NarrativeScreen from "../../../grade68/shared/NarrativeScreen";
import RequirementConflict from "./stages/RequirementConflict";
import DeadlineChange from "./stages/DeadlineChange";
import FailureRecovery from "./stages/FailureRecovery";

type Phase = "intro1" | "stage1" | "intro2" | "stage2" | "intro3" | "stage3";

interface Props {
  onComplete: (answers: QuestionAnswer[]) => void;
}

export default function ProjectCrisisSimulation({ onComplete }: Props) {
  const [phase, setPhase] = useState<Phase>("intro1");
  const [answers, setAnswers] = useState<QuestionAnswer[]>([]);
  const [approach, setApproach] = useState("combine_both");

  const handleS1 = useCallback((answer: QuestionAnswer, chosenApproach: string) => {
    setApproach(chosenApproach);
    setAnswers((prev) => [...prev, answer]);
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
          emoji="🚧"
          title="Project Crisis Room"
          narrative="Your team of 4 is building a water purification system for the school science fair. But the team can't agree on the approach, and the clock is ticking. Your job: resolve conflicts, manage constraints, and deliver a winning project."
          buttonLabel="Meet the Team"
          onContinue={() => setPhase("stage1")}
        />
      );
    case "stage1":
      return <RequirementConflict onComplete={handleS1} />;
    case "intro2":
      return (
        <NarrativeScreen
          emoji="📅"
          title="Deadline Moved Up!"
          narrative="Bad news — the science fair has been rescheduled one week earlier. Your 3-week plan just became a 2-week plan. Something has to change."
          buttonLabel="Revise the Plan"
          onContinue={() => setPhase("stage2")}
        />
      );
    case "stage2":
      return <DeadlineChange approach={approach} onComplete={handleS2} />;
    case "intro3":
      return (
        <NarrativeScreen
          emoji="💥"
          title="Something Went Wrong"
          narrative="Your approach hit an unexpected problem. The feedback is mixed — some things worked, some didn't. How you respond now will determine the final outcome."
          buttonLabel="Assess the Damage"
          onContinue={() => setPhase("stage3")}
        />
      );
    case "stage3":
      return <FailureRecovery approach={approach} onComplete={handleS3} />;
  }
}
