"use client";

import { useState, useCallback } from "react";
import type { QuestionAnswer } from "../../types";
import NarrativeScreen from "../../../grade68/shared/NarrativeScreen";
import InvestigateSources from "./stages/InvestigateSources";
import EvidenceConflict from "./stages/EvidenceConflict";
import TransferDomain from "./stages/TransferDomain";

type Phase = "intro1" | "stage1" | "intro2" | "stage2" | "intro3" | "stage3";

interface Props {
  onComplete: (answers: QuestionAnswer[]) => void;
}

export default function ResearchEvidenceSimulation({ onComplete }: Props) {
  const [phase, setPhase] = useState<Phase>("intro1");
  const [answers, setAnswers] = useState<QuestionAnswer[]>([]);
  const [interpretation, setInterpretation] = useState("complex_relationship");

  const handleS1 = useCallback((answer: QuestionAnswer, interp: string) => {
    setInterpretation(interp);
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
          emoji="\u{1F50D}"
          title="Research Evidence Lab"
          narrative="Does playing video games for more than 2 hours daily harm academic performance? You'll investigate this claim using real research studies, statistics, and expert opinions. Examine the evidence carefully before forming your conclusion."
          buttonLabel="Begin Investigation"
          onContinue={() => setPhase("stage1")}
        />
      );
    case "stage1":
      return <InvestigateSources onComplete={handleS1} />;
    case "intro2":
      return (
        <NarrativeScreen
          emoji="\u{1F4E2}"
          title="New Evidence Arrives"
          narrative="A major new study has just been published that may change everything. The evidence might conflict with what you concluded. Science is about updating beliefs when new data arrives."
          buttonLabel="Review New Evidence"
          onContinue={() => setPhase("stage2")}
        />
      );
    case "stage2":
      return <EvidenceConflict interpretation={interpretation} onComplete={handleS2} />;
    case "intro3":
      return (
        <NarrativeScreen
          emoji="\u{1F500}"
          title="A Different Question"
          narrative="A different debate needs your analytical thinking. Can you apply what you've learned about evaluating evidence to a new topic?"
          buttonLabel="Investigate"
          onContinue={() => setPhase("stage3")}
        />
      );
    case "stage3":
      return <TransferDomain onComplete={handleS3} />;
  }
}
