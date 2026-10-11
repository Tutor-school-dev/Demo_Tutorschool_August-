"use client";

import { useState, useCallback } from "react";
import { buildAnswer, type QuestionAnswer } from "../../../types";
import ResourceAllocator, { type Category } from "../../../../grade68/shared/ResourceAllocator";
import { useStageTimer } from "../../../../grade68/shared/useStageTimer";

interface SimultaneousChangesProps {
  onComplete: (answer: QuestionAnswer) => void;
}

const PRIORITY_OPTIONS = [
  {
    key: "venue_first",
    label: "Handle the venue capacity reduction first — need to know which events still fit",
  },
  {
    key: "schedule_first",
    label: "Handle the schedule compression first — need to know what fits in 2 days",
  },
  {
    key: "both_together",
    label: "Address both changes simultaneously — they're interconnected",
  },
];

const COMBINED_CATEGORIES: Category[] = [
  { key: "keynote_combined", label: "Keynote + Quiz (combined)", emoji: "\u{1F399}️", min: 5 },
  { key: "robotics_coding", label: "Robotics/Coding (pick one)", emoji: "\u{1F916}", min: 5 },
  { key: "exhibit", label: "Innovation Exhibit", emoji: "\u{1F4A1}", min: 5 },
];

export default function SimultaneousChanges({ onComplete }: SimultaneousChangesProps) {
  const [priority, setPriority] = useState("");
  const [allocation, setAllocation] = useState<Record<string, number>>({
    keynote_combined: 17, robotics_coding: 17, exhibit: 16,
  });
  const [touched, setTouched] = useState(false);

  const timer = useStageTimer();

  const used = Object.values(allocation).reduce((s, v) => s + v, 0);
  const remaining = 50 - used;
  const allAboveMin = Object.values(allocation).every((v) => v >= 5);
  const canSubmit = priority !== "" && touched && remaining === 0;

  const handleAllocationChange = useCallback((vals: Record<string, number>) => {
    setAllocation(vals);
    setTouched(true);
  }, []);

  const handleSubmit = useCallback(() => {
    if (!canSubmit) return;

    const elapsedMs = timer.elapsed();

    const evenSplit = 50 / 3;
    let shiftMagnitude = 0;
    for (const val of Object.values(allocation)) {
      shiftMagnitude += Math.abs(val / 50 - evenSplit / 50);
    }
    const adaptiveReallocation = Math.min(1, shiftMagnitude / 0.5);

    const answer = buildAnswer(
      "g910-system-s3-simultaneous",
      JSON.stringify({ priority, allocation }),
      "WM",
      "ATT",
      [
        {
          param: "WM",
          metric: "load_adjusted_accuracy",
          value: remaining === 0 && allAboveMin ? 0.9 : 0.4,
          weight: 1.0,
        },
        {
          param: "WM",
          metric: "simultaneous_constraint_handling",
          value: priority === "both_together" ? 0.9 : 0.6,
          weight: 0.8,
        },
        {
          param: "ATT",
          metric: "prioritization_under_load",
          value: Math.min(1, Math.max(0, elapsedMs / 35000)),
          weight: 0.7,
        },
        {
          param: "FB",
          metric: "adaptive_reallocation",
          value: adaptiveReallocation,
          weight: 0.5,
        },
      ],
      {
        priorityChoice: PRIORITY_OPTIONS.findIndex((o) => o.key === priority),
        keynoteCombined: allocation.keynote_combined,
        roboticsCoding: allocation.robotics_coding,
        exhibit: allocation.exhibit,
        elapsedMs,
      }
    );

    onComplete(answer);
  }, [canSubmit, priority, allocation, remaining, allAboveMin, timer, onComplete]);

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-1">
        <h2 className="text-xl font-bold text-gray-800">Stage 3: Double Disruption</h2>
        <p className="text-sm text-gray-500">
          Two problems at once. Figure out what to handle first.
        </p>
      </div>

      <div className="space-y-3">
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <h3 className="font-bold text-red-800 text-sm">
            {"\u{1F3DB}️"} Auditorium Capacity Reduced
          </h3>
          <p className="text-sm text-red-700 mt-1">
            Half the seating is blocked for safety inspection. Capacity drops from{" "}
            <strong>200 to 120</strong>.
          </p>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <h3 className="font-bold text-amber-800 text-sm">
            {"\u{1F4C5}"} Day 3 Cancelled
          </h3>
          <p className="text-sm text-amber-700 mt-1">
            A school inspection has been scheduled on Day 3. Innovation Week is now{" "}
            <strong>only 2 days</strong>. Budget reduced to <strong>₹50,000</strong>{" "}
            (50 units).
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
        <h4 className="text-sm font-semibold text-gray-600 mb-3">
          What do you address first?
        </h4>
        <div className="space-y-2">
          {PRIORITY_OPTIONS.map((opt) => (
            <label
              key={opt.key}
              className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                priority === opt.key
                  ? "border-indigo-400 bg-indigo-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <input
                type="radio"
                name="priority"
                value={opt.key}
                checked={priority === opt.key}
                onChange={() => setPriority(opt.key)}
                className="accent-indigo-500"
              />
              <span className="text-sm text-gray-700">{opt.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="bg-slate-50 rounded-xl border border-gray-200 p-4">
        <p className="text-sm text-gray-600">
          <strong>Revised plan:</strong> With only 2 days and a reduced budget, some
          activities must be combined. Allocate the remaining ₹50,000 across these
          combined activities.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
        <ResourceAllocator
          categories={COMBINED_CATEGORIES}
          total={50}
          initialValues={allocation}
          onChange={handleAllocationChange}
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
        {priority === ""
          ? "Select priority first"
          : remaining > 0
          ? `${remaining} units left to allocate`
          : "Confirm Crisis Plan"}
      </button>
    </div>
  );
}
