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

export const GRADE910_SIMULATIONS: SimulationMeta[] = [
  { id: "exam-strategy", name: "Exam Strategy Lab", emoji: "\u{1F4DD}", tagline: "Plan and adapt under exam pressure", stageCount: 3 },
  { id: "research-evidence", name: "Research Evidence Lab", emoji: "\u{1F50D}", tagline: "Investigate a claim with conflicting evidence", stageCount: 3 },
  { id: "project-crisis", name: "Project Crisis Room", emoji: "\u{1F6A7}", tagline: "Manage a team project under changing constraints", stageCount: 3 },
  { id: "system-resource", name: "System & Resource Control", emoji: "\u{1F4CB}", tagline: "Plan an event with distributed constraints", stageCount: 3 },
  { id: "decision-room", name: "Decision Room", emoji: "⚖️", tagline: "Decide with incomplete and conflicting information", stageCount: 3 },
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
