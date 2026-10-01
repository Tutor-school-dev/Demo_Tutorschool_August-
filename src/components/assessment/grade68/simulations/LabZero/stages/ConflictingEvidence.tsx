"use client";

import { useState, useCallback, useMemo } from "react";
import { buildAnswer, type QuestionAnswer } from "../../../types";
import { useStageTimer } from "../../../shared/useStageTimer";

interface Props {
  hypothesis: string;
  investigation: string;
  onComplete: (answer: QuestionAnswer) => void;
}

function getResults(investigation: string, hypothesis: string): { title: string; body: string } {
  if (investigation === "soil_test" && hypothesis === "soil_acidity") {
    return {
      title: "🔬 Partial Confirmation",
      body: "Soil tests confirm the pH difference. Greenhouse A's acidic soil (pH 6.2) improves nutrient absorption for this basil species. But pH alone explains only ~60% of the growth gap — there may be additional factors.",
    };
  }
  if (investigation === "soil_test") {
    return {
      title: "🔬 Surprise Finding",
      body: "You expected to find something else, but the soil analysis reveals a significant pH difference (6.2 vs 7.1) that affects nutrient absorption. Your original hypothesis may need revision.",
    };
  }
  if (investigation === "light_analysis") {
    return {
      title: "🔬 Inconclusive Results",
      body: "Light measurements show nearly identical spectra in both greenhouses. However, the technician notes the light meters may not detect UV differences below 380nm. This didn't clarify the growth difference.",
    };
  }
  return {
    title: "🔬 Minor Finding",
    body: "Water mineral content is almost identical. Trace amounts of iron are slightly higher in Greenhouse A's supply, but within normal variation. The water doesn't explain the 3× growth difference.",
  };
}

const REMAINING_INVESTIGATIONS = [
  { key: "soil_test", label: "Run detailed soil composition analysis" },
  { key: "light_analysis", label: "Measure full light spectrum" },
  { key: "water_test", label: "Analyze water mineral content" },
];

const INTERPRETATIONS = [
  { key: "case_closed", label: "The evidence is clear enough — my hypothesis is confirmed", score: 0.2 },
  { key: "mostly_confirmed", label: "The evidence supports my idea, but there might be other factors", score: 0.5 },
  { key: "need_more_data", label: "The results are interesting but I need more data to be sure", score: 0.8 },
  { key: "multiple_factors", label: "Multiple factors are probably involved — this is more complex than I thought", score: 1.0 },
];

const HYPOTHESES = [
  { key: "soil_acidity", label: "Soil acidity difference" },
  { key: "light_quality", label: "Hidden light quality difference" },
  { key: "water_minerals", label: "Water mineral differences" },
  { key: "genetic_variation", label: "Genetic seed variation" },
];

export default function ConflictingEvidence({ hypothesis, investigation, onComplete }: Props) {
  const results = useMemo(() => getResults(investigation, hypothesis), [investigation, hypothesis]);

  const [interpretation, setInterpretation] = useState<string | null>(null);
  const [wantRevise, setWantRevise] = useState(false);
  const [revisedHypothesis, setRevisedHypothesis] = useState<string | null>(null);
  const [nextExperiment, setNextExperiment] = useState<string | null>(null);

  const timer = useStageTimer();

  const availableInvestigations = REMAINING_INVESTIGATIONS.filter((i) => i.key !== investigation);
  const canSubmit = interpretation !== null && nextExperiment !== null;

  const handleSubmit = useCallback(() => {
    if (!canSubmit) return;

    const interpScore = INTERPRETATIONS.find((i) => i.key === interpretation)?.score ?? 0.5;
    const didRevise = wantRevise && revisedHypothesis !== null;
    const continuedInquiry = didRevise ? 1.0 : nextExperiment ? 0.8 : 0.4;

    const answer = buildAnswer(
      "lab-zero-s2-conflicting",
      interpretation!,
      "FB",
      "PAC",
      [
        { param: "FB", metric: "feedback_interpretation", value: interpScore, weight: 1.0 },
        { param: "PAC", metric: "continued_inquiry", value: continuedInquiry, weight: 0.8 },
        { param: "WM", metric: "revision_quality", value: didRevise ? 0.9 : 0.5, weight: 0.5 },
      ],
      {
        didRevise: didRevise ? 1 : 0,
        elapsedMs: timer.elapsed(),
      }
    );

    onComplete(answer);
  }, [canSubmit, interpretation, wantRevise, revisedHypothesis, nextExperiment, timer, onComplete]);

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-1">
        <h2 className="text-xl font-bold text-gray-800">Stage 2: Conflicting Evidence</h2>
        <p className="text-sm text-gray-500">Your experiment results are in. What do they mean?</p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 space-y-2">
        <h3 className="font-bold text-blue-800">{results.title}</h3>
        <p className="text-sm text-blue-700 leading-relaxed">{results.body}</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-3">
        <h3 className="font-semibold text-gray-800 text-sm">How do you interpret these results?</h3>
        <div className="space-y-2">
          {INTERPRETATIONS.map((i) => (
            <label key={i.key} className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${interpretation === i.key ? "border-indigo-400 bg-indigo-50" : "border-gray-200 hover:border-gray-300"}`}>
              <input type="radio" name="interpretation" checked={interpretation === i.key} onChange={() => setInterpretation(i.key)} className="mt-0.5 accent-indigo-600" />
              <span className="text-sm text-gray-700">{i.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-3">
        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" checked={wantRevise} onChange={(e) => setWantRevise(e.target.checked)} className="accent-indigo-600 w-4 h-4" />
          <span className="text-sm font-medium text-gray-700">I want to revise my hypothesis</span>
        </label>

        {wantRevise && (
          <div className="space-y-2 pl-7">
            {HYPOTHESES.filter((h) => h.key !== hypothesis).map((h) => (
              <label key={h.key} className={`flex items-center gap-3 p-2 rounded-lg border cursor-pointer transition-all ${revisedHypothesis === h.key ? "border-indigo-400 bg-indigo-50" : "border-gray-200 hover:border-gray-300"}`}>
                <input type="radio" name="revised" checked={revisedHypothesis === h.key} onChange={() => setRevisedHypothesis(h.key)} className="accent-indigo-600" />
                <span className="text-sm text-gray-700">{h.label}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-3">
        <h3 className="font-semibold text-gray-800 text-sm">What should we investigate next?</h3>
        <div className="space-y-2">
          {availableInvestigations.map((inv) => (
            <label key={inv.key} className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${nextExperiment === inv.key ? "border-indigo-400 bg-indigo-50" : "border-gray-200 hover:border-gray-300"}`}>
              <input type="radio" name="next-exp" checked={nextExperiment === inv.key} onChange={() => setNextExperiment(inv.key)} className="mt-0.5 accent-indigo-600" />
              <span className="text-sm text-gray-700">{inv.label}</span>
            </label>
          ))}
        </div>
      </div>

      <button onClick={handleSubmit} disabled={!canSubmit} className={`w-full py-3 rounded-xl font-semibold text-white transition-all duration-200 ${canSubmit ? "bg-indigo-600 hover:bg-indigo-500 shadow-md hover:shadow-lg cursor-pointer active:scale-[0.98]" : "bg-gray-300 cursor-not-allowed"}`}>
        {canSubmit ? "Continue Investigation" : "Make your selections to continue"}
      </button>
    </div>
  );
}
