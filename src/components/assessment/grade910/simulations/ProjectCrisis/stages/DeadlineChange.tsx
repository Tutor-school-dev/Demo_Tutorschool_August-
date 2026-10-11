"use client";

import { useState, useCallback } from "react";
import { buildAnswer, type QuestionAnswer } from "../../../types";
import InfoPanel from "../../../../grade68/shared/InfoPanel";
import ResourceAllocator, { type Category } from "../../../../grade68/shared/ResourceAllocator";
import { useInspectionTracker } from "../../../../grade68/shared/useInspectionTracker";
import { useStageTimer } from "../../../../grade68/shared/useStageTimer";

interface Props {
  approach: string;
  onComplete: (answer: QuestionAnswer) => void;
}

const ORIGINAL_PLAN = [
  { phase: "Research & Design", days: 4, emoji: "📐" },
  { phase: "Build / Experiment", days: 6, emoji: "🔨" },
  { phase: "Testing & Data", days: 3, emoji: "🧪" },
  { phase: "Presentation Prep", days: 2, emoji: "🎨" },
];

const ORIGINAL_RATIOS: Record<string, number> = {
  research: 4 / 15,
  build: 6 / 15,
  testing: 3 / 15,
  presentation: 2 / 15,
};

const CATEGORIES: Category[] = [
  { key: "research", label: "Research & Design", emoji: "📐", min: 1 },
  { key: "build", label: "Build / Experiment", emoji: "🔨", min: 1 },
  { key: "testing", label: "Testing & Data", emoji: "🧪", min: 1 },
  { key: "presentation", label: "Presentation Prep", emoji: "🎨", min: 1 },
];

const DEPENDENCY_PANELS = [
  {
    id: "dep_build",
    title: "Build Depends on Research",
    icon: "🔗",
    summary: "Can't build until design is done",
    detail: "You need to finalize the purification method design before starting construction or experiments. Skipping this means building without a plan, which risks wasted materials and time.",
  },
  {
    id: "dep_present",
    title: "Presentation Depends on Testing",
    icon: "🔗",
    summary: "Need results before making the poster",
    detail: "Your presentation must include actual test results and data. You can't finish the poster until testing is complete. Last-minute testing means a rushed, weak presentation.",
  },
];

export default function DeadlineChange({ approach, onComplete }: Props) {
  const [allocation, setAllocation] = useState<Record<string, number>>({
    research: 3,
    build: 4,
    testing: 2,
    presentation: 1,
  });

  const tracker = useInspectionTracker(2);
  const timer = useStageTimer();

  const total = Object.values(allocation).reduce((s, v) => s + v, 0);
  const canSubmit = total === 10;

  const handleSubmit = useCallback(() => {
    if (!canSubmit) return;

    const elapsedMs = timer.elapsed();
    const depInspected = tracker.panelsInspected();

    const allAboveMin = Object.values(allocation).every((v) => v >= 1) ? 1.0 : 0.3;

    let maxDeviation = 0;
    for (const key of Object.keys(ORIGINAL_RATIOS)) {
      const newRatio = (allocation[key] ?? 0) / 10;
      const oldRatio = ORIGINAL_RATIOS[key] ?? 0;
      const dev = Math.abs(newRatio - oldRatio);
      if (dev > maxDeviation) maxDeviation = dev;
    }
    const proportionalScore = Math.min(1, Math.max(0, 1 - maxDeviation / 0.3));

    const answer = buildAnswer(
      "g910-project-s2-deadline",
      JSON.stringify(allocation),
      "WM",
      "PAC",
      [
        { param: "WM", metric: "all_phases_retained", value: allAboveMin, weight: 1.0 },
        { param: "WM", metric: "proportional_adaptation", value: proportionalScore, weight: 0.7 },
        { param: "PAC", metric: "productive_continuation", value: Math.min(1, elapsedMs / 25000), weight: 0.6 },
        { param: "STR", metric: "dependency_awareness", value: Math.min(1, depInspected / 2), weight: 0.4 },
      ],
      {
        research: allocation.research,
        build: allocation.build,
        testing: allocation.testing,
        presentation: allocation.presentation,
        dependencyPanelsInspected: depInspected,
        elapsedMs,
      }
    );

    onComplete(answer);
  }, [canSubmit, allocation, tracker, timer, onComplete]);

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-1">
        <h2 className="text-xl font-bold text-gray-800">Stage 2: Deadline Changed</h2>
        <p className="text-sm text-gray-500">The science fair moved up by one week. Adapt your project plan.</p>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
        <h3 className="font-bold text-amber-800">⚠️ Schedule Change</h3>
        <p className="text-sm text-amber-700 leading-relaxed mt-1">
          The science fair has been rescheduled from <strong>3 weeks</strong> to <strong>2 weeks</strong> from now.
          Your original plan of 15 work-days is now only <strong>10 work-days</strong>.
        </p>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
        <h3 className="font-semibold text-gray-800 text-sm mb-3">Original Plan (15 days)</h3>
        <div className="grid grid-cols-2 gap-2">
          {ORIGINAL_PLAN.map((p) => (
            <div key={p.phase} className="flex items-center gap-2 bg-white rounded-lg p-2 border border-gray-100">
              <span className="text-lg">{p.emoji}</span>
              <div>
                <p className="text-xs font-medium text-gray-700">{p.phase}</p>
                <p className="text-xs text-gray-500">{p.days} days</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="font-semibold text-gray-800 text-sm">Key Dependencies</h3>
        {DEPENDENCY_PANELS.map((p) => (
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
        <h3 className="font-semibold text-gray-800 text-sm mb-3">Revised Plan: Allocate 10 Days</h3>
        <ResourceAllocator categories={CATEGORIES} total={10} onChange={setAllocation} />
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
        {canSubmit ? "Confirm Revised Plan" : `${10 - total} days left to allocate`}
      </button>
    </div>
  );
}
