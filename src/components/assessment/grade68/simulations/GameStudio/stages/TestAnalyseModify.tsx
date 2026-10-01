"use client";

import { useState, useCallback, useMemo } from "react";
import { buildAnswer, type QuestionAnswer } from "../../../types";
import { useStageTimer } from "../../../shared/useStageTimer";

interface Props {
  modification: string;
  onComplete: (answer: QuestionAnswer) => void;
}

function getTestResults(mod: string): string {
  if (mod === "difficulty_curve")
    return "Results are promising! Player retention at Level 4 improved from 31% to 58%. But some players report 'difficulty spikes' — Level 5 jumps too sharply. Session times are up 40%.";
  if (mod === "new_mechanic")
    return "Mixed results. Power-ups are popular — 80% of players use them. But retention only improved to 38% at Level 4. Players seem entertained briefly but still leave.";
  return "Disappointing. New coin structure made levels feel 'grindy'. Level 4 retention dropped to 25%. Some positive feedback on the new shop items though.";
}

function getIterationFeedback(choice: string): string {
  if (choice === "fine_tune")
    return "After adjustments, retention hits 62% at Level 4. Players report a smoother difficulty curve.";
  if (choice === "revert_partial")
    return "You pulled back the extreme changes. Retention at 52% — better than before but room to improve.";
  if (choice === "add_tutorial")
    return "Tutorials helped some players, but the core engagement issue persists. Retention at 45%.";
  return "A week later, metrics haven't improved further. Some players specifically mention wanting 'more polish'.";
}

const ITERATION_SCORES: Record<string, number> = {
  fine_tune: 0.9,
  revert_partial: 0.7,
  add_tutorial: 0.5,
  keep_as_is: 0.2,
};

const ITERATION_OPTIONS = [
  { key: "fine_tune", label: "Fine-tune the current approach — adjust the numbers slightly" },
  { key: "revert_partial", label: "Revert part of the change and try a different angle" },
  { key: "add_tutorial", label: "Add a tutorial/hint system to help struggling players" },
  { key: "keep_as_is", label: "The results look good enough — ship it" },
];

