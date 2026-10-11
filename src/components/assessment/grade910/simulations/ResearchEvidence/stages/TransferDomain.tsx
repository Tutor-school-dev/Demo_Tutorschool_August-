"use client";

import { useState, useCallback } from "react";
import { buildAnswer, type QuestionAnswer } from "../../../types";
import InfoPanel from "../../../../grade68/shared/InfoPanel";
import { useInspectionTracker } from "../../../../grade68/shared/useInspectionTracker";
import { useStageTimer } from "../../../../grade68/shared/useStageTimer";

interface Props {
  onComplete: (answer: QuestionAnswer) => void;
}

const CLASS_SIZE_PANELS = [
  {
    id: "survey_cs",
    title: "National Survey",
    icon: "📊",
    summary: "50,000 students across 200 schools",
    detail: "Students in classes under 25 scored 8% higher on standardized tests than those in classes over 35. The survey covered urban and rural schools. However, it did not control for school funding levels — wealthier schools tend to have both smaller classes and better resources.",
  },
  {
    id: "rct_cs",
    title: "Tennessee STAR Experiment",
    icon: "🧪",
    summary: "Randomized controlled trial",
    detail: "Students were randomly assigned to small (15 students) or regular (25 students) classes in grades K–3. Small-class students gained 0.2 standard deviations on test scores. Effect was strongest for low-income students. Limitation: Only studied grades K–3 — results may not apply to high school.",
  },
  {
    id: "methods_cs",
    title: "Methodology Comparison",
    icon: "🔎",
    summary: "Evaluating the evidence quality",
    detail: "The national survey is observational — it can't prove small classes CAUSE better performance (confounding variables). The STAR experiment is the gold standard (RCT) but was limited to young children. A key confound in the survey: schools with small classes also had 40% higher per-student spending.",
  },
  {
    id: "meta_cs",
    title: "Meta-Analysis",
    icon: "📚",
    summary: "12 studies synthesized",
    detail: "Effect size ranges from 0.0 to 0.4 depending on grade level, subject, and teacher quality. The effect is strongest in early grades and for disadvantaged students. For grades 9–10, the effect is near zero unless accompanied by teacher training.",
  },
];

const HYPOTHESES = [
  { key: "smaller_better", label: "Smaller classes clearly improve learning — the data shows it", score: 0.3 },
  { key: "teacher_matters", label: "Class size doesn't matter much — teacher quality is the real factor", score: 0.4 },
  { key: "depends_on_factors", label: "The effect depends on multiple factors — size alone isn't the full picture", score: 1.0 },
  { key: "need_more_evidence", label: "We need more evidence specific to Grade 9–10 before deciding", score: 0.6 },
];

const INVESTIGATIONS = [
  { key: "control_confounds", label: "Study the effect while controlling for school funding and teacher quality", score: 0.8 },
  { key: "bigger_survey", label: "Run a larger survey across more schools", score: 0.3 },
  { key: "new_experiment", label: "Design a new experiment specifically for high school classes", score: 0.5 },
];

export default function TransferDomain({ onComplete }: Props) {
  const [hypothesis, setHypothesis] = useState<string | null>(null);
  const [investigation, setInvestigation] = useState<string | null>(null);

  const tracker = useInspectionTracker(4);
  const timer = useStageTimer();

  const canSubmit = hypothesis !== null && investigation !== null;

  const handleSubmit = useCallback(() => {
    if (!canSubmit || !hypothesis || !investigation) return;

    const hypScore = HYPOTHESES.find((h) => h.key === hypothesis)?.score ?? 0.5;
    const invScore = INVESTIGATIONS.find((i) => i.key === investigation)?.score ?? 0.5;

    const answer = buildAnswer(
      "g910-research-s3-transfer",
      `${hypothesis}|${investigation}`,
      "ABS",
      "WM",
      [
        { param: "ABS", metric: "structural_transfer", value: hypScore, weight: 1.0 },
        { param: "ABS", metric: "investigation_transfer", value: invScore, weight: 0.8 },
        { param: "WM", metric: "evidence_retention", value: Math.min(1, tracker.panelsInspected() / 4), weight: 0.5 },
      ],
      {
        panelsInspected: tracker.panelsInspected(),
        elapsedMs: timer.elapsed(),
      }
    );

    onComplete(answer);
  }, [canSubmit, hypothesis, investigation, tracker, timer, onComplete]);

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-1">
        <h2 className="text-xl font-bold text-gray-800">Stage 3: A Different Debate</h2>
        <p className="text-sm text-gray-500">
          A new topic — but think carefully about how to evaluate the evidence.
        </p>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-2">
        <h3 className="font-bold text-amber-800">{"🏫"} Class Size Debate</h3>
        <p className="text-sm text-amber-700 leading-relaxed">
          A school board is debating whether to spend their budget on hiring more teachers to reduce class sizes.
          They&apos;ve asked for your evidence review.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {CLASS_SIZE_PANELS.map((p) => (
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

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-3">
        <h3 className="font-semibold text-gray-800 text-sm">What is your assessment?</h3>
        <div className="space-y-2">
          {HYPOTHESES.map((h) => (
            <label
              key={h.key}
              className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                hypothesis === h.key ? "border-indigo-400 bg-indigo-50" : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <input
                type="radio"
                name="cs-hypothesis"
                checked={hypothesis === h.key}
                onChange={() => setHypothesis(h.key)}
                className="mt-0.5 accent-indigo-600"
              />
              <span className="text-sm text-gray-700">{h.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-3">
        <h3 className="font-semibold text-gray-800 text-sm">What investigation would you recommend?</h3>
        <div className="space-y-2">
          {INVESTIGATIONS.map((inv) => (
            <label
              key={inv.key}
              className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                investigation === inv.key ? "border-indigo-400 bg-indigo-50" : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <input
                type="radio"
                name="cs-investigation"
                checked={investigation === inv.key}
                onChange={() => setInvestigation(inv.key)}
                className="mt-0.5 accent-indigo-600"
              />
              <span className="text-sm text-gray-700">{inv.label}</span>
            </label>
          ))}
        </div>
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
        {canSubmit ? "Submit Analysis" : "Select a hypothesis and investigation"}
      </button>
    </div>
  );
}
