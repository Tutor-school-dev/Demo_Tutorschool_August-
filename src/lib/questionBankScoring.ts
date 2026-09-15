import { assessmentAPI } from "./api";

export type CognitiveParam = "ATT" | "WM" | "FB" | "STR" | "ABS" | "PER" | "PAC";

export interface BehavioralIndicator {
  param: CognitiveParam;
  metric: string;
  value: number;
  weight: number;
}

export interface QuestionAnswer {
  questionId: string;
  selectedKey: string;
  primaryParam: string;
  secondaryParam: string;
  primarySignal: string;
  secondarySignal: string;
  indicators?: BehavioralIndicator[];
  rawMetrics?: Record<string, number>;
}

const SIGNAL_VALUES: Record<string, number> = {
  high: 0.8,
  moderate: 0.5,
  low: 0.2,
};

const PARAM_TO_BACKEND: Record<string, string> = {
  ATT: "s1_attention_stability",
  WM: "s2_working_memory",
  FB: "s3_feedback_sensitivity",
  STR: "s4_motivation",
  ABS: "s5_abstraction",
  PER: "s6_developmental_stage",
  PAC: "s7_persistence",
};

const PRIOR = 0.5;
const PRIOR_STRENGTH = 1.5;

interface ParamAccumulator {
  weightedSum: number;
  totalWeight: number;
  observations: number;
}

function getGradeDevStage(): number {
  if (typeof window === "undefined") return 0.5;
  const grade = localStorage.getItem("student_grade");
  if (grade === "Grade 4-5") return 0.5;
  if (grade === "Grade 6-8") return 0.65;
  if (grade === "Grade 9-10") return 0.8;
  return 0.5;
}

export function computeScores(answers: QuestionAnswer[]) {
  const allParams: CognitiveParam[] = ["ATT", "WM", "FB", "STR", "ABS", "PER", "PAC"];
  const accumulators: Record<string, ParamAccumulator> = {};

  for (const p of allParams) {
    accumulators[p] = { weightedSum: 0, totalWeight: 0, observations: 0 };
  }

  for (const answer of answers) {
    if (answer.indicators && answer.indicators.length > 0) {
      for (const ind of answer.indicators) {
        const acc = accumulators[ind.param];
        if (!acc) continue;
        const v = Math.max(0, Math.min(1, ind.value));
        acc.weightedSum += v * ind.weight;
        acc.totalWeight += ind.weight;
        acc.observations += 1;
      }
    } else {
      const primaryVal = SIGNAL_VALUES[answer.primarySignal] ?? 0.5;
      const secondaryVal = SIGNAL_VALUES[answer.secondarySignal] ?? 0.5;

      if (answer.primaryParam && accumulators[answer.primaryParam]) {
        accumulators[answer.primaryParam].weightedSum += primaryVal * 1.0;
        accumulators[answer.primaryParam].totalWeight += 1.0;
        accumulators[answer.primaryParam].observations += 1;
      }

      if (answer.secondaryParam && accumulators[answer.secondaryParam]) {
        accumulators[answer.secondaryParam].weightedSum += secondaryVal * 0.5;
        accumulators[answer.secondaryParam].totalWeight += 0.5;
        accumulators[answer.secondaryParam].observations += 1;
      }
    }
  }

  const scores: Record<string, { score: number; confidence: number; observations: number }> = {};

  for (const param of allParams) {
    if (param === "PER") {
      scores[param] = {
        score: getGradeDevStage(),
        confidence: 0.8,
        observations: 1,
      };
      continue;
    }

    const acc = accumulators[param];
    if (acc.totalWeight > 0) {
      const rawScore = acc.weightedSum / acc.totalWeight;
      const pooledScore =
        (rawScore * acc.totalWeight + PRIOR * PRIOR_STRENGTH) /
        (acc.totalWeight + PRIOR_STRENGTH);
      const confidence = Math.min(
        0.9,
        (acc.totalWeight / (acc.totalWeight + PRIOR_STRENGTH)) * 0.7 + 0.25
      );
      scores[param] = {
        score: Math.round(pooledScore * 1000) / 1000,
        confidence: Math.round(confidence * 100) / 100,
        observations: acc.observations,
      };
    } else {
      scores[param] = { score: PRIOR, confidence: 0.3, observations: 0 };
    }
  }

  return scores;
}

export async function submitScores(answers: QuestionAnswer[]) {
  const scores = computeScores(answers);

  const parameters = Object.entries(scores)
    .filter(([key]) => PARAM_TO_BACKEND[key])
    .map(([key, val]) => ({
      parameter_key: PARAM_TO_BACKEND[key],
      score: Math.round(val.score * 100) / 100,
      confidence: Math.round(val.confidence * 100) / 100,
      raw_data: { observations: val.observations },
    }));

  return assessmentAPI.submit(parameters);
}
