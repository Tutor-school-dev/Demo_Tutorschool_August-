import type { QuestionAnswer, BehavioralIndicator, CognitiveParam } from "@/lib/questionBankScoring";

export type { QuestionAnswer, BehavioralIndicator, CognitiveParam };

export interface SimulationComponentProps {
  onComplete: (answers: QuestionAnswer[]) => void;
}

export interface SimulationMeta {
  id: string;
  name: string;
  emoji: string;
  tagline: string;
  stageCount: number;
}

export const GRADE68_SIMULATIONS: SimulationMeta[] = [
  { id: "city-builder", name: "City Builder", emoji: "\u{1F3D9}️", tagline: "Plan a growing city", stageCount: 3 },
  { id: "lab-zero", name: "Lab Zero", emoji: "\u{1F52C}", tagline: "Investigate an unknown phenomenon", stageCount: 3 },
  { id: "game-studio", name: "Game Studio", emoji: "\u{1F3AE}", tagline: "Fix a broken game", stageCount: 3 },
  { id: "network-control", name: "Network Control", emoji: "\u{1F4E1}", tagline: "Route signals under pressure", stageCount: 3 },
  { id: "decision-room", name: "Decision Room", emoji: "⚖️", tagline: "Decide with incomplete information", stageCount: 3 },
];

export function buildAnswer(
  questionId: string,
  selectedKey: string,
  primaryParam: CognitiveParam,
  secondaryParam: CognitiveParam,
  indicators: BehavioralIndicator[],
  rawMetrics: Record<string, number>
): QuestionAnswer {
  const avg = (param: CognitiveParam) => {
    const matched = indicators.filter((i) => i.param === param);
    if (matched.length === 0) return 0.5;
    const wSum = matched.reduce((s, i) => s + i.value * i.weight, 0);
    const wTotal = matched.reduce((s, i) => s + i.weight, 0);
    return wTotal > 0 ? wSum / wTotal : 0.5;
  };
  const toSignal = (v: number) => (v > 0.7 ? "high" : v >= 0.4 ? "moderate" : "low");

  return {
    questionId,
    selectedKey,
    primaryParam,
    secondaryParam,
    primarySignal: toSignal(avg(primaryParam)),
    secondarySignal: toSignal(avg(secondaryParam)),
    indicators,
    rawMetrics,
  };
}
