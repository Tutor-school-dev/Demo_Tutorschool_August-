"use client";

import { useState } from "react";
import { AssessmentPayload, AssessmentResponse, computeCognitiveScores } from "@/lib/cognitiveScoring";

export type { AssessmentPayload, AssessmentResponse, CognitiveParameter } from "@/lib/cognitiveScoring";

export const useCognitiveAssessment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [alreadyCompleted, setAlreadyCompleted] = useState(false);

  const submitAssessment = async (payload: AssessmentPayload): Promise<AssessmentResponse | null> => {
    setLoading(true);
    setError(null);
    setAlreadyCompleted(false);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      const result = computeCognitiveScores(payload);
      return result;
    } catch {
      setError("Failed to process assessment");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    submitAssessment,
    loading,
    error,
    alreadyCompleted,
  };
};
