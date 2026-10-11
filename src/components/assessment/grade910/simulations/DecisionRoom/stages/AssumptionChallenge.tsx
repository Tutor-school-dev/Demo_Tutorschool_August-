"use client";

import { useState, useCallback, useMemo } from "react";
import { buildAnswer, type QuestionAnswer } from "../../../types";
import InfoPanel from "../../../../grade68/shared/InfoPanel";
import { useInspectionTracker } from "../../../../grade68/shared/useInspectionTracker";
import { useStageTimer } from "../../../../grade68/shared/useStageTimer";

interface Props {
  decision: string;
  reasoning: string;
  onComplete: (answer: QuestionAnswer) => void;
}

const CHALLENGES: Record<string, string> = {
  switch_online:
    "A neighbouring school that switched to online exams last year reported: (1) 35% increase in academic dishonesty — students found ways to share answers via messaging apps during exams; (2) Anti-cheating proctoring software would cost ₹1,50,000/year — not in the original budget, making the cost advantage disappear for 6 more years; (3) Three senior teachers resigned citing 'unsustainable screen monitoring burden.'",
  keep_paper:
    "The State Education Board just announced: ALL schools must have at least 40% online assessment capability within 2 years. Schools that fail to comply will face a 15% reduction in government funding (approximately ₹4,50,000/year for your school). The board stated: 'Paper-only assessment is no longer viable in the digital education landscape.'",
  hybrid:
    "Five schools that implemented hybrid exam systems reported: (1) Confusion — students didn't know which subjects had which format until the last week; (2) Administrative costs were 40% higher than either pure system; (3) Teachers needed double the preparation time. The average implementation took 18 months, not the 6 months planned.",
  more_investigation:
    "The school management committee has moved the decision deadline to next Friday — there is no time for a full investigation. The principal stated: 'We need a clear recommendation NOW. The board vote is in 10 days.' You must make a recommendation with the information you have.",
};

const METHODOLOGY_DETAILS: Record<string, string> = {
  switch_online:
    "Data from the neighbouring school is self-reported by administration. The cheating figure counts 'suspected' cases, not proven ones. The 3 resignations happened during a broader staffing dispute. The proctoring cost estimate comes from one vendor; cheaper alternatives exist.",
  keep_paper:
    "Government mandate is from an official gazette notification. The funding reduction is confirmed by the district education officer. However, the 2-year deadline has been extended once before for other mandates.",
  hybrid:
    "The five schools vary widely in size (200–1,500 students). The 40% higher cost figure includes first-year setup costs that wouldn't recur. Two of the five schools reported the hybrid system working well by Year 2.",
  more_investigation:
    "The principal's urgency may be inflated — previous deadlines have been flexible. However, the board meeting date is confirmed. A partial recommendation with caveats is still acceptable.",
};

const RESPONSE_OPTIONS = [
  { key: "defend", label: "I'll defend my original recommendation — this doesn't change the fundamentals", score: 0.3 },
  { key: "investigate", label: "I want to examine this new information's reliability before responding", score: 0.8 },
  { key: "revise", label: "I'll revise my recommendation entirely based on this evidence", score: 0.7 },
  { key: "partial_revise", label: "I'll keep the core recommendation but adjust it to address this concern", score: 0.9 },
  { key: "seek_perspective", label: "I want to hear from someone who has dealt with this situation before", score: 0.6 },
];

const REVISED_DECISIONS = [
  { key: "switch_online", label: "Switch fully to online exams" },
  { key: "keep_paper", label: "Keep paper-based exams" },
  { key: "hybrid", label: "Hybrid approach — some subjects online, some on paper" },
  { key: "more_investigation", label: "More investigation before deciding" },
];

