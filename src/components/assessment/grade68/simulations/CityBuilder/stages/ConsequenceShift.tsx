"use client";

import { useState, useCallback, useMemo } from "react";
import { buildAnswer, type QuestionAnswer } from "../../../types";
import InfoPanel from "../../../shared/InfoPanel";
import ResourceAllocator, { type Category } from "../../../shared/ResourceAllocator";
import { useInspectionTracker } from "../../../shared/useInspectionTracker";
import { useStageTimer } from "../../../shared/useStageTimer";

interface ConsequenceShiftProps {
  prevAllocation: Record<string, number>;
  onComplete: (answer: QuestionAnswer) => void;
}

const CRISIS_MESSAGES: Record<string, { title: string; detail: string }> = {
  housing: {
    title: "🚨 Housing Crisis",
    detail: "50 families are now homeless due to under-investment in housing. Emergency shelters are full and the city council faces public backlash.",
  },
  water: {
    title: "🚨 Water Shortage",
    detail: "Rolling water cuts affect 3,000 residents due to aging infrastructure. Hospitals and schools are on priority supply only.",
  },
  roads: {
    title: "🚨 Traffic Gridlock",
    detail: "A bridge collapse blocks the main highway. Emergency repairs are underway but commuters face 2-hour detours.",
  },
  schools: {
    title: "🚨 Teacher Shortage",
    detail: "Two schools merge classes — 45 students per classroom now. Teachers are overwhelmed and parents are protesting.",
  },
};

const CATEGORIES: Category[] = [
  { key: "housing", label: "Housing", emoji: "🏠", min: 0 },
  { key: "water", label: "Water", emoji: "💧", min: 0 },
  { key: "roads", label: "Roads", emoji: "🛣️", min: 0 },
  { key: "schools", label: "Schools", emoji: "📚", min: 0 },
];

export default function ConsequenceShift({ prevAllocation, onComplete }: ConsequenceShiftProps) {
  const crisisKey = useMemo(() => {
    let minKey = "housing";
    let minVal = Infinity;
    for (const [k, v] of Object.entries(prevAllocation)) {
      if (v < minVal) { minVal = v; minKey = k; }
    }
    return minKey;
  }, [prevAllocation]);

  const crisis = CRISIS_MESSAGES[crisisKey];

  const [bonusAllocation, setBonusAllocation] = useState<Record<string, number>>({
    housing: 0, water: 0, roads: 0, schools: 0,
  });

  const tracker = useInspectionTracker(2);
  const timer = useStageTimer();

  const bonusUsed = Object.values(bonusAllocation).reduce((s, v) => s + v, 0);
  const canSubmit = bonusUsed === 30;

  const handleSubmit = useCallback(() => {
    if (!canSubmit) return;

    const crisisUnitsAdded = bonusAllocation[crisisKey] ?? 0;
    const crisisResponse = Math.min(1, crisisUnitsAdded / 30);

    const prevTotal = Object.values(prevAllocation).reduce((s, v) => s + v, 0);
    const newTotal = prevTotal + 30;
    let shiftMagnitude = 0;
    for (const key of Object.keys(prevAllocation)) {
      const oldProp = prevAllocation[key] / prevTotal;
      const newVal = prevAllocation[key] + (bonusAllocation[key] ?? 0);
      const newProp = newVal / newTotal;
      shiftMagnitude += Math.abs(newProp - oldProp);
    }
    const normalizedShift = Math.min(1, shiftMagnitude / 0.5);

    const inspected = tracker.panelsInspected();
    const elapsed = timer.elapsedSeconds();

    const finalAllocation: Record<string, number> = {};
    for (const key of Object.keys(prevAllocation)) {
      finalAllocation[key] = prevAllocation[key] + (bonusAllocation[key] ?? 0);
    }

    const answer = buildAnswer(
      "city-builder-s2-consequence",
      JSON.stringify(finalAllocation),
      "FB",
      "PAC",
      [
        { param: "PAC", metric: "crisis_response", value: crisisResponse, weight: 1.0 },
        { param: "FB", metric: "allocation_shift", value: normalizedShift, weight: 1.0 },
        { param: "WM", metric: "new_data_checked", value: inspected / 2, weight: 0.5 },
        { param: "ATT", metric: "time_on_task", value: Math.min(1, elapsed / 60), weight: 0.3 },
      ],
      {
        crisisUnitsAdded,
        shiftMagnitude: Math.round(shiftMagnitude * 100),
        panelsInspected: inspected,
        elapsedSeconds: elapsed,
        ...finalAllocation,
      }
    );

    onComplete(answer);
  }, [canSubmit, bonusAllocation, crisisKey, prevAllocation, tracker, timer, onComplete]);

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-1">
        <h2 className="text-xl font-bold text-gray-800">Stage 2: Consequence &amp; Shifting Demand</h2>
        <p className="text-sm text-gray-500">
          A crisis has hit and new developments are coming. Distribute 30 bonus units wisely.
        </p>
      </div>

      {/* Crisis alert */}
      <div className="bg-red-50 border border-red-200 rounded-xl p-4">
        <h3 className="font-bold text-red-800 text-base">{crisis.title}</h3>
        <p className="text-sm text-red-700 mt-1">{crisis.detail}</p>
      </div>

      {/* Current allocation display */}
      <div className="bg-gray-50 rounded-xl border border-gray-200 p-4">
        <h4 className="text-sm font-semibold text-gray-600 mb-2">Your Current Allocation</h4>
        <div className="grid grid-cols-4 gap-2">
          {CATEGORIES.map((cat) => (
            <div key={cat.key} className="text-center">
              <span className="text-lg">{cat.emoji}</span>
              <p className="text-xs text-gray-500">{cat.label}</p>
              <p className="text-sm font-bold text-gray-800">{prevAllocation[cat.key] ?? 0}</p>
            </div>
          ))}
        </div>
      </div>

      {/* New info panels */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <InfoPanel
          id="novatech"
          title="NovaTech Impact"
          icon="🏢"
          summary="Major tech company moving to Greenfield"
          detail="NovaTech needs office space, fiber internet, and schooling for ~800 children of employees."
          onToggle={tracker.toggle}
        />
        <InfoPanel
          id="crisis-report"
          title="Crisis Report"
          icon="📋"
          summary={`Assessment of the ${crisisKey} situation`}
          detail={crisis.detail}
          onToggle={tracker.toggle}
        />
      </div>

      {/* Bonus allocation */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
        <h4 className="text-sm font-semibold text-amber-700 mb-3">
          ✨ 30 Bonus Units Available — Where will you invest?
        </h4>
        <ResourceAllocator
          categories={CATEGORIES}
          total={30}
          initialValues={bonusAllocation}
          onChange={setBonusAllocation}
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
        {bonusUsed < 30 ? `${30 - bonusUsed} bonus units left` : "Confirm New Plan"}
      </button>
    </div>
  );
}
