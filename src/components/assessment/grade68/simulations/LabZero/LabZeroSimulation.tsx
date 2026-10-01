"use client";

import { useState, useCallback } from "react";
import type { QuestionAnswer } from "../../types";
import NarrativeScreen from "../../shared/NarrativeScreen";
import AnomalyHypothesis from "./stages/AnomalyHypothesis";
import ConflictingEvidence from "./stages/ConflictingEvidence";
import TransferDomain from "./stages/TransferDomain";

type Phase = "intro1" | "stage1" | "intro2" | "stage2" | "intro3" | "stage3";

interface Props {
  onComplete: (answers: QuestionAnswer[]) => void;
}

export default function LabZeroSimulation({ onComplete }: Props) {
  const [phase, setPhase] = useState<Phase>("intro1");
  const [answers, setAnswers] = useState<QuestionAnswer[]>([]);
  const [hypothesis, setHypothesis] = useState("soil_acidity");
  const [investigation, setInvestigation] = useState("soil_test");

  const handleS1 = useCallback((answer: QuestionAnswer, hyp: string, inv: string) => {
    setHypothesis(hyp);
    setInvestigation(inv);
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
          emoji="🔬"
          title="Lab Zero: The Unknown Experiment"
          narrative="Welcome to Lab Zero, the research facility. Something strange is happening in the greenhouses — plants in Greenhouse A are growing 3× faster than Greenhouse B. Can you figure out why?"
          buttonLabel="Begin Investigation"
          onContinue={() => setPhase("stage1")}
        />
      );
    case "stage1":
      return <AnomalyHypothesis onComplete={handleS1} />;
    case "intro2":
      return (
        <NarrativeScreen
          emoji="📊"
          title="Results Are In"
          narrative="Your first experiment results are in. But science is rarely simple — the evidence might not say what you expect."
          buttonLabel="Review Results"
          onContinue={() => setPhase("stage2")}
        />
      );
    case "stage2":
      return <ConflictingEvidence hypothesis={hypothesis} investigation={investigation} onComplete={handleS2} />;
    case "intro3":
      return (
        <NarrativeScreen
          emoji="🍞"
          title="A New Mystery"
          narrative="A bakery in town needs your scientific thinking. Can you spot the hidden pattern?"
          buttonLabel="Investigate"
          onContinue={() => setPhase("stage3")}
        />
      );
    case "stage3":
      return <TransferDomain onComplete={handleS3} />;
  }
}
