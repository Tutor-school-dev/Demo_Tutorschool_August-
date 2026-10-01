"use client";

import { useState, useCallback } from "react";
import { buildAnswer, type QuestionAnswer } from "../../../types";
import { useStageTimer } from "../../../shared/useStageTimer";

interface Props {
  onComplete: (answer: QuestionAnswer) => void;
}

const BUDGET_OPTIONS = [
  { key: "scale_down", label: "Scale down the original proposal to fit ₹30,000", score: 0.7 },
  { key: "switch_proposal", label: "Switch to a different, cheaper proposal", score: 0.5 },
  { key: "combine", label: "Combine elements from multiple proposals within the new budget", score: 1.0 },
  { key: "protest", label: "Petition the board to restore the full amount", score: 0.3 },
];

const TRANSFER_OPTIONS = [
  { key: "gather_data", label: "Look at what the most students actually need, not what's loudest", score: 0.6 },
  { key: "plan_for_change", label: "Be ready to change your plan when new facts come up", score: 1.0 },
  { key: "choose_lasting", label: "Pick the option that lasts longest and benefits the most people", score: 0.5 },
  { key: "ask_everyone", label: "Make sure to ask every student what they want before deciding", score: 0.3 },
];

export default function EscalationTransfer({ onComplete }: Props) {
  const [budgetChoice, setBudgetChoice] = useState<string | null>(null);
  const [transferChoice, setTransferChoice] = useState<string | null>(null);

  const timer = useStageTimer();

  const canSubmit = budgetChoice !== null && transferChoice !== null;

  const handleSubmit = useCallback(() => {
    if (!canSubmit || !budgetChoice || !transferChoice) return;

    const budgetScore = BUDGET_OPTIONS.find((o) => o.key === budgetChoice)?.score ?? 0.5;
    const transferScore = TRANSFER_OPTIONS.find((o) => o.key === transferChoice)?.score ?? 0.5;
    const elapsedMs = timer.elapsed();

    const answer = buildAnswer(
      "decision-s3-escalation",
      `${budgetChoice}|${transferChoice}`,
      "PAC",
      "ABS",
      [
        { param: "PAC", metric: "budget_resilience", value: budgetScore, weight: 1.0 },
        { param: "ABS", metric: "wisdom_transfer", value: transferScore, weight: 1.0 },
        { param: "ATT", metric: "final_engagement", value: Math.min(1, elapsedMs / 30000), weight: 0.4 },
      ],
      {
        elapsedMs,
      }
    );

    onComplete(answer);
  }, [canSubmit, budgetChoice, transferChoice, timer, onComplete]);

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-1">
        <h2 className="text-xl font-bold text-gray-800">Stage 3: Escalation &amp; Transfer</h2>
        <p className="text-sm text-gray-500">The budget changed, and someone needs your advice.</p>
      </div>

      {/* Part A: Budget cut */}
      <div className="bg-red-50 border border-red-200 rounded-xl p-4 space-y-2">
        <h3 className="font-bold text-red-800">💸 Budget Cut</h3>
        <p className="text-sm text-red-700 leading-relaxed">
          Breaking news: The school board reduced the donation to <strong>₹30,000</strong> due to emergency
          building repairs. How do you adapt your plan?
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-3">
        <h3 className="font-semibold text-gray-800 text-sm">Part A: How will you handle the budget cut?</h3>
        <div className="space-y-2">
          {BUDGET_OPTIONS.map((o) => (
            <label key={o.key} className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${budgetChoice === o.key ? "border-indigo-400 bg-indigo-50" : "border-gray-200 hover:border-gray-300"}`}>
              <input type="radio" name="budget" checked={budgetChoice === o.key} onChange={() => setBudgetChoice(o.key)} className="mt-0.5 accent-indigo-600" />
              <span className="text-sm text-gray-700">{o.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Part B: Transfer */}
      <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 space-y-2">
        <h3 className="font-bold text-indigo-800">💡 Your Sibling Needs Advice</h3>
        <p className="text-sm text-indigo-700 leading-relaxed">
          Your younger sibling is on their college&apos;s student committee. They received a ₹2,00,000 donation
          and must choose between a new library, upgraded labs, a student lounge, or a sports complex.
          They ask: <em>&quot;What&apos;s the most important lesson from your experience?&quot;</em>
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-3">
        <h3 className="font-semibold text-gray-800 text-sm">Part B: What advice would you give?</h3>
        <div className="space-y-2">
          {TRANSFER_OPTIONS.map((o) => (
            <label key={o.key} className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${transferChoice === o.key ? "border-indigo-400 bg-indigo-50" : "border-gray-200 hover:border-gray-300"}`}>
              <input type="radio" name="transfer" checked={transferChoice === o.key} onChange={() => setTransferChoice(o.key)} className="mt-0.5 accent-indigo-600" />
              <span className="text-sm text-gray-700">{o.label}</span>
            </label>
          ))}
        </div>
      </div>

      <button onClick={handleSubmit} disabled={!canSubmit} className={`w-full py-3 rounded-xl font-semibold text-white transition-all duration-200 ${canSubmit ? "bg-indigo-600 hover:bg-indigo-500 shadow-md hover:shadow-lg cursor-pointer active:scale-[0.98]" : "bg-gray-300 cursor-not-allowed"}`}>
        {canSubmit ? "Submit Final Answers" : "Complete both parts to continue"}
      </button>
    </div>
  );
}
