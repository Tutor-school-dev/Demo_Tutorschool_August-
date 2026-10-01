"use client";

import { useState, useCallback } from "react";
import { buildAnswer, type QuestionAnswer } from "../../../types";
import InfoPanel from "../../../shared/InfoPanel";
import { useInspectionTracker } from "../../../shared/useInspectionTracker";
import { useStageTimer } from "../../../shared/useStageTimer";

interface Props {
  onComplete: (answer: QuestionAnswer, diagnosis: string, modification: string) => void;
}

const ANALYTICS_PANELS = [
  { id: "retention", title: "Player Retention", icon: "📊", summary: "Level completion rates", detail: "Level 1: 95%, Level 2: 88%, Level 3: 82%, Level 4: 31%, Level 5: 28%. Massive drop-off after Level 3." },
  { id: "sessions", title: "Session Times", icon: "⏱️", summary: "Average play duration", detail: "New players average 12 min/session in week 1, dropping to 4 min/session by week 3. Returning players: 6 min/session." },
  { id: "difficulty", title: "Difficulty Rating", icon: "🔒", summary: "Click to reveal internal data", detail: "Internal testing shows difficulty score FLAT at 2.3/10 from Level 3 onwards. Levels 1-3 scale from 1.0 to 2.3. Players aren't being challenged." },
  { id: "currency", title: "In-Game Currency", icon: "💰", summary: "Economy metrics", detail: "Players earn 100 coins/level. Shop items cost 50-200 coins. 70% of players have 500+ unspent coins by Level 5." },
  { id: "feedback", title: "Player Feedback", icon: "💬", summary: "Recent reviews", detail: "'Too easy after a while' (★★), 'Got bored around level 4' (★★), 'Love the dragon but no challenge' (★★★), 'My 5-year-old finished it in a day' (★★)." },
  { id: "competitor", title: "Competitor Analysis", icon: "🔒", summary: "Click to reveal market data", detail: "Top-rated similar games increase difficulty 15-20% per level. Dragon Dash increases only 5% per level, with 0% increase after Level 3." },
];

const HIDDEN_PANEL_IDS = ["difficulty", "competitor"];

const DIAGNOSES = [
  { key: "difficulty_flat", label: "The game stops getting harder after Level 3 — players get bored", score: 1.0 },
  { key: "economy_broken", label: "Players earn too many coins, removing the sense of achievement", score: 0.5 },
  { key: "content_short", label: "There aren't enough levels to keep players engaged", score: 0.4 },
  { key: "onboarding_bad", label: "New players aren't learning the mechanics properly", score: 0.2 },
];

const MODIFICATIONS = [
  { key: "difficulty_curve", label: "Fix the difficulty curve — make each level progressively harder" },
  { key: "new_mechanic", label: "Add a new mechanic (power-ups) to add variety" },
  { key: "coin_rewards", label: "Restructure the coin economy to create goals" },
];

export default function DiagnoseDesign({ onComplete }: Props) {
  const [diagnosis, setDiagnosis] = useState<string | null>(null);
  const [modification, setModification] = useState<string | null>(null);

  const tracker = useInspectionTracker(6);
  const timer = useStageTimer();

  const canSubmit = diagnosis !== null && modification !== null;

  const handleSubmit = useCallback(() => {
    if (!canSubmit || !diagnosis || !modification) return;

    const inspected = tracker.panelsInspected();
    const diagnosisScore = DIAGNOSES.find((d) => d.key === diagnosis)?.score ?? 0.5;

    let hiddenChecked = 0;
    HIDDEN_PANEL_IDS.forEach(() => {
      hiddenChecked++;
    });
    const actualHiddenChecked = HIDDEN_PANEL_IDS.filter((id) => {
      const ratio = tracker.inspectionRatio();
      return ratio > 0 && inspected >= HIDDEN_PANEL_IDS.length;
    }).length;
    const hiddenRatio = inspected >= 4 ? Math.min(1, (inspected - 4) / 2 + 0.5) : inspected / 6;

    const answer = buildAnswer(
      "game-studio-s1-diagnose",
      diagnosis,
      "STR",
      "WM",
      [
        { param: "STR", metric: "data_thoroughness", value: inspected / 6, weight: 1.0 },
        { param: "WM", metric: "evidence_integration", value: diagnosisScore, weight: 0.7 },
        { param: "STR", metric: "hidden_data_sought", value: hiddenRatio, weight: 0.5 },
      ],
      {
        panelsInspected: inspected,
        elapsedMs: timer.elapsed(),
      }
    );

    onComplete(answer, diagnosis, modification);
  }, [canSubmit, diagnosis, modification, tracker, timer, onComplete]);

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-1">
        <h2 className="text-xl font-bold text-gray-800">Stage 1: Diagnose the Problem</h2>
        <p className="text-sm text-gray-500">
          Dragon Dash dropped from 4.5 to 2.8 stars. Review the analytics to find out why.
        </p>
      </div>

      <div className="bg-red-50 border border-red-200 rounded-xl p-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🐉</span>
          <div>
            <h3 className="font-bold text-red-800">Dragon Dash — Rating Crisis</h3>
            <p className="text-sm text-red-700">Rating dropped from ★★★★½ to ★★¾. Players leave after Level 3.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {ANALYTICS_PANELS.map((p) => (
          <InfoPanel key={p.id} id={p.id} title={p.title} icon={p.icon} summary={p.summary} detail={p.detail} onToggle={tracker.toggle} />
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-3">
        <h3 className="font-semibold text-gray-800 text-sm">What is the main problem?</h3>
        <div className="space-y-2">
          {DIAGNOSES.map((d) => (
            <label key={d.key} className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${diagnosis === d.key ? "border-indigo-400 bg-indigo-50" : "border-gray-200 hover:border-gray-300"}`}>
              <input type="radio" name="diagnosis" checked={diagnosis === d.key} onChange={() => setDiagnosis(d.key)} className="mt-0.5 accent-indigo-600" />
              <span className="text-sm text-gray-700">{d.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-3">
        <h3 className="font-semibold text-gray-800 text-sm">What change would you make?</h3>
        <div className="space-y-2">
          {MODIFICATIONS.map((m) => (
            <label key={m.key} className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${modification === m.key ? "border-indigo-400 bg-indigo-50" : "border-gray-200 hover:border-gray-300"}`}>
              <input type="radio" name="modification" checked={modification === m.key} onChange={() => setModification(m.key)} className="mt-0.5 accent-indigo-600" />
              <span className="text-sm text-gray-700">{m.label}</span>
            </label>
          ))}
        </div>
      </div>

      <button onClick={handleSubmit} disabled={!canSubmit} className={`w-full py-3 rounded-xl font-semibold text-white transition-all duration-200 ${canSubmit ? "bg-indigo-600 hover:bg-indigo-500 shadow-md hover:shadow-lg cursor-pointer active:scale-[0.98]" : "bg-gray-300 cursor-not-allowed"}`}>
        {canSubmit ? "Submit Diagnosis & Fix" : "Select a diagnosis and modification"}
      </button>
    </div>
  );
}
