"use client";

import { useState, useMemo, useCallback } from "react";
import { QuestionAnswer } from "@/lib/questionBankScoring";
import { SortingConfig } from "../themes";

interface RuleSortingGameProps {
  config: SortingConfig;
  themeId: string;
  onComplete: (answer: QuestionAnswer) => void;
}

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function RuleSortingGame({
  config,
  themeId,
  onComplete,
}: RuleSortingGameProps) {
  // Build a queue of 12 items: two shuffled passes through all items
  const [itemQueue] = useState(() => [
    ...shuffleArray(config.items),
    ...shuffleArray(config.items),
  ]);

  // Rule mapping: first 3 items' rule -> category 0, last 3 -> category 1
  const ruleMap = useMemo(() => {
    const map: Record<string, number> = {};
    map[config.items[0].rule] = 0;
    map[config.items[config.items.length - 1].rule] = 1;
    return map;
  }, [config.items]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [switched, setSwitched] = useState(false);
  const [consecutiveCorrect, setConsecutiveCorrect] = useState(0);
  const [phase1Errors, setPhase1Errors] = useState(0);
  const [phase2Errors, setPhase2Errors] = useState(0);
  const [phase2Trials, setPhase2Trials] = useState(0);
  const [phase2ConsecutiveCorrect, setPhase2ConsecutiveCorrect] = useState(0);
  const [adapted, setAdapted] = useState(false);
  const [trialsToAdapt, setTrialsToAdapt] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const currentItem =
    currentIndex < itemQueue.length ? itemQueue[currentIndex] : null;
  const totalErrors = phase1Errors + phase2Errors;

  const getCorrectBin = useCallback(
    (item: { rule: string }, isSwitched: boolean) => {
      const normalBin = ruleMap[item.rule] ?? 1;
      return isSwitched ? 1 - normalBin : normalBin;
    },
    [ruleMap]
  );

  const handleBinClick = useCallback(
    (binIndex: number) => {
      if (feedback !== null || !currentItem || gameOver) return;

      const correctBin = getCorrectBin(currentItem, switched);
      const isCorrect = binIndex === correctBin;

      // Compute next values from current render state
      const newConsecutive = isCorrect ? consecutiveCorrect + 1 : 0;
      let willSwitch = false;
      if (!switched && isCorrect && newConsecutive >= 5) {
        willSwitch = true;
      }

      let newPhase1Errors = phase1Errors;
      let newPhase2Errors = phase2Errors;
      let newPhase2Trials = phase2Trials;
      let newPhase2Consecutive = phase2ConsecutiveCorrect;
      let newAdapted = adapted;
      let newTrialsToAdapt = trialsToAdapt;

      if (switched) {
        newPhase2Trials = phase2Trials + 1;
        if (isCorrect) {
          newPhase2Consecutive = phase2ConsecutiveCorrect + 1;
          if (!adapted && newPhase2Consecutive >= 3) {
            newAdapted = true;
            newTrialsToAdapt = newPhase2Trials;
          }
        } else {
          newPhase2Errors = phase2Errors + 1;
          newPhase2Consecutive = 0;
        }
      } else {
        if (!isCorrect) {
          newPhase1Errors = phase1Errors + 1;
        }
      }

      // Apply state updates
      setConsecutiveCorrect(newConsecutive);
      setPhase1Errors(newPhase1Errors);
      setPhase2Errors(newPhase2Errors);
      setPhase2Trials(newPhase2Trials);
      setPhase2ConsecutiveCorrect(newPhase2Consecutive);
      setAdapted(newAdapted);
      setTrialsToAdapt(newTrialsToAdapt);
      if (willSwitch) setSwitched(true);
      setFeedback(isCorrect ? "correct" : "wrong");

      setTimeout(() => {
        setFeedback(null);
        const nextIndex = currentIndex + 1;
        if (nextIndex >= 12 || nextIndex >= itemQueue.length) {
          setGameOver(true);
          setShowResults(true);
        } else {
          setCurrentIndex(nextIndex);
        }
      }, 500);
    },
    [
      feedback,
      currentItem,
      gameOver,
      getCorrectBin,
      switched,
      consecutiveCorrect,
      phase1Errors,
      phase2Errors,
      phase2Trials,
      phase2ConsecutiveCorrect,
      adapted,
      trialsToAdapt,
      currentIndex,
      itemQueue.length,
    ]
  );

  const computeResult = useCallback((): QuestionAnswer => {
    const totalTrials = currentIndex + 1;
    const totalErrors = phase1Errors + phase2Errors;

    const adaptSpeed = switched && adapted && trialsToAdapt !== null
      ? Math.max(0, Math.min(1, 1 - (trialsToAdapt - 1) / 9))
      : 0.1;
    const phase2Acc = switched && phase2Trials > 0
      ? 1 - phase2Errors / phase2Trials
      : 0.3;
    const overallAcc = totalTrials > 0 ? 1 - totalErrors / totalTrials : 0.5;

    let primarySignal: string;
    if (switched && adapted && trialsToAdapt !== null) {
      primarySignal = trialsToAdapt <= 3 ? "high" : trialsToAdapt <= 6 ? "moderate" : "low";
    } else {
      primarySignal = "low";
    }
    const secondarySignal = totalErrors <= 3 ? "high" : totalErrors <= 6 ? "moderate" : "low";

    return {
      questionId: `${themeId}-sorting`,
      selectedKey: adapted ? "adapted" : "not-adapted",
      primaryParam: "FB",
      secondaryParam: "ABS",
      primarySignal,
      secondarySignal,
      indicators: [
        { param: "FB", metric: "adaptSpeed", value: adaptSpeed, weight: 1.0 },
        { param: "FB", metric: "phase2Accuracy", value: phase2Acc, weight: 0.7 },
        { param: "ABS", metric: "overallAccuracy", value: overallAcc, weight: 0.5 },
      ],
      rawMetrics: { totalTrials, phase1Errors, phase2Errors, switched: switched ? 1 : 0, adapted: adapted ? 1 : 0, trialsToAdapt: trialsToAdapt ?? -1 },
    };
  }, [
    currentIndex,
    phase1Errors,
    phase2Errors,
    phase2Trials,
    switched,
    adapted,
    trialsToAdapt,
    themeId,
  ]);

  const handleContinue = useCallback(() => {
    onComplete(computeResult());
  }, [onComplete, computeResult]);

  // --- Results screen ---
  if (showResults) {
    const result = computeResult();
    return (
      <div className="min-h-[480px] bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 flex flex-col items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center space-y-5">
          <h2 className="text-2xl font-bold text-emerald-800">
            {config.stageName} Complete
          </h2>

          <div className="space-y-3 text-left">
            <div className="flex justify-between px-4 py-2 bg-emerald-50 rounded-lg">
              <span className="text-gray-600">Total trials</span>
              <span className="font-semibold text-emerald-700">
                {currentIndex + 1}
              </span>
            </div>
            <div className="flex justify-between px-4 py-2 bg-emerald-50 rounded-lg">
              <span className="text-gray-600">Phase 1 errors</span>
              <span className="font-semibold text-emerald-700">
                {phase1Errors}
              </span>
            </div>
            <div className="flex justify-between px-4 py-2 bg-emerald-50 rounded-lg">
              <span className="text-gray-600">Rule switch</span>
              <span className="font-semibold text-emerald-700">
                {switched ? "Yes" : "No"}
              </span>
            </div>
            {switched && (
              <>
                <div className="flex justify-between px-4 py-2 bg-emerald-50 rounded-lg">
                  <span className="text-gray-600">Phase 2 errors</span>
                  <span className="font-semibold text-emerald-700">
                    {phase2Errors}
                  </span>
                </div>
                <div className="flex justify-between px-4 py-2 bg-emerald-50 rounded-lg">
                  <span className="text-gray-600">Adapted</span>
                  <span className="font-semibold text-emerald-700">
                    {adapted
                      ? `Yes (in ${trialsToAdapt} trials)`
                      : "Not yet"}
                  </span>
                </div>
              </>
            )}
          </div>

          <div className="flex gap-3 justify-center pt-2">
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                result.primarySignal === "high"
                  ? "bg-emerald-100 text-emerald-700"
                  : result.primarySignal === "moderate"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              Flexibility: {result.primarySignal}
            </span>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                result.secondarySignal === "high"
                  ? "bg-emerald-100 text-emerald-700"
                  : result.secondarySignal === "moderate"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              Accuracy: {result.secondarySignal}
            </span>
          </div>

          <button
            onClick={handleContinue}
            className="mt-4 w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all shadow-md"
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  // --- Game screen ---
  return (
    <div className="min-h-[480px] bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 flex flex-col">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-emerald-800">
          {config.stageName}
        </h2>
        <p className="text-gray-600 mt-1">{config.instruction}</p>
      </div>

      {/* Progress */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-500 mb-1">
          <span>
            Item {currentIndex + 1} of {Math.min(12, itemQueue.length)}
          </span>
          <span>
            Errors: {totalErrors}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-emerald-400 to-teal-400 h-2 rounded-full transition-all duration-300"
            style={{
              width: `${((currentIndex + 1) / Math.min(12, itemQueue.length)) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Current item */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="relative">
          <div className="bg-white rounded-2xl shadow-xl w-32 h-32 flex items-center justify-center mb-8">
            <span className="text-6xl">{currentItem?.emoji}</span>

            {/* Feedback overlay */}
            {feedback && (
              <div
                className={`absolute inset-0 rounded-2xl flex items-center justify-center text-5xl ${
                  feedback === "correct"
                    ? "bg-emerald-100/80"
                    : "bg-red-100/80"
                }`}
              >
                {feedback === "correct" ? (
                  <span className="text-emerald-500">&#10003;</span>
                ) : (
                  <span className="text-red-500">&#10007;</span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Category bins */}
        <div className="grid grid-cols-2 gap-4 w-full max-w-lg">
          {config.categories.map((category, index) => (
            <button
              key={category}
              onClick={() => handleBinClick(index)}
              disabled={feedback !== null || gameOver}
              className={`py-6 px-4 rounded-2xl shadow-lg text-center transition-all ${
                feedback !== null || gameOver
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white hover:bg-emerald-50 hover:shadow-xl hover:-translate-y-1 active:translate-y-0 cursor-pointer border-2 border-transparent hover:border-emerald-300"
              }`}
            >
              <span className="text-lg font-semibold text-emerald-700">
                {category}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Phase indicator (subtle) */}
      {switched && (
        <div className="text-center mt-4">
          <span className="text-xs text-teal-400 font-medium">
            Something changed...
          </span>
        </div>
      )}
    </div>
  );
}
