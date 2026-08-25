import { assessmentAPI } from "./api";

export type CognitiveParam = "ATT" | "WM" | "FB" | "STR" | "ABS" | "PER" | "PAC";

export interface QuestionAnswer {
  questionId: string;
  selectedKey: string;
  primaryParam: string;
  secondaryParam: string;
  primarySignal: string;
  secondarySignal: string;
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

interface ParamAccumulator {
  weightedSum: number;
  totalWeight: number;
  observations: number;
}

export function computeScores(answers: QuestionAnswer[]) {
  const accumulators: Record<string, ParamAccumulator> = {};

  const allParams = ["ATT", "WM", "FB", "STR", "ABS", "PER", "PAC"];
  for (const p of allParams) {
    accumulators[p] = { weightedSum: 0, totalWeight: 0, observations: 0 };
  }

  for (const answer of answers) {
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

  const scores: Record<string, { score: number; confidence: number; observations: number }> = {};

  for (const param of allParams) {
    const acc = accumulators[param];
    const score = acc.totalWeight > 0 ? acc.weightedSum / acc.totalWeight : 0.5;
    const confidence = Math.min(0.9, (acc.observations / 5) * 0.6 + 0.3);
    scores[param] = { score, confidence, observations: acc.observations };
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
