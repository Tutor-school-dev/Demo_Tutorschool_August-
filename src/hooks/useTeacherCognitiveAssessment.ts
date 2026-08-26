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

      const params = [
        { parameter_key: "t1_pacing", score: result.pacing.final_score / 100, confidence: 0.8 },
        { parameter_key: "t2_scaffolding", score: result.scaffolding.final_score / 100, confidence: 0.8 },
        { parameter_key: "t3_feedback_style", score: result.feedback_style.final_score / 100, confidence: 0.8 },
        { parameter_key: "t4_explanation_style", score: result.diagnostic_questioning.final_score / 100, confidence: 0.8 },
        { parameter_key: "t5_motivation_style", score: result.motivation_style.final_score / 100, confidence: 0.8 },
        { parameter_key: "t6_adaptability", score: result.cognitive_flexibility.final_score / 100, confidence: 0.8 },
        { parameter_key: "t7_psychological_safety", score: result.psychological_safety.final_score / 100, confidence: 0.8 },
        { parameter_key: "t8_patience", score: result.patience.final_score / 100, confidence: 0.8 },
      ];

      const isDemo = typeof window !== "undefined" && localStorage.getItem("demo_mode") === "true";
      if (!isDemo) {
        await assessmentAPI.submit(params);
      } else {
        localStorage.setItem("teacher_assessment_scores", JSON.stringify(params));
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
