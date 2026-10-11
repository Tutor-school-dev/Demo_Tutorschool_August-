"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { buildAnswer, type QuestionAnswer } from "../../../types";
import ConfidenceSlider from "../../../../grade68/shared/ConfidenceSlider";
import InfoPanel from "../../../../grade68/shared/InfoPanel";
import { useInspectionTracker } from "../../../../grade68/shared/useInspectionTracker";
import { useStageTimer } from "../../../../grade68/shared/useStageTimer";

interface Props {
  onComplete: (answer: QuestionAnswer) => void;
}

const TOTAL_SECONDS = 180;

const EVIDENCE_PANELS = [
  {
    id: "crime",
    title: "Safety Data",
    icon: "🛡️",
    summary: "Recent incidents in the complex",
    detail: "5 theft incidents reported in the last year — 3 in the parking lot, 2 in the lobby. 2 incidents were in areas that would be covered by cameras. 1 incident involved a visitor; 4 involved unknown persons. The complex has 200 families.",
  },
  {
    id: "privacy",
    title: "Privacy Concerns",
    icon: "🔒",
    summary: "Residents are divided",
    detail: "A petition signed by 60 residents (30%) opposes cameras, citing: 'constant surveillance culture,' 'children shouldn't grow up being watched,' and 'data could be misused.' 12 residents specifically mentioned that cameras near playgrounds make them uncomfortable.",
  },
  {
    id: "cost_cctv",
    title: "Cost Comparison",
    icon: "💰",
    summary: "Installation vs. alternatives",
    detail: "CCTV: ₹3,00,000 installation + ₹40,000/year maintenance. Current security guard: ₹2,40,000/year. Adding a second guard: ₹2,40,000/year additional. CCTV + guard combination: ₹3,00,000 + ₹2,80,000/year.",
  },
  {
    id: "research_cctv",
    title: "Effectiveness Research",
    icon: "📑",
    summary: "What the studies say",
    detail: "A meta-analysis of residential CCTV: 13% reduction in property crime, but only 5% reduction in personal crimes. Effect strongest when combined with improved lighting. Key finding: 'Cameras deter planned crimes but not impulsive ones. The perception of safety often exceeds the reality.'",
  },
];

const CCTV_DECISIONS = [
  { key: "full_cameras", label: "Recommend installing cameras in all common areas", absScore: 0.3 },
  { key: "no_cameras", label: "Recommend no cameras — privacy concerns outweigh safety benefits", absScore: 0.3 },
  {
    key: "limited_cameras",
    label: "Recommend cameras only in high-risk areas (parking, lobby), with strict data policies and no playground coverage",
    absScore: 1.0,
  },
  { key: "community_discussion", label: "Recommend a community town hall to discuss before any installation", absScore: 0.6 },
];

