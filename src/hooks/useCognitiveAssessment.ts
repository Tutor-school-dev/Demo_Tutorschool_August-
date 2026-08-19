"use client";

import { useState } from "react";
import { AssessmentPayload, AssessmentResponse, computeCognitiveScores } from "@/lib/cognitiveScoring";
import { assessmentAPI } from "@/lib/api";

export type { AssessmentPayload, AssessmentResponse, CognitiveParameter } from "@/lib/cognitiveScoring";

function mapToBackendParams(result: AssessmentResponse) {
  return [
    { parameter_key: "s1", score: (result.confidence.final_score + (100 - result.impulsivity.final_score)) / 200, confidence: 0.8 },
    { parameter_key: "s2", score: (result.working_memory.final_score + result.working_memory_load_handling.final_score) / 200, confidence: 0.8 },
    { parameter_key: "s3", score: result.error_correction_ability.final_score / 100, confidence: 0.8 },
    { parameter_key: "s4", score: result.exploratory_nature.final_score / 100, confidence: 0.8 },
    { parameter_key: "s5", score: result.precision.final_score / 100, confidence: 0.8 },
    { parameter_key: "s7", score: result.confidence.final_score / 100, confidence: 0.8 },
  ];
}

export const useCognitiveAssessment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [alreadyCompleted, setAlreadyCompleted] = useState(false);

  const submitAssessment = async (payload: AssessmentPayload): Promise<AssessmentResponse | null> => {
    setLoading(true);
    setError(null);
    setAlreadyCompleted(false);

    try {
      const result = computeCognitiveScores(payload);

      const params = mapToBackendParams(result);
      await assessmentAPI.submit(params);

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
