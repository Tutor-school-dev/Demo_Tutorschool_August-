"use client";

import { useState, useCallback } from "react";
import { buildAnswer, type QuestionAnswer } from "../../../types";
import ConfidenceSlider from "../../../shared/ConfidenceSlider";
import InfoPanel from "../../../shared/InfoPanel";
import { useInspectionTracker } from "../../../shared/useInspectionTracker";
import { useStageTimer } from "../../../shared/useStageTimer";

interface Props {
  onComplete: (answer: QuestionAnswer, proposal: string) => void;
}

const PROPOSALS = [
  { id: "computers", title: "Computer Lab", icon: "💻", summary: "20 new computers for the school", detail: "Proposed by the science department. Would replace 8-year-old machines. Benefits all 800 students for assignments, coding classes, and research. Ongoing cost: ₹5,000/year for maintenance and internet." },
  { id: "garden", title: "School Garden", icon: "🌱", summary: "Outdoor learning garden", detail: "Proposed by the environment club (15 members). Creates a 500 sq ft garden for biology practicals, growing vegetables for the canteen, and a meditation space. Setup cost covers seeds, soil, tools, and a small greenhouse." },
  { id: "science_camp", title: "Science Camp", icon: "🔬", summary: "5-day residential science camp", detail: "Proposed by the 8th grade coordinator. Sends 40 top science students to a national lab for hands-on experiments. One-time experience. ₹50,000 covers transport, accommodation, and lab fees for 40 students." },
  { id: "sports", title: "Sports Equipment", icon: "⚽", summary: "New sports gear + court repair", detail: "Proposed by the PE department. Basketball court resurfacing (₹25,000), new equipment sets for 5 sports (₹15,000), and uniforms for inter-school teams (₹10,000). Benefits 200+ students in sports programs." },
];

const REASONING_TYPES = [
  { key: "data_driven", label: "I looked at the numbers — this benefits the most students" },
  { key: "equity_focused", label: "This helps students who have fewer opportunities" },
  { key: "future_impact", label: "This investment will keep paying off for years" },
  { key: "immediate_need", label: "This addresses the most urgent problem right now" },
];

const COHERENCE: Record<string, Record<string, number>> = {
  computers: { data_driven: 1.0, equity_focused: 0.5, future_impact: 0.9, immediate_need: 0.5 },
  garden: { data_driven: 0.5, equity_focused: 0.8, future_impact: 0.9, immediate_need: 0.5 },
  science_camp: { data_driven: 0.5, equity_focused: 0.7, future_impact: 0.5, immediate_need: 0.6 },
  sports: { data_driven: 0.7, equity_focused: 0.5, future_impact: 0.5, immediate_need: 0.9 },
};

export default function InitialAssessment({ onComplete }: Props) {
  const [proposal, setProposal] = useState<string | null>(null);
  const [reasoning, setReasoning] = useState<string | null>(null);
  const [confidence, setConfidence] = useState(3);

  const tracker = useInspectionTracker(4);
  const timer = useStageTimer();

  const canSubmit = proposal !== null && reasoning !== null;

  const handleSubmit = useCallback(() => {
    if (!canSubmit || !proposal || !reasoning) return;

    const coherence = COHERENCE[proposal]?.[reasoning] ?? 0.5;
    const confScore = confidence === 3 ? 1.0 : confidence === 2 || confidence === 4 ? 0.7 : 0.4;

    const answer = buildAnswer(
      "decision-s1-initial",
      proposal,
      "STR",
      "STR",
      [
        { param: "STR", metric: "proposal_inspection", value: tracker.inspectionRatio(), weight: 1.0 },
        { param: "STR", metric: "reasoning_coherence", value: coherence, weight: 0.7 },
        { param: "STR", metric: "confidence_given_incomplete", value: confScore, weight: 0.5 },
      ],
      {
        confidence,
        panelsInspected: tracker.panelsInspected(),
        coherenceScore: coherence,
        elapsedMs: timer.elapsed(),
      }
    );

    onComplete(answer, proposal);
  }, [canSubmit, proposal, reasoning, confidence, tracker, timer, onComplete]);

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-1">
        <h2 className="text-xl font-bold text-gray-800">Stage 1: Choose a Proposal</h2>
        <p className="text-sm text-gray-500">
          Your school received ₹50,000. Review the proposals and make your recommendation.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {PROPOSALS.map((p) => (
          <div key={p.id} className={`relative ${proposal === p.id ? "ring-2 ring-indigo-400 rounded-xl" : ""}`}>
            <div className="absolute top-2 right-2 z-10">
              <input type="radio" name="proposal" checked={proposal === p.id} onChange={() => setProposal(p.id)} className="accent-indigo-600 w-4 h-4 cursor-pointer" />
            </div>
            <div onClick={() => setProposal(p.id)} className="cursor-pointer">
              <InfoPanel id={p.id} title={p.title} icon={p.icon} summary={p.summary} detail={p.detail} onToggle={tracker.toggle} />
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-3">
        <h3 className="font-semibold text-gray-800 text-sm">Why did you choose this proposal?</h3>
        <div className="space-y-2">
          {REASONING_TYPES.map((r) => (
            <label key={r.key} className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${reasoning === r.key ? "border-indigo-400 bg-indigo-50" : "border-gray-200 hover:border-gray-300"}`}>
              <input type="radio" name="reasoning" checked={reasoning === r.key} onChange={() => setReasoning(r.key)} className="mt-0.5 accent-indigo-600" />
              <span className="text-sm text-gray-700">{r.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex flex-col items-center">
        <ConfidenceSlider label="How confident are you in this decision?" onChange={setConfidence} />
      </div>

      <button onClick={handleSubmit} disabled={!canSubmit} className={`w-full py-3 rounded-xl font-semibold text-white transition-all duration-200 ${canSubmit ? "bg-indigo-600 hover:bg-indigo-500 shadow-md hover:shadow-lg cursor-pointer active:scale-[0.98]" : "bg-gray-300 cursor-not-allowed"}`}>
        {canSubmit ? "Submit Recommendation" : "Select a proposal and reasoning"}
      </button>
    </div>
  );
}
