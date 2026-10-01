"use client";

import { useState, useCallback } from "react";
import type { QuestionAnswer } from "../../types";
import NarrativeScreen from "../../shared/NarrativeScreen";
import FoundingAllocation from "./stages/FoundingAllocation";
import ConsequenceShift from "./stages/ConsequenceShift";
import NovelConstraint from "./stages/NovelConstraint";

type Phase = "intro1" | "stage1" | "intro2" | "stage2" | "intro3" | "stage3";

interface Props {
  onComplete: (answers: QuestionAnswer[]) => void;
}

export default function CityBuilderSimulation({ onComplete }: Props) {
  const [phase, setPhase] = useState<Phase>("intro1");
  const [answers, setAnswers] = useState<QuestionAnswer[]>([]);
  const [allocation, setAllocation] = useState<Record<string, number>>({});

  const handleS1 = useCallback((answer: QuestionAnswer) => {
    const alloc: Record<string, number> = {
      housing: answer.rawMetrics?.housing ?? 25,
      water: answer.rawMetrics?.water ?? 25,
      roads: answer.rawMetrics?.roads ?? 25,
      schools: answer.rawMetrics?.schools ?? 25,
    };
    setAllocation(alloc);
    setAnswers((prev) => [...prev, answer]);
    setPhase("intro2");
  }, []);

  const handleS2 = useCallback((answer: QuestionAnswer) => {
    const updated: Record<string, number> = {
      housing: answer.rawMetrics?.housing ?? allocation.housing,
      water: answer.rawMetrics?.water ?? allocation.water,
      roads: answer.rawMetrics?.roads ?? allocation.roads,
      schools: answer.rawMetrics?.schools ?? allocation.schools,
    };
    setAllocation(updated);
    setAnswers((prev) => [...prev, answer]);
    setPhase("intro3");
  }, [allocation]);

  const handleS3 = useCallback(
    (answer: QuestionAnswer) => {
      const all = [...answers, answer];
      onComplete(all);
    },
    [answers, onComplete]
  );

  switch (phase) {
    case "intro1":
      return (
        <NarrativeScreen
          emoji="🏙️"
          title="City Builder: Greenfield"
          narrative="Welcome to Greenfield, a city of 12,000 people! As the new city planner, you'll decide how to invest in your growing community. Review the data, weigh the trade-offs, and allocate your budget wisely."
          buttonLabel="Start Planning"
          onContinue={() => setPhase("stage1")}
        />
      );
    case "stage1":
      return <FoundingAllocation onComplete={handleS1} />;
    case "intro2":
      return (
        <NarrativeScreen
          emoji="🚨"
          title="A Crisis Strikes!"
          narrative="A crisis has struck Greenfield, and a big tech company wants to move in. You've been given 30 bonus budget units to respond. How will you adapt your plan?"
          buttonLabel="See What Happened"
          onContinue={() => setPhase("stage2")}
        />
      );
    case "stage2":
      return <ConsequenceShift prevAllocation={allocation} onComplete={handleS2} />;
    case "intro3":
      return (
        <NarrativeScreen
          emoji="🌿"
          title="New Regulations"
          narrative="New environmental regulations change the rules. Road spending is capped and the budget is reduced. Can you find creative solutions to keep the city moving?"
          buttonLabel="Adapt Your Plan"
          onContinue={() => setPhase("stage3")}
        />
      );
    case "stage3":
      return <NovelConstraint prevAllocation={allocation} onComplete={handleS3} />;
  }
}
