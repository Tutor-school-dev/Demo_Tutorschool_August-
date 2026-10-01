"use client";

import { useState, useCallback } from "react";
import { buildAnswer, type QuestionAnswer } from "../../../types";
import ConfidenceSlider from "../../../shared/ConfidenceSlider";
import InfoPanel from "../../../shared/InfoPanel";
import { useInspectionTracker } from "../../../shared/useInspectionTracker";
import { useStageTimer } from "../../../shared/useStageTimer";

interface Props {
  onComplete: (answer: QuestionAnswer, hypothesis: string, investigation: string) => void;
}

const DATA_PANELS = [
  { id: "light", title: "Light Exposure", icon: "💡", summary: "LED lighting in both greenhouses", detail: "Both receive 14 hours of full-spectrum LED light daily. Light intensity measured at 450 µmol/m²/s in both." },
  { id: "temp", title: "Temperature", icon: "🌡️", summary: "Nearly identical conditions", detail: "Greenhouse A: 24°C average. Greenhouse B: 23.5°C average. Both within the optimal 22-26°C range." },
  { id: "ph", title: "Soil pH", icon: "🧪", summary: "A difference worth noting", detail: "Greenhouse A: pH 6.2 (slightly acidic). Greenhouse B: pH 7.1 (neutral). This is the key difference — acidic soil improves nutrient absorption for many plant species." },
  { id: "water", title: "Water Schedule", icon: "💧", summary: "Same watering routine", detail: "Both greenhouses watered 3 times daily, 500ml per plant. Same municipal water source." },
  { id: "seeds", title: "Seed Batch", icon: "🌱", summary: "Identical seed source", detail: "Same supplier, same order, same species (Rapid Growth Basil). Seeds from the same production batch." },
  { id: "humidity", title: "Humidity", icon: "☁️", summary: "Within normal range", detail: "Greenhouse A: 65% relative humidity. Greenhouse B: 62%. Both within the optimal 55-70% range." },
];

const HYPOTHESES = [
  { key: "soil_acidity", label: "The soil acidity difference (pH 6.2 vs 7.1) is causing the growth difference" },
  { key: "light_quality", label: "There might be a hidden difference in light quality between the greenhouses" },
  { key: "water_minerals", label: "The water might contain different mineral concentrations" },
  { key: "genetic_variation", label: "Despite same supplier, there could be genetic variation in the seeds" },
];

const INVESTIGATIONS = [
  { key: "soil_test", label: "Run detailed soil composition analysis" },
  { key: "light_analysis", label: "Measure full light spectrum in both greenhouses" },
  { key: "water_test", label: "Analyze water mineral content" },
];

export default function AnomalyHypothesis({ onComplete }: Props) {
  const [hypothesis, setHypothesis] = useState<string | null>(null);
  const [investigation, setInvestigation] = useState<string | null>(null);
  const [confidence, setConfidence] = useState(3);

  const tracker = useInspectionTracker(6);
  const timer = useStageTimer();

  const canSubmit = hypothesis !== null && investigation !== null;

  const handleSubmit = useCallback(() => {
    if (!canSubmit || !hypothesis || !investigation) return;

    const inspected = tracker.panelsInspected();
    const dwellMs = tracker.totalDwellMs();

    const answer = buildAnswer(
      "lab-zero-s1-anomaly",
      hypothesis,
      "STR",
      "WM",
      [
        { param: "STR", metric: "data_inspection", value: inspected / 6, weight: 1.0 },
        { param: "STR", metric: "confidence_calibration", value: confidence / 5, weight: 0.6 },
        { param: "WM", metric: "integration_depth", value: Math.min(1, dwellMs / 20000), weight: 0.4 },
      ],
      { panelsInspected: inspected, confidence, totalDwellMs: dwellMs, elapsedMs: timer.elapsed() }
    );

    onComplete(answer, hypothesis, investigation);
  }, [canSubmit, hypothesis, investigation, confidence, tracker, timer, onComplete]);

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-1">
        <h2 className="text-xl font-bold text-gray-800">Stage 1: The Anomaly</h2>
        <p className="text-sm text-gray-500">
          Plants in Greenhouse A grow 3× faster than Greenhouse B. Examine the data to find out why.
        </p>
      </div>

      <div className="flex gap-4 items-stretch">
        <div className="flex-1 bg-green-50 border border-green-200 rounded-xl p-3 text-center">
          <span className="text-2xl">🌿</span>
          <p className="font-bold text-green-800 text-sm mt-1">Greenhouse A</p>
          <p className="text-xs text-green-600">Growing 3× faster</p>
        </div>
        <div className="flex items-center text-gray-400 font-bold text-lg">vs</div>
        <div className="flex-1 bg-gray-50 border border-gray-200 rounded-xl p-3 text-center">
          <span className="text-2xl">🌱</span>
          <p className="font-bold text-gray-700 text-sm mt-1">Greenhouse B</p>
          <p className="text-xs text-gray-500">Normal growth</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {DATA_PANELS.map((p) => (
          <InfoPanel key={p.id} id={p.id} title={p.title} icon={p.icon} summary={p.summary} detail={p.detail} onToggle={tracker.toggle} />
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-3">
        <h3 className="font-semibold text-gray-800 text-sm">What do you think is causing the difference?</h3>
        <div className="space-y-2">
          {HYPOTHESES.map((h) => (
            <label key={h.key} className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${hypothesis === h.key ? "border-indigo-400 bg-indigo-50" : "border-gray-200 hover:border-gray-300"}`}>
              <input type="radio" name="hypothesis" checked={hypothesis === h.key} onChange={() => setHypothesis(h.key)} className="mt-0.5 accent-indigo-600" />
              <span className="text-sm text-gray-700">{h.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-3">
        <h3 className="font-semibold text-gray-800 text-sm">Which experiment should we run first?</h3>
        <div className="space-y-2">
          {INVESTIGATIONS.map((inv) => (
            <label key={inv.key} className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${investigation === inv.key ? "border-indigo-400 bg-indigo-50" : "border-gray-200 hover:border-gray-300"}`}>
              <input type="radio" name="investigation" checked={investigation === inv.key} onChange={() => setInvestigation(inv.key)} className="mt-0.5 accent-indigo-600" />
              <span className="text-sm text-gray-700">{inv.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex flex-col items-center">
        <ConfidenceSlider label="How confident are you in your hypothesis?" onChange={setConfidence} />
      </div>

      <button onClick={handleSubmit} disabled={!canSubmit} className={`w-full py-3 rounded-xl font-semibold text-white transition-all duration-200 ${canSubmit ? "bg-indigo-600 hover:bg-indigo-500 shadow-md hover:shadow-lg cursor-pointer active:scale-[0.98]" : "bg-gray-300 cursor-not-allowed"}`}>
        {canSubmit ? "Submit & Run Experiment" : "Select a hypothesis and investigation"}
      </button>
    </div>
  );
}
