"use client";

import { useState, useCallback, useMemo } from "react";
import { buildAnswer, type QuestionAnswer } from "../../../types";
import InfoPanel from "../../../../grade68/shared/InfoPanel";
import { useInspectionTracker } from "../../../../grade68/shared/useInspectionTracker";
import { useStageTimer } from "../../../../grade68/shared/useStageTimer";

interface Props {
  interpretation: string;
  onComplete: (answer: QuestionAnswer) => void;
}

const CONTRADICTIONS: Record<string, { title: string; body: string; methodology: string }> = {
  complex_relationship: {
    title: "\u{1F4D1} New Large-Scale RCT Published",
    body: "A new randomized controlled trial with 5,000 students across 50 schools found NO statistically significant relationship between gaming hours and academic performance (p=0.72, effect size d=0.02). The study controlled for socioeconomic status, sleep, parental involvement, and game type. Lead researcher: 'Once you control for confounding variables, the gaming-grades connection essentially disappears.'",
    methodology: "Double-blind RCT. Students' actual gaming tracked via app monitoring (not self-reported). Academic scores from official school records. Pre-registered analysis plan. Limitations: Only tracked students aged 14–16 in urban schools.",
  },
  insufficient_evidence: {
    title: "\u{1F4D1} Landmark Longitudinal Study Released",
    body: "A 3-year longitudinal study tracking 8,000 students found those gaming >2 hrs/day showed 15% lower GPA growth compared to non-gamers (p=0.001, controlled for income and prior grades). The effect was consistent across all game types. This is the largest and most rigorous study on the topic to date.",
    methodology: "Longitudinal cohort study. Gaming tracked via weekly surveys cross-validated with screen-time apps. GPA from school records. Controlled for 12 confounding variables. Limitations: Observational, not experimental — cannot prove causation.",
  },
  gaming_harms: {
    title: "\u{1F4D1} New Large-Scale RCT Published",
    body: "A new randomized controlled trial with 5,000 students found NO significant link between gaming hours and grades once confounding variables were controlled. The lead researcher stated: 'Previous survey studies, including the Oxford one, likely measured the effect of poverty and home environment, not gaming itself.'",
    methodology: "Double-blind RCT. Students' actual gaming tracked via app monitoring (not self-reported). Academic scores from official school records. Pre-registered analysis plan. Limitations: Only tracked students aged 14–16 in urban schools.",
  },
  no_effect: {
    title: "\u{1F4D1} Landmark Longitudinal Study Released",
    body: "A 3-year study tracking 8,000 students found a consistent 15% GPA growth disadvantage for heavy gamers (>2 hrs/day). Unlike the small lab experiment, this real-world study captured long-term effects that short experiments miss.",
    methodology: "Longitudinal cohort study. Gaming tracked via weekly surveys cross-validated with screen-time apps. GPA from school records. Controlled for 12 confounding variables. Limitations: Observational, not experimental — cannot prove causation.",
  },
};

const RESPONSE_OPTIONS = [
  { key: "maintain", label: "I'll maintain my original interpretation — one study doesn't change things", score: 0.3 },
  { key: "investigate", label: "I want to examine this study's methodology before deciding", score: 0.8 },
  { key: "compare", label: "I'll systematically compare all the evidence — old and new", score: 0.9 },
  { key: "revise", label: "I'll revise my interpretation based on this new evidence", score: 0.7 },
  { key: "seek_more", label: "I want to look for additional sources to resolve the conflict", score: 0.6 },
];

const REVISION_OPTIONS = [
  { key: "gaming_harms", label: "Gaming clearly harms academic performance" },
  { key: "no_effect", label: "Gaming has no real effect on grades" },
  { key: "complex_relationship", label: "The relationship is complex — depends on many factors" },
  { key: "insufficient_evidence", label: "We can't draw firm conclusions" },
];

