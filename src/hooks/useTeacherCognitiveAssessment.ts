"use client";

import { useState } from "react";
import { TeacherAssessmentPayload, TeacherAssessmentResponse, computeTeacherCognitiveScores } from "@/lib/teacherCognitiveScoring";
import { assessmentAPI } from "@/lib/api";

export type { TeacherAssessmentPayload, TeacherAssessmentResponse, TeacherCognitiveParameter } from "@/lib/teacherCognitiveScoring";

export const useTeacherCognitiveAssessment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [alreadyCompleted, setAlreadyCompleted] = useState(false);

  const submitAssessment = async (payload: TeacherAssessmentPayload): Promise<TeacherAssessmentResponse | null> => {
    setLoading(true);
    setError(null);
    setAlreadyCompleted(false);

    try {
      const result = computeTeacherCognitiveScores(payload);

      const events = [
        { parameter_key: "t1_pacing", observed_value: result.pacing.final_score / 100, source: "cognitive_assessment" },
        { parameter_key: "t2_scaffolding", observed_value: result.scaffolding.final_score / 100, source: "cognitive_assessment" },
        { parameter_key: "t3_feedback_style", observed_value: result.feedback_style.final_score / 100, source: "cognitive_assessment" },
        { parameter_key: "t4_explanation_style", observed_value: result.diagnostic_questioning.final_score / 100, source: "cognitive_assessment" },
        { parameter_key: "t5_motivation_style", observed_value: result.motivation_style.final_score / 100, source: "cognitive_assessment" },
        { parameter_key: "t6_adaptability", observed_value: result.cognitive_flexibility.final_score / 100, source: "cognitive_assessment" },
        { parameter_key: "t7_psychological_safety", observed_value: result.psychological_safety.final_score / 100, source: "cognitive_assessment" },
        { parameter_key: "t8_patience", observed_value: result.patience.final_score / 100, source: "cognitive_assessment" },
      ];

      try {
        await assessmentAPI.submit(events);
      } catch {
        // Backend unavailable — still return local results
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
