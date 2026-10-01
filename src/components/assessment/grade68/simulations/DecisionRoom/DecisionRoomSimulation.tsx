"use client";

import { useState, useCallback } from "react";
import type { QuestionAnswer } from "../../types";
import NarrativeScreen from "../../shared/NarrativeScreen";
import InitialAssessment from "./stages/InitialAssessment";
import NewEvidenceChallenge from "./stages/NewEvidenceChallenge";
import EscalationTransfer from "./stages/EscalationTransfer";

type Phase = "intro1" | "stage1" | "intro2" | "stage2" | "intro3" | "stage3";

interface Props {
  onComplete: (answers: QuestionAnswer[]) => void;
}

export default function DecisionRoomSimulation({ onComplete }: Props) {
  const [phase, setPhase] = useState<Phase>("intro1");
  const [answers, setAnswers] = useState<QuestionAnswer[]>([]);
  const [proposal, setProposal] = useState("computers");

  const handleS1 = useCallback((answer: QuestionAnswer, prop: string) => {
    setProposal(prop);
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
          narrative="Your school just received a ₹50,000 donation. As student council president, you'll review four proposals and decide how to spend it. Everyone has an opinion — but the choice is yours."
          buttonLabel="Review Proposals"
          onContinue={() => setPhase("stage1")}
        />
      );
    case "stage1":
      return <InitialAssessment onComplete={handleS1} />;
    case "intro2":
      return (
        <NarrativeScreen
          emoji="📰"
          title="Plot Twist"
          narrative="New information has come to light, and not everyone agrees with your choice. Can you handle the pressure of conflicting evidence?"
          buttonLabel="See the Evidence"
          onContinue={() => setPhase("stage2")}
        />
      );
    case "stage2":
      return <NewEvidenceChallenge proposal={proposal} onComplete={handleS2} />;
    case "intro3":
      return (
        <NarrativeScreen
          emoji="💡"
          title="Final Challenge"
          narrative="The budget just changed, and your sibling needs your wisdom. What have you learned from this whole experience?"
          buttonLabel="Face the Challenge"
          onContinue={() => setPhase("stage3")}
        />
      );
    case "stage3":
      return <EscalationTransfer onComplete={handleS3} />;
  }
}
