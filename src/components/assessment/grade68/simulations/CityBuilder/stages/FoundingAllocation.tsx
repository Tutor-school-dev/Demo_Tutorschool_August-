"use client";

import { useState, useCallback } from "react";
import { buildAnswer, type QuestionAnswer } from "../../../types";
import ConfidenceSlider from "../../../shared/ConfidenceSlider";
import InfoPanel from "../../../shared/InfoPanel";
import ResourceAllocator, { type Category } from "../../../shared/ResourceAllocator";
import { useInspectionTracker } from "../../../shared/useInspectionTracker";
import { useStageTimer } from "../../../shared/useStageTimer";

interface FoundingAllocationProps {
  onComplete: (answer: QuestionAnswer) => void;
}

const INFO_PANELS = [
  {
    id: "housing",
    title: "Population Growth",
    icon: "🏠",
    summary: "12,000 residents and growing fast",
    detail: "12,000 residents, growing 8% yearly. 200 families on the waiting list for affordable homes.",
  },
  {
    id: "water",
    title: "Water Infrastructure",
    icon: "💧",
    summary: "Aging pipes nearing capacity",
    detail: "Current pipes serve 10,000. The purification plant runs at 85% capacity during summer peaks.",
  },
  {
    id: "roads",
    title: "Transport Network",
    icon: "🛣️",
    summary: "Commute times rising steadily",
    detail: "Main highway handles 5,000 vehicles daily. Average commute time has risen 15% in 2 years.",
  },
  {
    id: "schools",
    title: "Education System",
    icon: "📚",
    summary: "Schools stretched beyond capacity",
    detail: "3 schools serve 2,400 students. Class sizes average 35 students, above the 28-student recommended cap.",
  },
];

const CATEGORIES: Category[] = [
  { key: "housing", label: "Housing", emoji: "🏠", min: 10 },
  { key: "water", label: "Water", emoji: "💧", min: 10 },
  { key: "roads", label: "Roads", emoji: "🛣️", min: 10 },
  { key: "schools", label: "Schools", emoji: "📚", min: 10 },
];

export default function FoundingAllocation({ onComplete }: FoundingAllocationProps) {
  const [allocation, setAllocation] = useState<Record<string, number>>({
    housing: 25, water: 25, roads: 25, schools: 25,
  });
  const [confidence, setConfidence] = useState(3);
  const [touched, setTouched] = useState(false);

  const tracker = useInspectionTracker(4);
  const timer = useStageTimer();

  const remaining = 100 - Object.values(allocation).reduce((s, v) => s + v, 0);
  const canSubmit = touched && remaining === 0;

  const handleAllocationChange = useCallback((vals: Record<string, number>) => {
    setAllocation(vals);
    setTouched(true);
  }, []);

  const handleSubmit = useCallback(() => {
    if (!canSubmit) return;

    const inspected = tracker.panelsInspected();
    const dwellMs = tracker.totalDwellMs();

    const answer = buildAnswer(
      "city-builder-s1-founding",
      JSON.stringify(allocation),
      "STR",
      "WM",
      [
        { param: "STR", metric: "info_inspection", value: inspected / 4, weight: 1.0 },
        { param: "STR", metric: "confidence_calibration", value: confidence / 5, weight: 0.6 },
        { param: "WM", metric: "data_integration", value: Math.min(1, dwellMs / 15000), weight: 0.3 },
      ],
      {
        panelsInspected: inspected,
        totalDwellMs: dwellMs,
        confidence,
        housing: allocation.housing,
        water: allocation.water,
        roads: allocation.roads,
        schools: allocation.schools,
        elapsedMs: timer.elapsed(),
      }
    );

    onComplete(answer);
  }, [canSubmit, allocation, confidence, tracker, timer, onComplete]);

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-1">
        <h2 className="text-xl font-bold text-gray-800">Stage 1: Founding Allocation</h2>
        <p className="text-sm text-gray-500">
          Review the city data below, then allocate 100 budget units across four areas.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {INFO_PANELS.map((p) => (
          <InfoPanel
            key={p.id}
            id={p.id}
            title={p.title}
            icon={p.icon}
            summary={p.summary}
            detail={p.detail}
            onToggle={tracker.toggle}
          />
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
        <ResourceAllocator
          categories={CATEGORIES}
          total={100}
          initialValues={allocation}
          onChange={handleAllocationChange}
        />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex flex-col items-center">
        <ConfidenceSlider
          label="How confident are you in this allocation?"
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
        {remaining > 0 ? `${remaining} units left to allocate` : "Submit Allocation"}
      </button>
    </div>
  );
}