export default function EvidenceConflict({ interpretation, onComplete }: Props) {
  const contradiction = useMemo(
    () => CONTRADICTIONS[interpretation] ?? CONTRADICTIONS.complex_relationship,
    [interpretation]
  );

  const [response, setResponse] = useState<string | null>(null);
  const [wantRevise, setWantRevise] = useState(false);
  const [revisedInterpretation, setRevisedInterpretation] = useState<string | null>(null);

  const tracker = useInspectionTracker(1);
  const timer = useStageTimer();

  const canSubmit = response !== null;

  const handleSubmit = useCallback(() => {
    if (!canSubmit || !response) return;

    const choiceScore = RESPONSE_OPTIONS.find((o) => o.key === response)?.score ?? 0.5;
    const checkedMethodology = tracker.panelsInspected() > 0;
    const continuedInquiry = ["investigate", "compare", "seek_more"].includes(response) ? 0.9 : 0.4;
    const dwellMs = tracker.totalDwellMs();

    const answer = buildAnswer(
      "g910-research-s2-conflict",
      response,
      "FB",
      "PAC",
      [
        { param: "FB", metric: "revision_after_evidence", value: choiceScore, weight: 1.0 },
        { param: "FB", metric: "methodology_checked", value: checkedMethodology ? 1.0 : 0.3, weight: 0.7 },
        { param: "PAC", metric: "continued_inquiry", value: continuedInquiry, weight: 0.6 },
        { param: "WM", metric: "multi_evidence_retention", value: Math.min(1, dwellMs / 15000), weight: 0.4 },
      ],
      {
        checkedMethodology: checkedMethodology ? 1 : 0,
        revisedInterpretation: wantRevise && revisedInterpretation !== null ? 1 : 0,
        elapsedMs: timer.elapsed(),
        totalDwellMs: dwellMs,
      }
    );

    onComplete(answer);
  }, [canSubmit, response, wantRevise, revisedInterpretation, tracker, timer, onComplete]);

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-1">
        <h2 className="text-xl font-bold text-gray-800">Stage 2: Conflicting Evidence</h2>
        <p className="text-sm text-gray-500">New research has arrived. Does it change your mind?</p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 space-y-2">
        <h3 className="font-bold text-blue-800">{contradiction.title}</h3>
        <p className="text-sm text-blue-700 leading-relaxed">{contradiction.body}</p>
      </div>

      <InfoPanel
        id="new_methodology"
        title="Study Methodology"
        icon="\u{1F50E}"
        summary="How was this study conducted?"
        detail={contradiction.methodology}
        onToggle={tracker.toggle}
      />

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-3">
        <h3 className="font-semibold text-gray-800 text-sm">How do you respond to this new evidence?</h3>
        <div className="space-y-2">
          {RESPONSE_OPTIONS.map((o) => (
            <label
              key={o.key}
              className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                response === o.key ? "border-indigo-400 bg-indigo-50" : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <input
                type="radio"
                name="response"
                checked={response === o.key}
                onChange={() => setResponse(o.key)}
                className="mt-0.5 accent-indigo-600"
              />
              <span className="text-sm text-gray-700">{o.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-3">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={wantRevise}
            onChange={(e) => setWantRevise(e.target.checked)}
            className="accent-indigo-600 w-4 h-4"
          />
          <span className="text-sm font-medium text-gray-700">I want to revise my interpretation</span>
        </label>

        {wantRevise && (
          <div className="space-y-2 pl-7">
            {REVISION_OPTIONS.filter((o) => o.key !== interpretation).map((o) => (
              <label
                key={o.key}
                className={`flex items-center gap-3 p-2 rounded-lg border cursor-pointer transition-all ${
                  revisedInterpretation === o.key
                    ? "border-indigo-400 bg-indigo-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <input
                  type="radio"
                  name="revised"
                  checked={revisedInterpretation === o.key}
                  onChange={() => setRevisedInterpretation(o.key)}
                  className="accent-indigo-600"
                />
                <span className="text-sm text-gray-700">{o.label}</span>
              </label>
            ))}
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
        {canSubmit ? "Continue Investigation" : "Choose a response to continue"}
      </button>
    </div>
  );
}
