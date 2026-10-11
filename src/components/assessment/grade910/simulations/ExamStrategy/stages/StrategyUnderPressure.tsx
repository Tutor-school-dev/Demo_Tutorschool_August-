"use client";

import { useState, useCallback } from "react";
import { buildAnswer, type QuestionAnswer } from "../../../types";
import ConfidenceSlider from "../../../../grade68/shared/ConfidenceSlider";
import { useStageTimer } from "../../../../grade68/shared/useStageTimer";

interface StrategyUnderPressureProps {
  sectionOrder: string[];
  flaggedSections: string[];
  onComplete: (answer: QuestionAnswer, strategy: string) => void;
}

const SECTION_LABELS: Record<string, string> = {
  math: "Mathematics",
  science: "Science",
  english: "English",
  social: "Social Studies",
};

const SECTION_COUNTS: Record<string, number> = {
  math: 15,
  science: 12,
  english: 10,
  social: 8,
};

const STRATEGY_OPTIONS = [
  { key: "continue_current", label: "Keep going at my current pace — I'll speed up naturally", score: 0.4 },
  { key: "skip_to_easier", label: "Skip to the easiest section to rack up quick marks", score: 0.7 },
  { key: "revisit_flagged", label: "Go back to my flagged sections — finish what I started", score: 0.8 },
  { key: "change_strategy", label: "Rethink my whole approach — focus on highest-value questions first", score: 0.9 },
];

export default function StrategyUnderPressure({
  sectionOrder,
  flaggedSections,
  onComplete,
}: StrategyUnderPressureProps) {
  const [strategy, setStrategy] = useState("");
  const [confidence, setConfidence] = useState(3);
  const timer = useStageTimer();

  const canSubmit = strategy !== "";

  const handleSubmit = useCallback(() => {
    if (!canSubmit) return;

    const elapsed = timer.elapsed();
    const choiceScore = STRATEGY_OPTIONS.find((o) => o.key === strategy)?.score ?? 0.5;
    const moderateTime = elapsed > 5000 && elapsed < 45000 ? 0.8 : 0.4;

    const answer = buildAnswer(
      "g910-exam-s2-pressure",
      strategy,
      "FB",
      "PAC",
      [
        { param: "FB", metric: "strategy_change_after_feedback", value: Math.min(1, Math.max(0, choiceScore)), weight: 1.0 },
        { param: "PAC", metric: "continued_effort", value: Math.min(1, elapsed / 30000), weight: 0.8 },
        { param: "ATT", metric: "rt_variability", value: moderateTime, weight: 0.5 },
        { param: "STR", metric: "confidence_calibration", value: Math.min(1, confidence / 5), weight: 0.4 },
      ],
      {
        strategyChoice: STRATEGY_OPTIONS.findIndex((o) => o.key === strategy),
        confidence,
        elapsedMs: elapsed,
      }
    );

    onComplete(answer, strategy);
  }, [canSubmit, strategy, confidence, timer, onComplete]);

  const section1 = sectionOrder[0] || "math";
  const section2 = sectionOrder[1] || "science";
  const completedCount = SECTION_COUNTS[section1] ?? 10;

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-1">
        <h2 className="text-xl font-bold text-gray-800">Stage 2: Mid-Exam Progress Check</h2>
        <p className="text-sm text-gray-500">Your progress so far, and a decision to make.</p>
      </div>

      <div className="bg-red-50 border border-red-200 rounded-xl p-4 space-y-2">
        <div className="flex items-center gap-2 text-red-700 font-semibold">
          <span>⚠️</span>
          <span>Progress Alert</span>
        </div>
        <p className="text-sm text-red-600">
          You've completed 12 of 45 questions in 40 minutes. At this pace, you'll finish only 27
          questions before time runs out. You're currently in{" "}
          <strong>{SECTION_LABELS[section2] || "Science"}</strong>.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-3">
        <h3 className="font-semibold text-gray-700 text-sm">Progress Comparison</h3>
        <div className="space-y-2">
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-gray-500">
              <span>Expected Progress</span>
              <span>44%</span>
            </div>
            <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-gray-400 rounded-full" style={{ width: "44%" }} />
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-red-500">
              <span>Your Progress</span>
              <span>27%</span>
            </div>
            <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-red-400 rounded-full" style={{ width: "27%" }} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {sectionOrder.map((sec, i) => {
          const done = i === 0;
          const inProgress = i === 1;
          return (
            <div
              key={sec || i}
              className={`rounded-lg border p-3 text-center text-sm ${
                done
                  ? "bg-green-50 border-green-200 text-green-700"
                  : inProgress
                  ? "bg-amber-50 border-amber-200 text-amber-700"
                  : "bg-gray-50 border-gray-200 text-gray-400"
              }`}
            >
              <div className="font-medium">{SECTION_LABELS[sec] || sec}</div>
              <div className="text-xs mt-1">
                {done
                  ? `✅ ${completedCount - 2}/${SECTION_COUNTS[sec] ?? 10} done`
                  : inProgress
                  ? `🕑 2/${SECTION_COUNTS[sec] ?? 10} in progress`
                  : "🔒 Not started"}
              </div>
            </div>
          );
        })}
      </div>

      {flaggedSections.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-700">
          🚩 You flagged {flaggedSections.length} section(s) for review:{" "}
          {flaggedSections.map((s) => SECTION_LABELS[s] || s).join(", ")}.
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-3">
        <h3 className="font-semibold text-gray-800">What's your strategy now?</h3>
        <div className="space-y-2">
          {STRATEGY_OPTIONS.map((opt) => (
            <label
              key={opt.key}
              className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                strategy === opt.key
                  ? "border-indigo-400 bg-indigo-50"
                  : "border-gray-200 hover:bg-gray-50"
              }`}
            >
              <input
                type="radio"
                name="strategy"
                value={opt.key}
                checked={strategy === opt.key}
                onChange={() => setStrategy(opt.key)}
                className="mt-0.5 accent-indigo-500"
              />
              <span className="text-sm text-gray-700">{opt.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex flex-col items-center">
        <ConfidenceSlider
          label="How confident are you about recovering your pace?"
          onChange={setConfidence}
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={!canSubmit}
        className={`w-full py-3 rounded-xl font-semibold text-white transition-all duration-200 ${
          canSubmit
            ? "bg-indigo-600 hover:bg-indigo-500 shadow-md hover:shadow-lg cursor-pointer active:scale-[0.98]"
            : "bg-gray-300 cursor-not-allowed"
        }`}
      >
        {canSubmit ? "Confirm Strategy" : "Choose a strategy to continue"}
      </button>
    </div>
  );
}
