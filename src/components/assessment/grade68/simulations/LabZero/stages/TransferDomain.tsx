"use client";

import { useState, useCallback } from "react";
import { buildAnswer, type QuestionAnswer } from "../../../types";
import InfoPanel from "../../../shared/InfoPanel";
import { useInspectionTracker } from "../../../shared/useInspectionTracker";
import { useStageTimer } from "../../../shared/useStageTimer";

interface Props {
  onComplete: (answer: QuestionAnswer) => void;
}

const BAKERY_PANELS = [
  { id: "schedule", title: "Baking Schedule", icon: "📅", summary: "10-year routine, same recipe", detail: "Mon-Sat, 4am start. Same recipe used for 10 years. No changes to process or timing." },
  { id: "oven", title: "Oven Temperature", icon: "🔥", summary: "Consistent and calibrated", detail: "Preheated to 220°C, consistent readings across all zones. Calibrated monthly by a certified technician." },
  { id: "flour", title: "Flour Suppliers", icon: "🌾", summary: "Two suppliers, alternating weeks", detail: "Supplier A: Stone-ground, slightly acidic (pH 5.8). Supplier B: Processed, neutral (pH 7.0). Both certified Grade A wheat flour." },
  { id: "yeast", title: "Yeast & Water", icon: "💧", summary: "Same source every day", detail: "Same yeast brand (purchased monthly), same water source, same quantities measured precisely." },
];

const HYPOTHESES = [
  { key: "flour_chemistry", label: "The flour pH difference is affecting yeast activity" },
  { key: "oven_inconsistency", label: "The oven might have hot spots or temperature fluctuations" },
  { key: "yeast_quality", label: "The yeast might be losing potency over time" },
  { key: "humidity_effect", label: "Kitchen humidity changes are affecting the dough" },
];

const INVESTIGATIONS = [
  { key: "flour_test", label: "Test both flours' pH and protein content" },
  { key: "oven_test", label: "Place temperature loggers throughout the oven" },
  { key: "yeast_test", label: "Test yeast viability from different batches" },
];

export default function TransferDomain({ onComplete }: Props) {
  const [hypothesis, setHypothesis] = useState<string | null>(null);
  const [investigation, setInvestigation] = useState<string | null>(null);

  const tracker = useInspectionTracker(4);
  const timer = useStageTimer();

  const canSubmit = hypothesis !== null && investigation !== null;

  const handleSubmit = useCallback(() => {
    if (!canSubmit || !hypothesis || !investigation) return;

    const answer = buildAnswer(
      "lab-zero-s3-transfer",
      hypothesis,
      "ABS",
      "ABS",
      [
        { param: "ABS", metric: "structural_analogy", value: hypothesis === "flour_chemistry" ? 1.0 : 0.2, weight: 1.0 },
        { param: "ABS", metric: "investigation_transfer", value: investigation === "flour_test" ? 1.0 : 0.2, weight: 0.8 },
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
        <h2 className="text-xl font-bold text-gray-800">Stage 3: A Different Problem</h2>
        <p className="text-sm text-gray-500">
          A local bakery needs your scientific thinking. Can you spot what's going on?
        </p>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-2">
        <h3 className="font-bold text-amber-800">🍞 The Bakery Mystery</h3>
        <p className="text-sm text-amber-700 leading-relaxed">
          A local bakery is having trouble. Some days their bread rises perfectly, other days it&apos;s flat.
          Same recipe, same oven, same baker. They buy flour from two different suppliers on alternating weeks.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {BAKERY_PANELS.map((p) => (
          <InfoPanel key={p.id} id={p.id} title={p.title} icon={p.icon} summary={p.summary} detail={p.detail} onToggle={tracker.toggle} />
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-3">
        <h3 className="font-semibold text-gray-800 text-sm">What do you think is causing the inconsistent bread?</h3>
        <div className="space-y-2">
          {HYPOTHESES.map((h) => (
            <label key={h.key} className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${hypothesis === h.key ? "border-indigo-400 bg-indigo-50" : "border-gray-200 hover:border-gray-300"}`}>
              <input type="radio" name="bakery-hyp" checked={hypothesis === h.key} onChange={() => setHypothesis(h.key)} className="mt-0.5 accent-indigo-600" />
              <span className="text-sm text-gray-700">{h.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-3">
        <h3 className="font-semibold text-gray-800 text-sm">Which investigation would you recommend?</h3>
        <div className="space-y-2">
          {INVESTIGATIONS.map((inv) => (
            <label key={inv.key} className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${investigation === inv.key ? "border-indigo-400 bg-indigo-50" : "border-gray-200 hover:border-gray-300"}`}>
              <input type="radio" name="bakery-inv" checked={investigation === inv.key} onChange={() => setInvestigation(inv.key)} className="mt-0.5 accent-indigo-600" />
              <span className="text-sm text-gray-700">{inv.label}</span>
            </label>
          ))}
        </div>
      </div>

      <button onClick={handleSubmit} disabled={!canSubmit} className={`w-full py-3 rounded-xl font-semibold text-white transition-all duration-200 ${canSubmit ? "bg-indigo-600 hover:bg-indigo-500 shadow-md hover:shadow-lg cursor-pointer active:scale-[0.98]" : "bg-gray-300 cursor-not-allowed"}`}>
        {canSubmit ? "Submit Analysis" : "Select a hypothesis and investigation"}
      </button>
    </div>
  );
}
