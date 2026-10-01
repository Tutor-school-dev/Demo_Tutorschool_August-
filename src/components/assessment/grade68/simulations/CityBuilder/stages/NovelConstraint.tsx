"use client";

import { useState, useCallback, useMemo } from "react";
import { buildAnswer, type QuestionAnswer } from "../../../types";
import ResourceAllocator, { type Category } from "../../../shared/ResourceAllocator";
import { useStageTimer } from "../../../shared/useStageTimer";

interface NovelConstraintProps {
  prevAllocation: Record<string, number>;
  onComplete: (answer: QuestionAnswer) => void;
}

export default function NovelConstraint({ prevAllocation, onComplete }: NovelConstraintProps) {
  const baseCategories: Category[] = useMemo(
    () => [
      { key: "housing", label: "Housing", emoji: "🏠", min: 5 },
      { key: "water", label: "Water", emoji: "💧", min: 5 },
      { key: "roads", label: "Roads", emoji: "🛣️", min: 0, max: 15 },
      { key: "schools", label: "Schools", emoji: "📚", min: 5 },
      { key: "transit", label: "Public Transit", emoji: "🚌", min: 0 },
    ],
    []
  );

  const [allocation, setAllocation] = useState<Record<string, number>>({
    housing: 20,
    water: 20,
    roads: 15,
    schools: 20,
    transit: 10,
  });

  const timer = useStageTimer();

  const total = 85;
  const used = Object.values(allocation).reduce((s, v) => s + v, 0);
  const canSubmit = used === total;

  const handleSubmit = useCallback(() => {
    if (!canSubmit) return;

    const usedTransit = (allocation.transit ?? 0) > 0;

    const origTotal = Object.values(prevAllocation).reduce((s, v) => s + v, 0);
    let strategyShift = 0;
    for (const key of Object.keys(prevAllocation)) {
      const oldProp = prevAllocation[key] / origTotal;
      const newProp = (allocation[key] ?? 0) / total;
      strategyShift += Math.abs(newProp - oldProp);
    }
    if (usedTransit) strategyShift += allocation.transit / total;
    const normalizedShift = Math.min(1, strategyShift / 0.6);

    const answer = buildAnswer(
      "city-builder-s3-constraint",
      JSON.stringify(allocation),
      "ABS",
      "PAC",
      [
        { param: "PAC", metric: "constraint_viability", value: canSubmit ? 1.0 : 0.3, weight: 1.0 },
        { param: "ABS", metric: "creative_transfer", value: usedTransit ? 1.0 : 0.2, weight: 1.0 },
        { param: "ABS", metric: "pattern_shift", value: normalizedShift, weight: 0.7 },
      ],
      {
        usedTransit: usedTransit ? 1 : 0,
        transitAmount: allocation.transit ?? 0,
        roadsAmount: allocation.roads ?? 0,
        strategyShift,
        elapsedMs: timer.elapsed(),
        ...allocation,
      }
    );

    onComplete(answer);
  }, [canSubmit, allocation, prevAllocation, timer, onComplete]);

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-1">
        <h2 className="text-xl font-bold text-gray-800">Stage 3: Novel Constraint</h2>
        <p className="text-sm text-gray-500">
          New regulations change the rules. Adapt your plan.
        </p>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-2">
        <h3 className="font-bold text-amber-800">⚠️ Environmental Regulation</h3>
        <p className="text-sm text-amber-700">
          New rules cap <strong>road spending at 15 units</strong>. Total budget reduced to <strong>85 units</strong>.
        </p>
      </div>

      <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 space-y-2">
        <h3 className="font-bold text-indigo-800">🚌 New Option: Public Transit</h3>
        <p className="text-sm text-indigo-700">
          The city can invest in a <strong>Public Transit</strong> system — buses and light rail that reduce road
          dependency and serve the same transportation needs.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
        <ResourceAllocator
          categories={baseCategories}
          total={total}
          initialValues={allocation}
          onChange={setAllocation}
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
        {used !== total ? `${total - used} units remaining` : "Finalize City Plan"}
      </button>
    </div>
  );
}
