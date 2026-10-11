"use client";

import { useState, useCallback } from "react";
import { buildAnswer, type QuestionAnswer } from "../../../types";
import ConfidenceSlider from "../../../../grade68/shared/ConfidenceSlider";
import InfoPanel from "../../../../grade68/shared/InfoPanel";
import { useInspectionTracker } from "../../../../grade68/shared/useInspectionTracker";
import { useStageTimer } from "../../../../grade68/shared/useStageTimer";

interface PlanPreviewProps {
  onComplete: (answer: QuestionAnswer, order: string[], flagged: string[]) => void;
}

const SECTIONS = ["math", "science", "english", "social"] as const;

const SECTION_LABELS: Record<string, string> = {
  math: "Mathematics",
  science: "Science",
  english: "English",
  social: "Social Studies",
};

const INFO_PANELS = [
  {
    id: "math",
    title: "Mathematics",
    icon: "📐",
    summary: "15 questions, 30 marks",
    detail: "Topics: Algebra (5 Qs), Geometry (5 Qs), Statistics (5 Qs). Difficulty: 4 easy, 6 medium, 5 hard. Estimated time: 30 minutes.",
  },
  {
    id: "science",
    title: "Science",
    icon: "🔬",
    summary: "12 questions, 25 marks",
    detail: "Topics: Physics (4 Qs), Chemistry (4 Qs), Biology (4 Qs). Difficulty: 3 easy, 5 medium, 4 hard. Estimated time: 25 minutes.",
  },
  {
    id: "english",
    title: "English",
    icon: "📖",
    summary: "10 questions, 20 marks",
    detail: "Topics: Reading Comprehension (4 Qs), Grammar (3 Qs), Writing (3 Qs). Difficulty: 5 easy, 3 medium, 2 hard. Estimated time: 20 minutes.",
  },
  {
    id: "social",
    title: "Social Studies",
    icon: "🌍",
    summary: "8 questions, 15 marks",
    detail: "Topics: History (3 Qs), Geography (3 Qs), Civics (2 Qs). Difficulty: 3 easy, 3 medium, 2 hard. Estimated time: 15 minutes.",
  },
  {
    id: "rules",
    title: "Exam Rules",
    icon: "📋",
    summary: "Time limits and scoring",
    detail: "90 minutes total. All sections mandatory. No negative marking. You can attempt sections in any order. Flagged questions can be revisited.",
  },
  {
    id: "reference",
    title: "Reference Sheet",
    icon: "📎",
    summary: "Optional formulas and key dates",
    detail: "Math: Quadratic formula, area/volume formulas, basic statistics formulas. Science: Newton's laws, periodic table groups, cell diagram labels. This sheet will be available throughout the exam.",
  },
];

export default function PlanPreview({ onComplete }: PlanPreviewProps) {
  const [order, setOrder] = useState<string[]>(["", "", "", ""]);
  const [flagged, setFlagged] = useState<Record<string, boolean>>({
    math: false,
    science: false,
    english: false,
    social: false,
  });
  const [confidence, setConfidence] = useState(3);
  const [openedReference, setOpenedReference] = useState(false);

  const tracker = useInspectionTracker(6);
  const timer = useStageTimer();

  const handleToggle = useCallback(
    (id: string, isOpen: boolean) => {
      tracker.toggle(id, isOpen);
      if (id === "reference" && isOpen) setOpenedReference(true);
    },
    [tracker]
  );

  const usedSections = new Set(order.filter(Boolean));
  const allFilled = order.every(Boolean) && usedSections.size === 4;
  const canSubmit = allFilled;

  const handleOrderChange = useCallback(
    (position: number, value: string) => {
      setOrder((prev) => {
        const next = [...prev];
        next[position] = value;
        return next;
      });
    },
    []
  );

  const handleFlagToggle = useCallback((section: string) => {
    setFlagged((prev) => ({ ...prev, [section]: !prev[section] }));
  }, []);

  const getAvailableSections = useCallback(
    (position: number) => {
      const selectedElsewhere = new Set(
        order.filter((v, i) => i !== position && v)
      );
      return SECTIONS.filter((s) => !selectedElsewhere.has(s));
    },
    [order]
  );

  const handleSubmit = useCallback(() => {
    if (!canSubmit) return;

    const inspected = tracker.panelsInspected();
    const dwellMs = tracker.totalDwellMs();
    const flaggedList = Object.entries(flagged)
      .filter(([, v]) => v)
      .map(([k]) => k);

    const answer = buildAnswer(
      "g910-exam-s1-plan",
      JSON.stringify({ order, flagged: flaggedList }),
      "ATT",
      "STR",
      [
        { param: "ATT", metric: "planning_structure", value: allFilled ? 1.0 : 0.5, weight: 1.0 },
        { param: "STR", metric: "info_inspection", value: Math.min(1, inspected / 6), weight: 1.0 },
        { param: "STR", metric: "reference_used", value: openedReference ? 1.0 : 0.0, weight: 0.6 },
        { param: "WM", metric: "preview_depth", value: Math.min(1, dwellMs / 20000), weight: 0.4 },
      ],
      {
        panelsInspected: inspected,
        totalDwellMs: dwellMs,
        openedReference: openedReference ? 1 : 0,
        flaggedCount: flaggedList.length,
        confidence,
        elapsedMs: timer.elapsed(),
      }
    );

    onComplete(answer, order, flaggedList);
  }, [canSubmit, order, flagged, confidence, openedReference, tracker, timer, allFilled, onComplete]);

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-1">
        <h2 className="text-xl font-bold text-gray-800">Stage 1: Exam Preview & Planning</h2>
        <p className="text-sm text-gray-500">
          Review the exam sections, then decide your approach.
        </p>
      </div>

      <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600">
        This mock exam has 4 sections, 45 questions total, and 90 minutes. You can preview each
        section's details before starting. Plan wisely.
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
            onToggle={handleToggle}
          />
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-4">
        <h3 className="font-semibold text-gray-800">Choose Section Order</h3>
        <p className="text-sm text-gray-500">Pick the order you'll attempt the sections.</p>
        <div className="grid grid-cols-2 gap-3">
          {[0, 1, 2, 3].map((pos) => (
            <div key={pos} className="space-y-1">
              <label className="text-xs font-medium text-gray-500">
                {pos === 0 ? "1st" : pos === 1 ? "2nd" : pos === 2 ? "3rd" : "4th"} Section
              </label>
              <select
                value={order[pos]}
                onChange={(e) => handleOrderChange(pos, e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 outline-none"
              >
                <option value="">Select...</option>
                {getAvailableSections(pos).map((s) => (
                  <option key={s} value={s}>
                    {SECTION_LABELS[s]}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-3">
        <h3 className="font-semibold text-gray-800">Flag Sections for Review</h3>
        <p className="text-sm text-gray-500">Mark sections you want to review carefully.</p>
        <div className="grid grid-cols-2 gap-2">
          {SECTIONS.map((s) => (
            <label
              key={s}
              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={flagged[s]}
                onChange={() => handleFlagToggle(s)}
                className="accent-indigo-500"
              />
              <span className="text-sm text-gray-700">🚩 {SECTION_LABELS[s]}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex flex-col items-center">
        <ConfidenceSlider
          label="How confident are you in this plan?"
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
        {canSubmit ? "Lock In My Plan" : "Complete all selections"}
      </button>
    </div>
  );
}
