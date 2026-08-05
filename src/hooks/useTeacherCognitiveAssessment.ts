"use client";

import { useState } from "react";
import { TeacherAssessmentPayload, TeacherAssessmentResponse, computeTeacherCognitiveScores } from "@/lib/teacherCognitiveScoring";

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
      await new Promise(resolve => setTimeout(resolve, 1500));
      const result = computeTeacherCognitiveScores(payload);
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
