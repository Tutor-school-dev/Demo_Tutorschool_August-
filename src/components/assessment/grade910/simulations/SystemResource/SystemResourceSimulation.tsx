"use client";

import { useState, useCallback } from "react";
import type { QuestionAnswer } from "../../types";
import NarrativeScreen from "../../../grade68/shared/NarrativeScreen";
import BuildPlan from "./stages/BuildPlan";
import ResourceFailure from "./stages/ResourceFailure";
import SimultaneousChanges from "./stages/SimultaneousChanges";

type Phase = "intro1" | "stage1" | "intro2" | "stage2" | "intro3" | "stage3";

interface Props {
  onComplete: (answers: QuestionAnswer[]) => void;
}

export default function SystemResourceSimulation({ onComplete }: Props) {
  const [phase, setPhase] = useState<Phase>("intro1");
  const [answers, setAnswers] = useState<QuestionAnswer[]>([]);
  const [budgetAllocation, setBudgetAllocation] = useState<Record<string, number>>({});

  const handleS1 = useCallback(
    (answer: QuestionAnswer, allocation: Record<string, number>) => {
      setBudgetAllocation(allocation);
      setAnswers((prev) => [...prev, answer]);
      setPhase("intro2");
    },
    []
  );

  const handleS2 = useCallback(
    (answer: QuestionAnswer) => {
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
          emoji={"\u{1F4CB}"}
          title="System & Resource Control"
          narrative="You're the lead organizer for your school's Innovation Week — a 3-day event with talks, workshops, exhibits, and competitions. Budget is tight, venues are limited, and volunteers are scarce. Plan wisely!"
          buttonLabel="See the Brief"
          onContinue={() => setPhase("stage1")}
        />
      );
    case "stage1":
      return <BuildPlan onComplete={handleS1} />;
    case "intro2":
      return (
        <NarrativeScreen
          emoji={"\u{1F6A8}"}
          title="Resource Emergency"
          narrative="A critical venue just became unavailable. Two activities are now without a home. You need to rearrange the plan while keeping everything else on track."
          buttonLabel="Assess Options"
          onContinue={() => setPhase("stage2")}
        />
      );
    case "stage2":
      return <ResourceFailure budgetAllocation={budgetAllocation} onComplete={handleS2} />;
    case "intro3":
      return (
        <NarrativeScreen
          emoji={"\u{26A1}"}
          title="Double Disruption"
          narrative="Two problems hit at the same time: a venue shrank AND the schedule shortened. Handle the overload."
          buttonLabel="Manage the Crisis"
          onContinue={() => setPhase("stage3")}
        />
      );
    case "stage3":
      return <SimultaneousChanges onComplete={handleS3} />;
  }
}
