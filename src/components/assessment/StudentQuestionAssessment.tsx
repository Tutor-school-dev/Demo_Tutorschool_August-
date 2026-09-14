"use client";

import { useRouter } from "next/navigation";
import { QuestionAnswer, computeScores } from "@/lib/questionBankScoring";
import RescueMissionGame from "./RescueMissionGame";

export default function StudentQuestionAssessment() {
  const router = useRouter();

  const handleGameComplete = (answer: QuestionAnswer) => {
    const scores = computeScores([answer]);
    localStorage.setItem("assessment_scores", JSON.stringify(scores));
    router.push("/dashboard/student");
  };

  return <RescueMissionGame onComplete={handleGameComplete} />;
}