export default function TransferUnderPressure({ onComplete }: Props) {
  const [decision, setDecision] = useState<string | null>(null);
  const [confidence, setConfidence] = useState(3);
  const [timeLeft, setTimeLeft] = useState(TOTAL_SECONDS);
  const [submitted, setSubmitted] = useState(false);

  const tracker = useInspectionTracker(4);
  const timer = useStageTimer();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const submittedRef = useRef(false);

  const doSubmit = useCallback(
    (selectedDecision: string | null) => {
      if (submittedRef.current) return;
      submittedRef.current = true;
      setSubmitted(true);

      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }

      const elapsedMs = timer.elapsed();
      const madeSelection = selectedDecision !== null;
      const absScore = madeSelection
        ? (CCTV_DECISIONS.find((d) => d.key === selectedDecision)?.absScore ?? 0.3)
        : 0.1;

      const answer = buildAnswer(
        "g910-decision-s3-transfer",
        selectedDecision ?? "no_selection",
        "PAC",
        "ABS",
        [
          {
            param: "PAC",
            metric: "continued_investigation_under_pressure",
            value: Math.min(1, tracker.panelsInspected() / 4),
            weight: 0.8,
          },
          { param: "PAC", metric: "decision_despite_pressure", value: madeSelection ? 0.8 : 0.2, weight: 0.7 },
          { param: "ABS", metric: "structural_transfer", value: absScore, weight: 1.0 },
          { param: "ATT", metric: "pressure_adjusted_behavior", value: Math.min(1, elapsedMs / 120000), weight: 0.5 },
          { param: "STR", metric: "confidence_under_pressure", value: confidence / 5, weight: 0.3 },
        ],
        {
          panelsInspected: tracker.panelsInspected(),
          confidence,
          elapsedMs,
          timeExpired: elapsedMs >= TOTAL_SECONDS * 1000 ? 1 : 0,
        }
      );

      onComplete(answer);
    },
    [confidence, tracker, timer, onComplete]
  );

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        const next = prev - 1;
        if (next <= 0 && !submittedRef.current) {
          doSubmit(decision);
          return 0;
        }
        return Math.max(0, next);
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [decision, doSubmit]);

  const handleSubmit = useCallback(() => {
    doSubmit(decision);
  }, [decision, doSubmit]);

  const timerPercent = (timeLeft / TOTAL_SECONDS) * 100;
  const timerColor = timeLeft > 60 ? "bg-green-500" : timeLeft > 30 ? "bg-amber-500" : "bg-red-500";
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  if (submitted) {
    return (
      <div className="w-full max-w-2xl mx-auto flex items-center justify-center min-h-[300px]">
        <p className="text-gray-500 text-sm">Submitting your response...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-1">
        <h2 className="text-xl font-bold text-gray-800">Stage 3: New Problem, Limited Time</h2>
        <p className="text-sm text-gray-500">
          A different issue needs your thinking. The clock is ticking.
        </p>
      </div>

      {/* Timer bar */}
      <div className="space-y-1">
        <div className="flex justify-between items-center">
          <span className="text-xs font-medium text-gray-500">Time remaining</span>
          <span className={`text-sm font-bold ${timeLeft <= 30 ? "text-red-600" : timeLeft <= 60 ? "text-amber-600" : "text-green-600"}`}>
            {minutes}:{seconds.toString().padStart(2, "0")}
          </span>
        </div>
        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-1000 ${timerColor}`}
            style={{ width: `${timerPercent}%` }}
          />
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-2">
        <h3 className="font-bold text-amber-800">🏠 Neighbourhood Decision</h3>
        <p className="text-sm text-amber-700 leading-relaxed">
          Your Residents&apos; Welfare Association (RWA) is debating whether to install CCTV cameras in common
          areas — lobbies, parking lots, and playgrounds. As the youth representative, they want your input.
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
            onToggle={tracker.toggle}
          />
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-3">
        <h3 className="font-semibold text-gray-800 text-sm">Your recommendation</h3>
        <div className="space-y-2">
          {CCTV_DECISIONS.map((d) => (
            <label
              key={d.key}
              className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                decision === d.key ? "border-indigo-400 bg-indigo-50" : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <input
                type="radio"
                name="cctv_decision"
                checked={decision === d.key}
                onChange={() => setDecision(d.key)}
                className="mt-0.5 accent-indigo-600"
              />
              <span className="text-sm text-gray-700">{d.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex flex-col items-center">
        <ConfidenceSlider label="How confident are you?" onChange={setConfidence} />
      </div>

      <button
        onClick={handleSubmit}
        disabled={decision === null}
        className={`w-full py-3 rounded-xl font-semibold text-white transition-all duration-200 ${
          decision !== null
            ? "bg-indigo-600 hover:bg-indigo-500 shadow-md hover:shadow-lg cursor-pointer active:scale-[0.98]"
            : "bg-gray-300 cursor-not-allowed"
        }`}
      >
        {decision !== null ? "Submit Decision" : "Select a recommendation"}
      </button>
    </div>
  );
}
