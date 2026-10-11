"use client";

import { useState, useCallback } from "react";
import { buildAnswer, type QuestionAnswer } from "../../../types";
import ConfidenceSlider from "../../../../grade68/shared/ConfidenceSlider";
import InfoPanel from "../../../../grade68/shared/InfoPanel";
import { useInspectionTracker } from "../../../../grade68/shared/useInspectionTracker";
import { useStageTimer } from "../../../../grade68/shared/useStageTimer";

interface Props {
  onComplete: (answer: QuestionAnswer, interpretation: string) => void;
}

const SOURCE_PANELS = [
  {
    id: "study_a",
    title: "Oxford Survey (2023)",
    icon: "\u{1F4CA}",
    summary: "10,000 students surveyed",
    detail: "Found moderate gaming (1–2 hrs/day) correlated with slightly better grades (+3%). But students gaming >3 hrs/day scored 12% lower on average. Data was self-reported through an online questionnaire.",
  },
  {
    id: "study_b",
    title: "Lab Experiment (2024)",
    icon: "\u{1F9EA}",
    summary: "60 students over 6 weeks",
    detail: "Students randomly assigned to gaming/no-gaming groups. After 6 weeks, no significant difference in test scores between groups (p=0.48). Researchers note the sample was too small for definitive conclusions.",
  },
  {
    id: "methodology",
    title: "Methodology Notes",
    icon: "\u{1F50E}",
    summary: "How reliable are these studies?",
    detail: "Study A used self-reported gaming hours, which are often inaccurate. It also didn’t control for socioeconomic status or parental involvement. Study B was well-controlled but had only 60 participants — far below the 500+ needed for reliable results.",
  },
  {
    id: "statistics",
    title: "Statistics Summary",
    icon: "\u{1F4C8}",
    summary: "The numbers behind the claims",
    detail: "Study A: p=0.03, r=0.12 (statistically significant but very weak correlation). Study B: p=0.48 (not significant). Neither study controlled for game type, study habits, or sleep quality.",
  },
  {
    id: "expert",
    title: "Expert Opinion",
    icon: "\u{1F9D1}‍\u{1F52C}",
    summary: "Dr. Meera Patel, neuroscientist",
    detail: "‘Gaming can sharpen attention in short bursts, but extended sessions reduce sleep quality, which directly affects learning. The relationship is not simple — it depends on what games, how long, and what else the student does.’",
  },
  {
    id: "meta",
    title: "Additional Source",
    icon: "\u{1F4DA}",
    summary: "Optional: 2024 meta-analysis",
    detail: "A meta-analysis of 35 studies across 12 countries found: puzzle games slightly positive for grades (+2%), action games neutral, social/competitive games slightly negative (−4%). Effect sizes were small across all categories. Authors conclude game TYPE matters more than total hours.",
  },
];

const INTERPRETATIONS = [
  { key: "gaming_harms", label: "Gaming clearly harms academic performance — the large survey shows it", score: 0.2 },
  { key: "no_effect", label: "Gaming has no real effect on grades — the experiment proved it", score: 0.3 },
  { key: "complex_relationship", label: "The relationship is complex — it depends on amount, type, and individual factors", score: 1.0 },
  { key: "insufficient_evidence", label: "We can’t draw firm conclusions — the evidence quality is too mixed", score: 0.7 },
];

export default function InvestigateSources({ onComplete }: Props) {
  const [interpretation, setInterpretation] = useState<string | null>(null);
  const [confidence, setConfidence] = useState(3);
  const [openedMeta, setOpenedMeta] = useState(false);

  const tracker = useInspectionTracker(6);
  const timer = useStageTimer();

  const handleToggle = useCallback(
    (id: string, isOpen: boolean) => {
      tracker.toggle(id, isOpen);
      if (id === "meta" && isOpen) setOpenedMeta(true);
    },
    [tracker]
  );

  const canSubmit = interpretation !== null;

  const handleSubmit = useCallback(() => {
    if (!canSubmit || !interpretation) return;

    const inspected = tracker.panelsInspected();
    const dwellMs = tracker.totalDwellMs();
    const interpScore = INTERPRETATIONS.find((i) => i.key === interpretation)?.score ?? 0.5;

    const answer = buildAnswer(
      "g910-research-s1-investigate",
      interpretation,
      "STR",
      "WM",
      [
        { param: "STR", metric: "source_inspection", value: Math.min(1, inspected / 6), weight: 1.0 },
        { param: "STR", metric: "optional_source_opened", value: openedMeta ? 1.0 : 0.0, weight: 0.7 },
        { param: "WM", metric: "evidence_integration", value: Math.min(1, dwellMs / 25000), weight: 0.5 },
        { param: "FB", metric: "interpretation_quality", value: interpScore, weight: 0.6 },
      ],
      {
        panelsInspected: inspected,
        openedMeta: openedMeta ? 1 : 0,
        confidence,
        totalDwellMs: dwellMs,
        elapsedMs: timer.elapsed(),
      }
    );

    onComplete(answer, interpretation);
  }, [canSubmit, interpretation, confidence, openedMeta, tracker, timer, onComplete]);

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-1">
        <h2 className="text-xl font-bold text-gray-800">Stage 1: Investigate the Claim</h2>
        <p className="text-sm text-gray-500">
          Does gaming for 2+ hours daily harm academic performance? Examine the evidence.
        </p>
      </div>

      <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4">
        <p className="text-sm text-indigo-700 leading-relaxed">
          A school committee is debating whether to recommend screen-time limits for students.
          They&apos;ve asked you to review the available research and form an evidence-based interpretation.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {SOURCE_PANELS.map((p) => (
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
        <h3 className="font-semibold text-gray-800 text-sm">Based on the evidence, what is your interpretation?</h3>
        <div className="space-y-2">
          {INTERPRETATIONS.map((i) => (
            <label
              key={i.key}
              className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                interpretation === i.key ? "border-indigo-400 bg-indigo-50" : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <input
                type="radio"
                name="interpretation"
                checked={interpretation === i.key}
                onChange={() => setInterpretation(i.key)}
                className="mt-0.5 accent-indigo-600"
              />
              <span className="text-sm text-gray-700">{i.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex flex-col items-center">
        <ConfidenceSlider label="How confident are you in this interpretation?" onChange={setConfidence} />
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
        {canSubmit ? "Submit Interpretation" : "Select an interpretation first"}
      </button>
    </div>
  );
}
