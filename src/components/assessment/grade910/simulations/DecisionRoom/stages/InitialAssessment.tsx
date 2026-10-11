"use client";

import { useState, useCallback } from "react";
import { buildAnswer, type QuestionAnswer } from "../../../types";
import ConfidenceSlider from "../../../../grade68/shared/ConfidenceSlider";
import InfoPanel from "../../../../grade68/shared/InfoPanel";
import { useInspectionTracker } from "../../../../grade68/shared/useInspectionTracker";
import { useStageTimer } from "../../../../grade68/shared/useStageTimer";

interface Props {
  onComplete: (answer: QuestionAnswer, decision: string, reasoning: string) => void;
}

const EVIDENCE_PANELS = [
  {
    id: "survey",
    title: "Student Survey",
    icon: "📊",
    summary: "72% of respondents prefer online",
    detail: "Survey conducted through the school app: 350 of 500 respondents prefer online exams, citing convenience and instant results. However, only 500 of 800 students responded — the survey was only accessible via the school app, which 30% of students don't have on their phones.",
  },
  {
    id: "teachers",
    title: "Teacher Report",
    icon: "👨‍🏫",
    summary: "Faculty split 50/50",
    detail: "Science and maths teachers (12 of 24) favour online — auto-grading saves 40 hours per exam cycle. English and social studies teachers (12 of 24) worry about evaluating essays online, report screen fatigue during 3-hour marking sessions, and question the validity of multiple-choice-heavy online formats.",
  },
  {
    id: "cost",
    title: "Cost Analysis",
    icon: "💰",
    summary: "Break-even in 3 years",
    detail: "Online system: ₹2,00,000 setup + ₹50,000/year maintenance + ₹30,000/year software licences. Current paper system: ₹80,000/year (printing, distribution, storage). Online becomes cheaper after Year 3, saving ₹30,000/year from Year 4 onwards.",
  },
  {
    id: "research",
    title: "Research Study",
    icon: "📑",
    summary: "Trade-offs in the data",
    detail: "A university study of 3,000 students found: online exams had 12% higher suspected cheating incidents, but 20% faster results processing. Student satisfaction was equal across formats. Key finding: 'The format matters less than the quality of invigilation and question design.'",
  },
  {
    id: "pilot",
    title: "Pilot Results",
    icon: "🧪",
    summary: "Grade 10 pilot data",
    detail: "A 2-month pilot with Grade 10 (80 students): average scores 5% lower on online exams, but students reported 15% less exam anxiety. Teachers noted: 'Students seemed more relaxed but less focused.' Technical issues occurred in 8% of sessions (internet dropouts, app crashes).",
  },
  {
    id: "equity",
    title: "Equity Report",
    icon: "⚖️",
    summary: "Optional: Access and fairness data",
    detail: "15% of students (120) have unreliable internet at home — practice and revision would be affected. 8% (64) share devices with siblings. The school has only 40 working computers for 800 students. Students from lower-income families scored 18% lower in the online pilot compared to only 5% lower on paper exams.",
  },
];

const DECISIONS = [
  { key: "switch_online", label: "Recommend switching fully to online exams" },
  { key: "keep_paper", label: "Recommend keeping paper-based exams" },
  { key: "hybrid", label: "Recommend a hybrid approach — some subjects online, some on paper" },
  { key: "more_investigation", label: "Recommend more investigation before making any change" },
];

const REASONINGS = [
  { key: "cost_savings", label: "The long-term cost savings justify the transition" },
  { key: "equal_access", label: "We must ensure every student has equal access and fair conditions" },
  { key: "cheating_risk", label: "The cheating risk is unacceptable without stronger safeguards" },
  { key: "evidence_mixed", label: "The evidence is too mixed to make a confident recommendation either way" },
];

export default function InitialAssessment({ onComplete }: Props) {
  const [decision, setDecision] = useState<string | null>(null);
  const [reasoning, setReasoning] = useState<string | null>(null);
  const [confidence, setConfidence] = useState(3);
  const [openedEquity, setOpenedEquity] = useState(false);

  const tracker = useInspectionTracker(6);
  const timer = useStageTimer();

  const canSubmit = decision !== null && reasoning !== null;

  const handleToggle = useCallback(
    (id: string, isOpen: boolean) => {
      tracker.toggle(id, isOpen);
      if (id === "equity" && isOpen) setOpenedEquity(true);
    },
    [tracker]
  );

  const handleSubmit = useCallback(() => {
    if (!canSubmit || !decision || !reasoning) return;

    const elapsedMs = timer.elapsed();
    const calibrationScore = confidence <= 3 ? 0.9 : confidence === 4 ? 0.6 : 0.3;

    const answer = buildAnswer(
      "g910-decision-s1-initial",
      `${decision}|${reasoning}`,
      "STR",
      "FB",
      [
        { param: "STR", metric: "evidence_coverage", value: Math.min(1, tracker.inspectionRatio()), weight: 1.0 },
        { param: "STR", metric: "optional_equity_checked", value: openedEquity ? 1.0 : 0.0, weight: 0.7 },
        { param: "FB", metric: "confidence_calibration", value: calibrationScore, weight: 0.6 },
        { param: "ATT", metric: "deliberation_time", value: Math.min(1, elapsedMs / 40000), weight: 0.4 },
      ],
      {
        panelsInspected: tracker.panelsInspected(),
        openedEquity: openedEquity ? 1 : 0,
        confidence,
        elapsedMs,
      }
    );

    onComplete(answer, decision, reasoning);
  }, [canSubmit, decision, reasoning, confidence, openedEquity, tracker, timer, onComplete]);

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-1">
        <h2 className="text-xl font-bold text-gray-800">Stage 1: Review & Recommend</h2>
        <p className="text-sm text-gray-500">
          Should your school switch to online exams? Review the evidence and decide.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {EVIDENCE_PANELS.map((p) => (
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
        <h3 className="font-semibold text-gray-800 text-sm">Your recommendation</h3>
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

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-3">
        <h3 className="font-semibold text-gray-800 text-sm">Why this recommendation?</h3>
        <div className="space-y-2">
          {REASONINGS.map((r) => (
            <label
              key={r.key}
              className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                reasoning === r.key ? "border-indigo-400 bg-indigo-50" : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <input
                type="radio"
                name="reasoning"
                checked={reasoning === r.key}
                onChange={() => setReasoning(r.key)}
                className="mt-0.5 accent-indigo-600"
              />
              <span className="text-sm text-gray-700">{r.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex flex-col items-center">
        <ConfidenceSlider label="How confident are you in this recommendation?" onChange={setConfidence} />
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
        {canSubmit ? "Submit Recommendation" : "Select a decision and reasoning"}
      </button>
    </div>
  );
}
