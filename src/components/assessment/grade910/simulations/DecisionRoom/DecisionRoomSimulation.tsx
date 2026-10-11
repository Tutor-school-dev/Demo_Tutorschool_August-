"use client";

import { useState, useCallback } from "react";
import type { QuestionAnswer } from "../../types";
import NarrativeScreen from "../../../grade68/shared/NarrativeScreen";
import InitialAssessment from "./stages/InitialAssessment";
import AssumptionChallenge from "./stages/AssumptionChallenge";
import TransferUnderPressure from "./stages/TransferUnderPressure";

type Phase = "intro1" | "stage1" | "intro2" | "stage2" | "intro3" | "stage3";

interface Props {
  onComplete: (answers: QuestionAnswer[]) => void;
}

export default function DecisionRoomSimulation({ onComplete }: Props) {
  const [phase, setPhase] = useState<Phase>("intro1");
  const [answers, setAnswers] = useState<QuestionAnswer[]>([]);
  const [decision, setDecision] = useState("hybrid");
  const [reasoning, setReasoning] = useState("evidence_mixed");

  const handleS1 = useCallback((answer: QuestionAnswer, dec: string, reason: string) => {
    setDecision(dec);
    setReasoning(reason);
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
          emoji="⚖️"
          title="The Decision Room"
          narrative="Your school is considering switching from paper-based exams to online exams. As the elected student representative, you must review the evidence and make a recommendation that affects 800 students. The evidence is mixed, the stakes are real, and not everyone will agree with you."
          buttonLabel="Review the Evidence"
          onContinue={() => setPhase("stage1")}
        />
      );
    case "stage1":
      return <InitialAssessment onComplete={handleS1} />;
    case "intro2":
      return (
        <NarrativeScreen
          emoji="📰"
          title="Your Assumption Challenged"
          narrative="New information has come to light that directly challenges a key assumption behind your recommendation. The pressure is on — how will you respond?"
          buttonLabel="See the Challenge"
          onContinue={() => setPhase("stage2")}
        />
      );
    case "stage2":
      return <AssumptionChallenge decision={decision} reasoning={reasoning} onComplete={handleS2} />;
    case "intro3":
      return (
        <NarrativeScreen
          emoji="⏱️"
          title="New Problem, Limited Time"
          narrative="Your neighbourhood needs your analytical thinking for a completely different issue. But time is short — you have 3 minutes."
          buttonLabel="Start the Clock"
          onContinue={() => setPhase("stage3")}
        />
      );
    case "stage3":
      return <TransferUnderPressure onComplete={handleS3} />;
  }
}
