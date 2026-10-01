"use client";

import { useState, useCallback, useMemo } from "react";
import { buildAnswer, type QuestionAnswer } from "../../../types";
import { useStageTimer } from "../../../shared/useStageTimer";

interface Props {
  proposal: string;
  onComplete: (answer: QuestionAnswer) => void;
}

const COMPLICATIONS: Record<string, string> = {
  computers: "The school's internet connection is too slow (2 Mbps shared) for 20 computers. Upgrading would cost an additional ₹15,000/year — not in the budget.",
  garden: "The proposed garden area floods during monsoon season (June-August). Drainage work would cost ₹12,000 extra, and the garden can't be used for 3 months/year.",
  science_camp: "The national lab just announced they're raising fees by 30% next year. At the new price, only 30 students can attend instead of 40. Some parents can't afford the ₹500 personal expense.",
  sports: "The school basketball court has a structural crack underneath. Resurfacing without fixing the foundation means it'll crack again within 2 years. Foundation repair costs ₹20,000 extra.",
};

const RESPONSE_OPTIONS = [
  { key: "stick", label: "I'll stick with my original choice — the evidence doesn't change the core value", score: 0.5 },
  { key: "switch", label: "I want to switch to a different proposal entirely", score: 0.6 },
  { key: "modify", label: "I'll modify my proposal to address the new concerns", score: 1.0 },
  { key: "gather_more", label: "I need more information before deciding — let's investigate", score: 0.8 },
];

export default function NewEvidenceChallenge({ proposal, onComplete }: Props) {
  const complication = useMemo(() => COMPLICATIONS[proposal] ?? COMPLICATIONS.computers, [proposal]);

  const [response, setResponse] = useState<string | null>(null);
  const [surveyTrust, setSurveyTrust] = useState(50);

  const timer = useStageTimer();

  const canSubmit = response !== null;

  const handleSubmit = useCallback(() => {
    if (!canSubmit || !response) return;

    const responseScore = RESPONSE_OPTIONS.find((o) => o.key === response)?.score ?? 0.5;
    const elapsedMs = timer.elapsed();
    const trustDeviation = Math.abs(surveyTrust / 100 - 0.35);
    const statReasoning = Math.max(0, Math.min(1, 1 - trustDeviation * 2));

    const answer = buildAnswer(
      "decision-s2-new-evidence",
      response,
      "FB",
      "STR",
      [
        { param: "FB", metric: "evidence_response", value: responseScore, weight: 1.0 },
        { param: "STR", metric: "continued_engagement", value: Math.min(1, elapsedMs / 40000), weight: 0.6 },
        { param: "PAC", metric: "deliberation_time", value: Math.min(1, elapsedMs / 30000), weight: 0.5 },
        { param: "FB", metric: "statistical_reasoning", value: statReasoning, weight: 0.7 },
      ],
      {
        surveyTrust,
        statReasoningScore: Math.round(statReasoning * 100),
        elapsedMs,
      }
    );

    onComplete(answer);
  }, [canSubmit, response, surveyTrust, timer, onComplete]);

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-1">
        <h2 className="text-xl font-bold text-gray-800">Stage 2: New Evidence</h2>
        <p className="text-sm text-gray-500">New information challenges your choice. How will you respond?</p>
      </div>

      <div className="bg-red-50 border border-red-200 rounded-xl p-4 space-y-2">
        <h3 className="font-bold text-red-800">⚠️ Complicating Evidence</h3>
        <p className="text-sm text-red-700 leading-relaxed">{complication}</p>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-2">
        <h3 className="font-bold text-amber-800">📊 School Survey Results</h3>
        <p className="text-sm text-amber-700 leading-relaxed">
          A quick survey was done — <strong>150 out of 800 students</strong> responded.
          45% want computers, 30% want sports, 15% want science camp, 10% want garden.
        </p>
        <p className="text-xs text-amber-600 italic">
          Note: Only 19% of students responded. The survey was posted on the school notice board for one day.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-3">
        <h3 className="font-semibold text-gray-800 text-sm">Given the new evidence, what do you want to do?</h3>
        <div className="space-y-2">
          {RESPONSE_OPTIONS.map((o) => (
            <label key={o.key} className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${response === o.key ? "border-indigo-400 bg-indigo-50" : "border-gray-200 hover:border-gray-300"}`}>
              <input type="radio" name="response" checked={response === o.key} onChange={() => setResponse(o.key)} className="mt-0.5 accent-indigo-600" />
              <span className="text-sm text-gray-700">{o.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-3">
        <h3 className="font-semibold text-gray-800 text-sm">How much would you trust this survey?</h3>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-400 w-8">0%</span>
          <input
            type="range"
            min={0}
            max={100}
            value={surveyTrust}
            onChange={(e) => setSurveyTrust(Number(e.target.value))}
            className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-500"
          />
          <span className="text-xs text-gray-400 w-10">100%</span>
        </div>
        <p className="text-xs text-indigo-600 text-center font-medium">
          {surveyTrust}% trust — {surveyTrust < 25 ? "Very skeptical" : surveyTrust < 50 ? "Somewhat skeptical" : surveyTrust < 75 ? "Mostly trusting" : "Highly trusting"}
        </p>
      </div>

      <button onClick={handleSubmit} disabled={!canSubmit} className={`w-full py-3 rounded-xl font-semibold text-white transition-all duration-200 ${canSubmit ? "bg-indigo-600 hover:bg-indigo-500 shadow-md hover:shadow-lg cursor-pointer active:scale-[0.98]" : "bg-gray-300 cursor-not-allowed"}`}>
        {canSubmit ? "Submit Response" : "Choose how you want to respond"}
      </button>
    </div>
  );
}