export default function TestAnalyseModify({ modification, onComplete }: Props) {
  const testResults = useMemo(() => getTestResults(modification), [modification]);

  const [iter1Choice, setIter1Choice] = useState<string | null>(null);
  const [iter1Submitted, setIter1Submitted] = useState(false);
  const [iter2Shown, setIter2Shown] = useState(false);
  const [iter2Choice, setIter2Choice] = useState<string | null>(null);
  const [iter2Submitted, setIter2Submitted] = useState(false);

  const timer = useStageTimer();

  const iter1Feedback = iter1Choice ? getIterationFeedback(iter1Choice) : "";
  const iter2Options = ITERATION_OPTIONS.filter((o) => o.key !== iter1Choice);

  const handleIter1Submit = useCallback(() => {
    if (!iter1Choice) return;
    setIter1Submitted(true);
  }, [iter1Choice]);

  const handleIter2Submit = useCallback(() => {
    if (!iter2Choice) return;
    setIter2Submitted(true);
  }, [iter2Choice]);

  const handleFinish = useCallback(() => {
    const didBoth = iter2Submitted;
    const mainScore = ITERATION_SCORES[iter1Choice!] ?? 0.5;

    const answer = buildAnswer(
      "game-studio-s2-iterate",
      iter1Choice!,
      "FB",
      "PAC",
      [
        { param: "FB", metric: "iteration_quality", value: mainScore, weight: 1.0 },
        { param: "PAC", metric: "iteration_count", value: didBoth ? 1.0 : 0.5, weight: 0.8 },
        { param: "WM", metric: "data_reference", value: Math.min(1, timer.elapsed() / 45000), weight: 0.5 },
      ],
      {
        didBothIterations: didBoth ? 1 : 0,
        elapsedMs: timer.elapsed(),
      }
    );

    onComplete(answer);
  }, [iter1Choice, iter2Choice, iter2Submitted, timer, onComplete]);

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-1">
        <h2 className="text-xl font-bold text-gray-800">Stage 2: Test &amp; Iterate</h2>
        <p className="text-sm text-gray-500">Your changes are being tested. Review the results and decide what to do next.</p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 space-y-2">
        <h3 className="font-bold text-blue-800">📊 Test Results</h3>
        <p className="text-sm text-blue-700 leading-relaxed">{testResults}</p>
      </div>

      {/* Iteration 1 */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-3">
        <h3 className="font-semibold text-gray-800 text-sm">Iteration 1: What&apos;s your next move?</h3>
        <div className="space-y-2">
          {ITERATION_OPTIONS.map((o) => (
            <label key={o.key} className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${iter1Choice === o.key ? "border-indigo-400 bg-indigo-50" : "border-gray-200 hover:border-gray-300"} ${iter1Submitted ? "pointer-events-none opacity-70" : ""}`}>
              <input type="radio" name="iter1" checked={iter1Choice === o.key} onChange={() => setIter1Choice(o.key)} disabled={iter1Submitted} className="mt-0.5 accent-indigo-600" />
              <span className="text-sm text-gray-700">{o.label}</span>
            </label>
          ))}
        </div>
        {!iter1Submitted && (
          <button onClick={handleIter1Submit} disabled={!iter1Choice} className={`w-full py-2 rounded-lg font-medium text-sm transition-all ${iter1Choice ? "bg-indigo-600 text-white hover:bg-indigo-500 cursor-pointer" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}>
            Apply Change
          </button>
        )}
      </div>

      {/* Iteration 1 feedback */}
      {iter1Submitted && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 space-y-2">
          <h3 className="font-bold text-green-800">📈 Updated Results</h3>
          <p className="text-sm text-green-700 leading-relaxed">{iter1Feedback}</p>
        </div>
      )}

      {/* Iteration 2 prompt */}
      {iter1Submitted && !iter2Shown && (
        <div className="flex justify-center">
          <button
            onClick={() => setIter2Shown(true)}
            className="px-6 py-2.5 bg-amber-100 text-amber-800 font-medium rounded-lg border border-amber-300 hover:bg-amber-200 transition-all cursor-pointer"
          >
            ✨ Make one more adjustment?
          </button>
        </div>
      )}

      {/* Iteration 2 */}
      {iter2Shown && !iter2Submitted && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-3">
          <h3 className="font-semibold text-gray-800 text-sm">Iteration 2: One more tweak?</h3>
          <div className="space-y-2">
            {iter2Options.map((o) => (
              <label key={o.key} className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${iter2Choice === o.key ? "border-indigo-400 bg-indigo-50" : "border-gray-200 hover:border-gray-300"}`}>
                <input type="radio" name="iter2" checked={iter2Choice === o.key} onChange={() => setIter2Choice(o.key)} className="mt-0.5 accent-indigo-600" />
                <span className="text-sm text-gray-700">{o.label}</span>
              </label>
            ))}
          </div>
          <button onClick={handleIter2Submit} disabled={!iter2Choice} className={`w-full py-2 rounded-lg font-medium text-sm transition-all ${iter2Choice ? "bg-indigo-600 text-white hover:bg-indigo-500 cursor-pointer" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}>
            Apply Final Change
          </button>
        </div>
      )}

      {iter2Submitted && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <p className="text-sm text-green-700">{getIterationFeedback(iter2Choice!)}</p>
        </div>
      )}

      {/* Finish */}
      {iter1Submitted && (iter2Submitted || !iter2Shown) && (
        <button onClick={handleFinish} className="w-full py-3 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md hover:shadow-lg transition-all cursor-pointer active:scale-[0.98]">
          {iter2Shown ? "Finalize & Continue" : "Continue Without Further Changes"}
        </button>
      )}
    </div>
  );
}
