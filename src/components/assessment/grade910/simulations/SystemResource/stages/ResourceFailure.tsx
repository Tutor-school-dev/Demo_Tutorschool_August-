"use client";

import { useState, useCallback } from "react";
import { buildAnswer, type QuestionAnswer } from "../../../types";
import InfoPanel from "../../../../grade68/shared/InfoPanel";
import ResourceAllocator, { type Category } from "../../../../grade68/shared/ResourceAllocator";
import { useInspectionTracker } from "../../../../grade68/shared/useInspectionTracker";
import { useStageTimer } from "../../../../grade68/shared/useStageTimer";

interface ResourceFailureProps {
  budgetAllocation: Record<string, number>;
  onComplete: (answer: QuestionAnswer) => void;
}

const ALT_PANELS = [
  {
    id: "computer_room",
    title: "Alternative: Computer Room",
    icon: "💻",
    summary: "Capacity 30, Available Days 1-3",
    detail:
      "Has 30 desktop computers with internet. No lab equipment. Setup cost: ₹5,000. Good for the Coding Challenge. Not ideal for Robotics Workshop (no physical workspace).",
  },
  {
    id: "classroom",
    title: "Alternative: Classroom Block",
    icon: "🏫",
    summary: "Capacity 60 per room, 3 rooms",
    detail:
      "Three empty classrooms available all 3 days. No special equipment but tables can be rearranged. Cost: ₹2,000 per room. Could work for Robotics Workshop with portable equipment (₹4,000 additional).",
  },
];

const ROBOTICS_OPTIONS = [
  { key: "computer_room", label: "Move to Computer Room (limited space, no lab gear)" },
  { key: "classroom", label: "Move to Classroom (need portable equipment, +₹4,000)" },
  { key: "cancel", label: "Cancel the Robotics Workshop entirely" },
];

const CODING_OPTIONS = [
  { key: "computer_room", label: "Move to Computer Room (perfect fit)" },
  { key: "classroom", label: "Move to Classroom (would need laptops, +₹3,000)" },
  { key: "cancel", label: "Cancel the Coding Challenge entirely" },
];

const REALLOC_CATEGORIES: Category[] = [
  { key: "keynote", label: "Keynote Talk", emoji: "🎙️", min: 0 },
  { key: "robotics", label: "Robotics Workshop", emoji: "🤖", min: 0 },
  { key: "quiz", label: "Science Quiz", emoji: "❓", min: 0 },
  { key: "exhibit", label: "Innovation Exhibit", emoji: "💡", min: 0 },
  { key: "coding", label: "Coding Challenge", emoji: "💻", min: 0 },
];

