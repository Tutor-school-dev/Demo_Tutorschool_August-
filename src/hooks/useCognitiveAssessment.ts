"use client";

import { useState } from "react";
import { AssessmentPayload, AssessmentResponse, computeCognitiveScores } from "@/lib/cognitiveScoring";
import { assessmentAPI } from "@/lib/api";

export type { AssessmentPayload, AssessmentResponse, CognitiveParameter } from "@/lib/cognitiveScoring";

function mapToBackendParams(result: AssessmentResponse) {
  return [
    { parameter_key: "s1", observed_value: (result.confidence.final_score + (100 - result.impulsivity.final_score)) / 200, source: "cognitive_assessment" },
    { parameter_key: "s2", observed_value: (result.working_memory.final_score + result.working_memory_load_handling.final_score) / 200, source: "cognitive_assessment" },
    { parameter_key: "s3", observed_value: result.error_correction_ability.final_score / 100, source: "cognitive_assessment" },
    { parameter_key: "s4", observed_value: result.exploratory_nature.final_score / 100, source: "cognitive_assessment" },
    { parameter_key: "s5", observed_value: result.precision.final_score / 100, source: "cognitive_assessment" },
    { parameter_key: "s7", observed_value: result.confidence.final_score / 100, source: "cognitive_assessment" },
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

      try {
        const events = mapToBackendParams(result);
        await assessmentAPI.submit(events);
      } catch {
        // Backend submission is best-effort; results still available locally
      }

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