export default function AssumptionChallenge({ decision, reasoning, onComplete }: Props) {
  const challenge = useMemo(() => CHALLENGES[decision] ?? CHALLENGES.hybrid, [decision]);
  const methodology = useMemo(() => METHODOLOGY_DETAILS[decision] ?? METHODOLOGY_DETAILS.hybrid, [decision]);

  const [response, setResponse] = useState<string | null>(null);
  const [revisedDecision, setRevisedDecision] = useState<string | null>(null);
  const [checkedMethodology, setCheckedMethodology] = useState(false);

  const tracker = useInspectionTracker(1);
  const timer = useStageTimer();

  const showRevision = response === "revise" || response === "partial_revise";
  const canSubmit = response !== null && (!showRevision || revisedDecision !== null);

  const handleMethodToggle = useCallback(
    (id: string, isOpen: boolean) => {
      tracker.toggle(id, isOpen);
      if (isOpen) setCheckedMethodology(true);
    },
    [tracker]
  );

  const handleSubmit = useCallback(() => {
    if (!canSubmit || !response) return;

    const elapsedMs = timer.elapsed();
    const responseScore = RESPONSE_OPTIONS.find((o) => o.key === response)?.score ?? 0.5;
    const nuancedScore =
      response === "partial_revise" ? 1.0 : response === "revise" ? 0.7 : response === "defend" ? 0.3 : 0.5;

    const answer = buildAnswer(
      "g910-decision-s2-challenge",
      showRevision && revisedDecision ? `${response}|${revisedDecision}` : response,
      "FB",
      "PAC",
      [
        { param: "FB", metric: "revision_after_challenge", value: responseScore, weight: 1.0 },
        { param: "FB", metric: "evidence_integration", value: checkedMethodology ? 0.9 : 0.5, weight: 0.7 },
        { param: "PAC", metric: "persistence_under_uncertainty", value: Math.min(1, elapsedMs / 30000), weight: 0.6 },
        { param: "ABS", metric: "nuanced_thinking", value: nuancedScore, weight: 0.5 },
      ],
      {
        responseChoice: RESPONSE_OPTIONS.findIndex((o) => o.key === response),
        investigatedMethodology: checkedMethodology ? 1 : 0,
        revisedDecision: showRevision && revisedDecision ? 1 : 0,
        elapsedMs,
      }
    );

    onComplete(answer);
  }, [canSubmit, response, revisedDecision, showRevision, checkedMethodology, timer, onComplete]);

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-1">
        <h2 className="text-xl font-bold text-gray-800">Stage 2: Your Assumption Challenged</h2>
        <p className="text-sm text-gray-500">New information challenges a key part of your recommendation.</p>
      </div>

      <div className="bg-red-50 border border-red-200 rounded-xl p-4 space-y-2">
        <h3 className="font-bold text-red-800">⚠️ Challenging Evidence</h3>
        <p className="text-sm text-red-700 leading-relaxed">{challenge}</p>
      </div>

      <InfoPanel
        id="challenge_method"
        title="Source & Methodology"
        icon="🔎"
        summary="How reliable is this new information?"
        detail={methodology}
        onToggle={handleMethodToggle}
      />

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-3">
        <h3 className="font-semibold text-gray-800 text-sm">How do you respond?</h3>
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
                onChange={() => {
                  setResponse(o.key);
                  setRevisedDecision(null);
                }}
                className="mt-0.5 accent-indigo-600"
              />
              <span className="text-sm text-gray-700">{o.label}</span>
            </label>
          ))}
        </div>
      </div>

      {showRevision && (
        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-5 space-y-3">
          <h3 className="font-semibold text-indigo-800 text-sm">
            {response === "partial_revise" ? "Adjust your recommendation:" : "Choose a new recommendation:"}
          </h3>
          <div className="space-y-2">
            {REVISED_DECISIONS.filter((d) => d.key !== decision).map((d) => (
              <label
                key={d.key}
                className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                  revisedDecision === d.key
                    ? "border-indigo-400 bg-white"
                    : "border-indigo-200 hover:border-indigo-300"
                }`}
              >
                <input
                  type="radio"
                  name="revised"
                  checked={revisedDecision === d.key}
                  onChange={() => setRevisedDecision(d.key)}
                  className="mt-0.5 accent-indigo-600"
                />
                <span className="text-sm text-indigo-700">{d.label}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={!canSubmit}
        className={`w-full py-3 rounded-xl font-semibold text-white transition-all duration-200 ${
          canSubmit
            ? "bg-indigo-600 hover:bg-indigo-500 shadow-md hover:shadow-lg cursor-pointer active:scale-[0.98]"
            : "bg-gray-300 cursor-not-allowed"
        }`}
      >
        {canSubmit ? "Submit Response" : "Choose how to respond"}
      </button>
    </div>
  );
}
