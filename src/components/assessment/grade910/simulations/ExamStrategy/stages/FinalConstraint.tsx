"use client";

import { useState, useCallback } from "react";
import { buildAnswer, type QuestionAnswer } from "../../../types";
import ResourceAllocator, { type Category } from "../../../../grade68/shared/ResourceAllocator";
import { useStageTimer } from "../../../../grade68/shared/useStageTimer";

interface FinalConstraintProps {
  flaggedSections: string[];
  strategyChoice: string;
  onComplete: (answer: QuestionAnswer) => void;
}

const CATEGORIES: Category[] = [
  { key: "easy_new", label: "New Easy Questions", emoji: "✅", min: 0 },
  { key: "hard_new", label: "New Hard Questions", emoji: "🔥", min: 0 },
  { key: "flagged", label: "Flagged Questions", emoji: "🚩", min: 0 },
  { key: "verify", label: "Verify Answers", emoji: "🔍", min: 0 },
  { key: "abandon", label: "Accept & Move On", emoji: "👋", min: 0 },
];

export default function FinalConstraint({
  flaggedSections,
  strategyChoice,
  onComplete,
}: FinalConstraintProps) {
  const [allocation, setAllocation] = useState<Record<string, number>>({
    easy_new: 2,
    hard_new: 2,
    flagged: 2,
    verify: 2,
    abandon: 2,
  });
  const [touched, setTouched] = useState(false);
  const timer = useStageTimer();

  const total = Object.values(allocation).reduce((s, v) => s + v, 0);
  const canSubmit = touched && total === 10;

  const handleChange = useCallback((vals: Record<string, number>) => {
    setAllocation(vals);
    setTouched(true);
  }, []);

  const handleSubmit = useCallback(() => {
    if (!canSubmit) return;

    const elapsed = timer.elapsed();
    const abandonRatio = (allocation.abandon ?? 0) / 10;
    const easyNew = allocation.easy_new ?? 0;
    const hardNew = allocation.hard_new ?? 0;
    const strategicScore =
      easyNew + hardNew > 0
        ? Math.min(1, (easyNew * 1 + hardNew * 0.5) / 5)
        : 0.3;

    const answer = buildAnswer(
      "g910-exam-s3-final",
      JSON.stringify(allocation),
      "PAC",
      "ATT",
      [
        { param: "PAC", metric: "effort_allocation", value: Math.min(1, Math.max(0, 1.0 - abandonRatio)), weight: 1.0 },
        { param: "PAC", metric: "continued_under_pressure", value: Math.min(1, elapsed / 25000), weight: 0.7 },
        { param: "ATT", metric: "pacing_under_pressure", value: Math.min(1, Math.max(0, strategicScore)), weight: 0.8 },
        { param: "FB", metric: "adaptive_revisiting", value: (allocation.flagged ?? 0) > 0 ? 0.8 : 0.3, weight: 0.5 },
      ],
      {
        easyNew,
        hardNew,
        flagged: allocation.flagged ?? 0,
        verify: allocation.verify ?? 0,
        abandon: allocation.abandon ?? 0,
        elapsedMs: elapsed,
      }
    );

    onComplete(answer);
  }, [canSubmit, allocation, timer, onComplete]);

  const remaining = 10 - total;

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-1">
        <h2 className="text-xl font-bold text-gray-800">Stage 3: Final 10 Minutes</h2>
        <p className="text-sm text-gray-500">Time is almost up. Allocate your remaining minutes wisely.</p>
      </div>

      <div className="bg-red-50 border border-red-200 rounded-xl p-4 space-y-2">
        <div className="flex items-center gap-2 text-red-700 font-semibold">
          <span>⏰</span>
          <span>10 minutes remaining</span>
        </div>
        <p className="text-sm text-red-600">
          15 questions unanswered. {flaggedSections.length > 0 ? `${flaggedSections.length} flagged section(s) need verification. ` : ""}
          5 answered questions could be double-checked. How do you spend your final minutes?
        </p>
      </div>

      <div className="bg-slate-50 rounded-xl p-4 space-y-2 text-sm text-gray-600">
        <div className="font-medium text-gray-700">What remains:</div>
        <ul className="space-y-1 list-disc list-inside">
          <li>6 easy unanswered questions (~1 min each)</li>
          <li>9 hard unanswered questions (~2 min each)</li>
          {flaggedSections.length > 0 && (
            <li>{flaggedSections.length} flagged section(s) to verify</li>
          )}
          <li>5 existing answers to double-check</li>
        </ul>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
        <ResourceAllocator
          categories={CATEGORIES}
          total={10}
          initialValues={allocation}
          onChange={handleChange}
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
        {remaining > 0 ? `${remaining} minutes left to allocate` : "Submit Final Plan"}
      </button>
    </div>
  );
}
