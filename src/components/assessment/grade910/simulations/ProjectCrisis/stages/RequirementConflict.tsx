"use client";

import { useState, useCallback } from "react";
import { buildAnswer, type QuestionAnswer } from "../../../types";
import ConfidenceSlider from "../../../../grade68/shared/ConfidenceSlider";
import InfoPanel from "../../../../grade68/shared/InfoPanel";
import { useInspectionTracker } from "../../../../grade68/shared/useInspectionTracker";
import { useStageTimer } from "../../../../grade68/shared/useStageTimer";

interface Props {
  onComplete: (answer: QuestionAnswer, approach: string) => void;
}

const PANELS = [
  {
    id: "brief",
    title: "Project Brief",
    icon: "📄",
    summary: "Official science fair requirements",
    detail: "'Demonstrate a practical water purification method using materials available to a typical household.' Maximum budget: ₹3,000. Presentation: 10-minute live demo + poster. Team size: 2–5 members.",
  },
  {
    id: "riya",
    title: "Riya's Interpretation",
    icon: "👩‍🔬",
    summary: "Build a physical filtration device",
    detail: "'Practical' means we build something that works in front of the judges. I've designed a 3-stage filter: gravel, sand, activated charcoal. Materials cost ₹1,200. We can build it in 4 days and it visually demonstrates purification.",
  },
  {
    id: "arjun",
    title: "Arjun's Interpretation",
    icon: "👨‍🔬",
    summary: "Design and test a purification process",
    detail: "'Demonstrate' means we prove it works with data. I want to test 3 purification methods (boiling, filtration, chlorination), measure bacteria levels before/after, and present comparative results. Needs lab time: 6 sessions. Materials: ₹2,500.",
  },
  {
    id: "resources",
    title: "Available Resources",
    icon: "📦",
    summary: "What your team has access to",
    detail: "School lab: Available Mon/Wed/Fri after school (1.5 hrs each). Budget: ₹3,000 from school. Materials: Basic lab equipment available. No access to advanced testing equipment — bacteria testing costs ₹500 per sample at a local lab.",
  },
  {
    id: "criteria",
    title: "Judging Criteria",
    icon: "🏆",
    summary: "Optional: How projects are scored",
    detail: "Scientific Rigor: 40% (hypothesis, methodology, data quality). Presentation: 30% (clarity, visual aids, demo). Innovation: 20% (creative approach, novelty). Teamwork: 10% (evidence of collaboration). Note: Past winners scored highest on rigor + presentation combined.",
  },
];

const DECISIONS = [
  { key: "check_criteria", label: "Check the judging criteria first to see what actually matters most", score: 1.0 },
  { key: "riya_approach", label: "Go with Riya's approach — a working demo is more impressive", score: 0.3 },
  { key: "arjun_approach", label: "Go with Arjun's approach — scientific rigor should come first", score: 0.4 },
  { key: "combine_both", label: "Combine both — build a device AND collect data on how well it works", score: 0.7 },
];

export default function RequirementConflict({ onComplete }: Props) {
  const [decision, setDecision] = useState<string | null>(null);
  const [confidence, setConfidence] = useState(3);
  const [openedCriteria, setOpenedCriteria] = useState(false);

  const tracker = useInspectionTracker(5);
  const timer = useStageTimer();

  const canSubmit = decision !== null;

  const handleToggle = useCallback(
    (id: string, isOpen: boolean) => {
      tracker.toggle(id, isOpen);
      if (id === "criteria" && isOpen) setOpenedCriteria(true);
    },
    [tracker]
  );

  const handleSubmit = useCallback(() => {
    if (!canSubmit || !decision) return;

    const choiceScore = DECISIONS.find((d) => d.key === decision)?.score ?? 0.5;
    const inspected = tracker.panelsInspected();
    const dwellMs = tracker.totalDwellMs();
    const elapsedMs = timer.elapsed();

    const answer = buildAnswer(
      "g910-project-s1-conflict",
      decision,
      "WM",
      "STR",
      [
        { param: "WM", metric: "constraint_checking", value: Math.min(1, Math.max(0, choiceScore)), weight: 1.0 },
        { param: "WM", metric: "context_retention", value: Math.min(1, dwellMs / 20000), weight: 0.6 },
        { param: "STR", metric: "voluntary_investigation", value: Math.min(1, inspected / 5), weight: 0.8 },
        { param: "STR", metric: "optional_criteria_checked", value: openedCriteria ? 1.0 : 0.0, weight: 0.5 },
      ],
      {
        panelsInspected: inspected,
        openedCriteria: openedCriteria ? 1 : 0,
        confidence,
        totalDwellMs: dwellMs,
        elapsedMs,
      }
    );

    onComplete(answer, decision);
  }, [canSubmit, decision, confidence, openedCriteria, tracker, timer, onComplete]);

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-1">
        <h2 className="text-xl font-bold text-gray-800">Stage 1: Team Disagreement</h2>
        <p className="text-sm text-gray-500">Your team can&apos;t agree on the approach. Investigate the requirements and decide.</p>
      </div>

      <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4">
        <p className="text-sm text-indigo-700 leading-relaxed">
          The science fair brief says: <em>&quot;Demonstrate a practical water purification method using materials available to a typical household.&quot;</em> Two team members have very different ideas about what this means.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {PANELS.map((p) => (
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

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-3">
        <h3 className="font-semibold text-gray-800 text-sm">What&apos;s your first move as team lead?</h3>
        <div className="space-y-2">
          {DECISIONS.map((d) => (
            <label
              key={d.key}
              className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                decision === d.key ? "border-indigo-400 bg-indigo-50" : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <input
                type="radio"
                name="decision"
                checked={decision === d.key}
                onChange={() => setDecision(d.key)}
                className="mt-0.5 accent-indigo-600"
              />
              <span className="text-sm text-gray-700">{d.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex flex-col items-center">
        <ConfidenceSlider label="How confident are you in this approach?" onChange={setConfidence} />
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
        {canSubmit ? "Lock In Approach" : "Select an approach first"}
      </button>
    </div>
  );
}
