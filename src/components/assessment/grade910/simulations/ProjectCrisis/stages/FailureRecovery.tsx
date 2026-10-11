"use client";

import { useState, useCallback, useMemo } from "react";
import { buildAnswer, type QuestionAnswer } from "../../../types";
import { useStageTimer } from "../../../../grade68/shared/useStageTimer";

interface Props {
  approach: string;
  onComplete: (answer: QuestionAnswer) => void;
}

const FAILURE_MESSAGES: Record<string, { title: string; positive: string; negative: string }> = {
  check_criteria: {
    title: "🔍 Practice Run Results",
    positive: "Your combined approach shows strong scientific thinking. Judges liked your methodology section.",
    negative: "However, your test results are inconsistent — 2 of 5 filtration trials failed to reduce contamination levels. The judges noted: 'Promising design, but unreliable data undermines the conclusions.'",
  },
  combine_both: {
    title: "🔍 Practice Run Results",
    positive: "The combination of building AND testing impressed the mock judges. Your demo is visually strong.",
    negative: "However, you ran out of time for proper data collection. Only 2 of 5 planned tests were completed. Feedback: 'Great ambition, but the data section feels incomplete and rushed.'",
  },
  riya_approach: {
    title: "🔍 Practice Run Results",
    positive: "Your physical filtration device works beautifully. The three-stage filter is visually impressive and the demo went smoothly.",
    negative: "However, when judges asked 'How do you know it actually purifies the water?' your team couldn't provide data. Feedback: 'Excellent build, but where's the evidence? A science fair needs science, not just engineering.'",
  },
  arjun_approach: {
    title: "🔍 Practice Run Results",
    positive: "Your comparative data is thorough and scientifically rigorous. The judges praised your methodology and statistical analysis.",
    negative: "However, your poster is half-finished and you have no physical demo. Feedback: 'Outstanding data, but the presentation is hard to follow without visuals. You need to SHOW, not just tell.'",
  },
};

const RESPONSES = [
  { key: "repeat_carefully", label: "Do the same thing again but more carefully — we just need to execute better", score: 0.2 },
  { key: "modify_based_on_feedback", label: "Modify our approach based on what the judges said — fix the specific weakness", score: 1.0 },
  { key: "ask_teacher", label: "Ask a teacher what we should do — they'll know the right answer", score: 0.3 },
  { key: "focus_weak_area", label: "Drop everything else and pour all remaining time into fixing the weak area", score: 0.7 },
];

export default function FailureRecovery({ approach, onComplete }: Props) {
  const feedback = useMemo(() => FAILURE_MESSAGES[approach] ?? FAILURE_MESSAGES.combine_both, [approach]);
  const [response, setResponse] = useState<string | null>(null);
  const timer = useStageTimer();

  const canSubmit = response !== null;

  const handleSubmit = useCallback(() => {
    if (!canSubmit || !response) return;

    const choiceScore = RESPONSES.find((r) => r.key === response)?.score ?? 0.5;
    const elapsedMs = timer.elapsed();

    const fbScore =
      response === "modify_based_on_feedback" ? 1.0 : response === "focus_weak_area" ? 0.7 : 0.2;

    const absScore =
      response === "modify_based_on_feedback" ? 0.9 : response === "focus_weak_area" ? 0.6 : 0.2;

    const answer = buildAnswer(
      "g910-project-s3-failure",
      response,
      "PAC",
      "FB",
      [
        { param: "FB", metric: "revision_after_feedback", value: Math.min(1, Math.max(0, fbScore)), weight: 1.0 },
        { param: "PAC", metric: "productive_persistence", value: Math.min(1, Math.max(0, choiceScore)), weight: 1.0 },
        { param: "PAC", metric: "persistence_after_setback", value: Math.min(1, elapsedMs / 25000), weight: 0.8 },
        { param: "ABS", metric: "principle_application", value: Math.min(1, Math.max(0, absScore)), weight: 0.5 },
        { param: "STR", metric: "continued_effort", value: Math.min(1, elapsedMs / 20000), weight: 0.4 },
      ],
      {
        elapsedMs,
      }
    );

    onComplete(answer);
  }, [canSubmit, response, timer, onComplete]);

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-1">
        <h2 className="text-xl font-bold text-gray-800">Stage 3: Something Went Wrong</h2>
        <p className="text-sm text-gray-500">Your approach hit a problem. Read the feedback and decide how to recover.</p>
      </div>

      <div className="space-y-3">
        <h3 className="font-bold text-gray-800">{feedback.title}</h3>

        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <h4 className="font-semibold text-green-800 text-sm mb-1">✅ What Worked</h4>
          <p className="text-sm text-green-700 leading-relaxed">{feedback.positive}</p>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <h4 className="font-semibold text-amber-800 text-sm mb-1">⚠️ What Didn&apos;t</h4>
          <p className="text-sm text-amber-700 leading-relaxed">{feedback.negative}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-3">
        <h3 className="font-semibold text-gray-800 text-sm">How will you recover?</h3>
        <div className="space-y-2">
          {RESPONSES.map((r) => (
            <label
              key={r.key}
              className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                response === r.key ? "border-indigo-400 bg-indigo-50" : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <input
                type="radio"
                name="response"
                checked={response === r.key}
                onChange={() => setResponse(r.key)}
                className="mt-0.5 accent-indigo-600"
              />
              <span className="text-sm text-gray-700">{r.label}</span>
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
        {canSubmit ? "Confirm Recovery Plan" : "Choose an approach first"}
      </button>
    </div>
  );
}
