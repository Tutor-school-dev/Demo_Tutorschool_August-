"use client";

import { useState, useCallback } from "react";
import { buildAnswer, type QuestionAnswer } from "../../../types";
import InfoPanel from "../../../shared/InfoPanel";
import { useInspectionTracker } from "../../../shared/useInspectionTracker";
import { useStageTimer } from "../../../shared/useStageTimer";

interface Props {
  previousModification: string;
  onComplete: (answer: QuestionAnswer) => void;
}

const SPACE_CHEF_PANELS = [
  { id: "sc-retention", title: "Player Retention", icon: "📊", summary: "Level completion rates", detail: "Level 1: 92%, Level 2: 85%, Level 3: 78%, Level 4: 35%. Similar drop pattern to Dragon Dash." },
  { id: "sc-difficulty", title: "Difficulty Scores", icon: "📈", summary: "Challenge curve data", detail: "Difficulty increases steadily: 1.5, 2.8, 4.2, 5.5, 6.8. The challenge curve looks healthy — this is NOT a difficulty problem." },
  { id: "sc-variety", title: "Recipe Variety", icon: "🍳", summary: "Content diversity metrics", detail: "Levels 1-3: 12 unique recipes. Levels 4-8: Only 4 recycled recipes with minor variations. Players see the same dishes." },
  { id: "sc-feedback", title: "Player Feedback", icon: "💬", summary: "Recent reviews", detail: "'Same recipes over and over' (★★), 'Cooking the same thing gets old' (★★), 'Love the concept but needs more dishes' (★★★)." },
];

const DIAGNOSES = [
  { key: "variety_problem", label: "Players are bored by repetitive content, not difficulty — they need variety", score: 1.0 },
  { key: "difficulty_too_high", label: "The difficulty curve is now too steep after our changes", score: 0.2 },
  { key: "tutorial_needed", label: "Players need better onboarding for the cooking mechanics", score: 0.3 },
  { key: "economy_issue", label: "The reward system doesn't motivate trying new recipes", score: 0.5 },
];

const MOD_LABELS: Record<string, string> = {
  difficulty_curve: "difficulty curve fix",
  new_mechanic: "power-up system",
  coin_rewards: "coin economy restructure",
};

export default function NewProblemOldSolution({ previousModification, onComplete }: Props) {
  const [diagnosis, setDiagnosis] = useState<string | null>(null);

  const tracker = useInspectionTracker(4);
  const timer = useStageTimer();

  const modLabel = MOD_LABELS[previousModification] ?? "Dragon Dash fix";

  const handleSubmit = useCallback(() => {
    if (!diagnosis) return;

    const diagScore = DIAGNOSES.find((d) => d.key === diagnosis)?.score ?? 0.5;
    const inspected = tracker.panelsInspected();

    const answer = buildAnswer(
      "game-studio-s3-new-problem",
      diagnosis,
      "ABS",
      "PAC",
      [
        { param: "ABS", metric: "reframe_quality", value: diagScore, weight: 1.0 },
        { param: "ABS", metric: "transfer_awareness", value: inspected / 4, weight: 0.8 },
        { param: "PAC", metric: "failure_recovery", value: Math.min(1, timer.elapsed() / 30000), weight: 0.5 },
      ],
      {
        panelsInspected: inspected,
        elapsedMs: timer.elapsed(),
      }
    );

    onComplete(answer);
  }, [diagnosis, tracker, timer, previousModification, onComplete]);

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-1">
        <h2 className="text-xl font-bold text-gray-800">Stage 3: New Problem, Old Solution</h2>
        <p className="text-sm text-gray-500">Another game needs help — but be careful with assumptions.</p>
      </div>

      <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl">👨‍🍳</span>
          <div>
            <h3 className="font-bold text-purple-800">Space Chef — Same Symptom?</h3>
            <p className="text-sm text-purple-700">A puzzle-cooking game where players leave around level 3-4 — just like Dragon Dash.</p>
          </div>
        </div>
      </div>

      <div className="bg-red-50 border border-red-200 rounded-xl p-4 space-y-2">
        <h3 className="font-bold text-red-800">⚠️ Your Fix Made It Worse</h3>
        <p className="text-sm text-red-700">
          Your {modLabel} from Dragon Dash was applied to Space Chef. Result: Level 4 retention <strong>dropped
          further to 28%</strong>. The same fix doesn&apos;t work here.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {SPACE_CHEF_PANELS.map((p) => (
          <InfoPanel key={p.id} id={p.id} title={p.title} icon={p.icon} summary={p.summary} detail={p.detail} onToggle={tracker.toggle} />
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-3">
        <h3 className="font-semibold text-gray-800 text-sm">What is Space Chef&apos;s real problem?</h3>
        <div className="space-y-2">
          {DIAGNOSES.map((d) => (
            <label key={d.key} className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${diagnosis === d.key ? "border-indigo-400 bg-indigo-50" : "border-gray-200 hover:border-gray-300"}`}>
              <input type="radio" name="sc-diagnosis" checked={diagnosis === d.key} onChange={() => setDiagnosis(d.key)} className="mt-0.5 accent-indigo-600" />
              <span className="text-sm text-gray-700">{d.label}</span>
            </label>
          ))}
        </div>
      </div>

      <button onClick={handleSubmit} disabled={!diagnosis} className={`w-full py-3 rounded-xl font-semibold text-white transition-all duration-200 ${diagnosis ? "bg-indigo-600 hover:bg-indigo-500 shadow-md hover:shadow-lg cursor-pointer active:scale-[0.98]" : "bg-gray-300 cursor-not-allowed"}`}>
        {diagnosis ? "Submit Diagnosis" : "Select a diagnosis"}
      </button>
    </div>
  );
}