export default function ResourceFailure({ budgetAllocation, onComplete }: ResourceFailureProps) {
  const [roboticsVenue, setRoboticsVenue] = useState("");
  const [codingVenue, setCodingVenue] = useState("");
  const [showRealloc, setShowRealloc] = useState(false);
  const [reallocValues, setReallocValues] = useState<Record<string, number>>(budgetAllocation);

  const tracker = useInspectionTracker(2);
  const timer = useStageTimer();

  const hasConflict = roboticsVenue === "computer_room" && codingVenue === "computer_room";
  const canSubmit = roboticsVenue !== "" && codingVenue !== "";

  const handleSubmit = useCallback(() => {
    if (!canSubmit) return;

    const inspected = tracker.panelsInspected();
    const elapsedMs = timer.elapsed();

    const didReallocation = showRealloc ? 1 : 0;
    const adapted =
      roboticsVenue !== "cancel" || codingVenue !== "cancel" || showRealloc;

    const answer = buildAnswer(
      "g910-system-s2-failure",
      JSON.stringify({ roboticsVenue, codingVenue }),
      "WM",
      "FB",
      [
        {
          param: "WM",
          metric: "constraint_retention_after_disruption",
          value: hasConflict ? 0.3 : 1.0,
          weight: 1.0,
        },
        {
          param: "FB",
          metric: "allocation_changed_after_failure",
          value: adapted ? 0.9 : 0.3,
          weight: 0.8,
        },
        {
          param: "ATT",
          metric: "recovery_after_interruption",
          value: Math.min(1, Math.max(0, elapsedMs / 30000)),
          weight: 0.5,
        },
        {
          param: "STR",
          metric: "optimization_beyond_minimum",
          value: didReallocation ? 1.0 : 0.5,
          weight: 0.4,
        },
      ],
      {
        roboticsVenue: ROBOTICS_OPTIONS.findIndex((o) => o.key === roboticsVenue),
        codingVenue: CODING_OPTIONS.findIndex((o) => o.key === codingVenue),
        hasConflict: hasConflict ? 1 : 0,
        alternativePanelsInspected: inspected,
        didReallocation,
        elapsedMs,
      }
    );

    onComplete(answer);
  }, [
    canSubmit,
    roboticsVenue,
    codingVenue,
    hasConflict,
    showRealloc,
    tracker,
    timer,
    onComplete,
  ]);

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-1">
        <h2 className="text-xl font-bold text-gray-800">Stage 2: Venue Lost</h2>
        <p className="text-sm text-gray-500">
          The Science Lab is unavailable. Reassign the affected activities.
        </p>
      </div>

      <div className="bg-red-50 border border-red-200 rounded-xl p-4">
        <h3 className="font-bold text-red-800 text-base">
          {"🚨"} Emergency: Science Lab Closed
        </h3>
        <p className="text-sm text-red-700 mt-1">
          The Science Lab has a burst water pipe and is closed for repairs. The{" "}
          <strong>Robotics Workshop</strong> and <strong>Coding Challenge</strong>{" "}
          were planned there. You must move them to alternative venues.
        </p>
      </div>

      <div className="bg-gray-50 rounded-xl border border-gray-200 p-4">
        <h4 className="text-sm font-semibold text-gray-600 mb-2">
          Current Budget Allocation
        </h4>
        <div className="grid grid-cols-5 gap-2">
          {REALLOC_CATEGORIES.map((cat) => (
            <div
              key={cat.key}
              className={`text-center p-2 rounded-lg ${
                cat.key === "robotics" || cat.key === "coding"
                  ? "bg-red-50 border border-red-200"
                  : "bg-white border border-gray-100"
              }`}
            >
              <span className="text-lg">{cat.emoji}</span>
              <p className="text-xs text-gray-500">{cat.label}</p>
              <p className="text-sm font-bold text-gray-800">
                {budgetAllocation[cat.key] ?? 0}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {ALT_PANELS.map((p) => (
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
        <h4 className="text-sm font-semibold text-gray-600 mb-3">
          {"🤖"} Reassign Robotics Workshop
        </h4>
        <div className="space-y-2">
          {ROBOTICS_OPTIONS.map((opt) => (
            <label
              key={opt.key}
              className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                roboticsVenue === opt.key
                  ? "border-indigo-400 bg-indigo-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <input
                type="radio"
                name="robotics"
                value={opt.key}
                checked={roboticsVenue === opt.key}
                onChange={() => setRoboticsVenue(opt.key)}
                className="accent-indigo-500"
              />
              <span className="text-sm text-gray-700">{opt.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
        <h4 className="text-sm font-semibold text-gray-600 mb-3">
          {"💻"} Reassign Coding Challenge
        </h4>
        <div className="space-y-2">
          {CODING_OPTIONS.map((opt) => (
            <label
              key={opt.key}
              className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                codingVenue === opt.key
                  ? "border-indigo-400 bg-indigo-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <input
                type="radio"
                name="coding"
                value={opt.key}
                checked={codingVenue === opt.key}
                onChange={() => setCodingVenue(opt.key)}
                className="accent-indigo-500"
              />
              <span className="text-sm text-gray-700">{opt.label}</span>
            </label>
          ))}
        </div>
      </div>

      {hasConflict && (
        <div className="bg-amber-50 border border-amber-300 rounded-xl p-4">
          <p className="text-sm text-amber-800 font-medium">
            {"⚠️"} Both activities can&apos;t use the Computer Room on the same
            day. Assign them to different days or pick a different venue for one.
          </p>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={showRealloc}
            onChange={(e) => setShowRealloc(e.target.checked)}
            className="accent-indigo-500 w-4 h-4"
          />
          <span className="text-sm text-gray-700">
            Optimize: Reallocate budget from cancelled/downsized activities to
            strengthen remaining ones
          </span>
        </label>
        {showRealloc && (
          <div className="mt-4">
            <ResourceAllocator
              categories={REALLOC_CATEGORIES}
              total={75}
              initialValues={reallocValues}
              onChange={setReallocValues}
            />
          </div>
        )}
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
        {!canSubmit ? "Assign both activities to continue" : "Confirm Revised Plan"}
      </button>
    </div>
  );
}
