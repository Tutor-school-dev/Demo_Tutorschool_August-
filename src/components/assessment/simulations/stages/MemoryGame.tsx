"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { QuestionAnswer, BehavioralIndicator } from "@/lib/questionBankScoring";
import { MemoryConfig } from "../themes";

interface MemoryGameProps {
  config: MemoryConfig;
  themeId: string;
  onComplete: (answer: QuestionAnswer) => void;
}

const ROUNDS = [3, 4, 5, 6]; // Items per round
const SHOW_DURATION_MS = 800;
const FAST_RT_THRESHOLD = 2000;
const SLOW_RT_THRESHOLD = 4000;

export default function MemoryGame({
  config,
  themeId,
  onComplete,
}: MemoryGameProps) {
  const [round, setRound] = useState(0); // 0-indexed (rounds 1-4)
  const [phase, setPhase] = useState<"show" | "recall" | "results">("show");
  const [sequence, setSequence] = useState<string[]>([]);
  const [showIndex, setShowIndex] = useState(-1); // -1 = not started, 0+ = showing item
  const [recallIndex, setRecallIndex] = useState(0);
  const [maxSpan, setMaxSpan] = useState(0);
  const [reactionTimes, setReactionTimes] = useState<number[]>([]);
  const [cellFeedback, setCellFeedback] = useState<Record<string, "correct" | "wrong">>({});
  const [roundFailed, setRoundFailed] = useState(false);
  const [consecutiveFailures, setConsecutiveFailures] = useState(0);
  const [successfulRounds, setSuccessfulRounds] = useState(0);

  const lastTapTimeRef = useRef<number>(0);
  const gameOverRef = useRef(false);

  // Generate a new sequence for the current round
  const generateSequence = useCallback(
    (count: number) => {
      const available = [...config.items];
      const seq: string[] = [];
      for (let i = 0; i < count; i++) {
        const idx = Math.floor(Math.random() * available.length);
        seq.push(available[idx]);
        // Allow repeats if we run out, but try to avoid adjacent duplicates
        if (available.length > count) {
          available.splice(idx, 1);
        }
      }
      return seq;
    },
    [config.items]
  );

  // Initialize first round
  useEffect(() => {
    const seq = generateSequence(ROUNDS[0]);
    setSequence(seq);
    setShowIndex(0);
  }, [generateSequence]);

  // Show items one at a time
  useEffect(() => {
    if (phase !== "show" || showIndex < 0) return;

    if (showIndex >= sequence.length) {
      // Done showing, switch to recall
      const timer = setTimeout(() => {
        setPhase("recall");
        setRecallIndex(0);
        lastTapTimeRef.current = Date.now();
      }, 400);
      return () => clearTimeout(timer);
    }

    const timer = setTimeout(() => {
      setShowIndex((i) => i + 1);
    }, SHOW_DURATION_MS);

    return () => clearTimeout(timer);
  }, [phase, showIndex, sequence.length]);

  // Handle item tap during recall
  const handleItemTap = useCallback(
    (emoji: string) => {
      if (phase !== "recall" || roundFailed || gameOverRef.current) return;

      const now = Date.now();
      const rt = now - lastTapTimeRef.current;
      lastTapTimeRef.current = now;

      if (emoji === sequence[recallIndex]) {
        // Correct tap
        setReactionTimes((prev) => [...prev, rt]);
        setCellFeedback((f) => ({ ...f, [emoji]: "correct" }));

        setTimeout(() => {
          setCellFeedback((f) => {
            const updated = { ...f };
            delete updated[emoji];
            return updated;
          });
        }, 400);

        const nextRecallIndex = recallIndex + 1;

        if (nextRecallIndex >= sequence.length) {
          // Round complete - update max span
          const newSpan = ROUNDS[round];
          setMaxSpan((prev) => Math.max(prev, newSpan));
          setSuccessfulRounds((s) => s + 1);
          setConsecutiveFailures(0);

          if (round >= ROUNDS.length - 1) {
            // All rounds done
            setTimeout(() => {
              gameOverRef.current = true;
              setPhase("results");
            }, 600);
          } else {
            // Next round
            setTimeout(() => {
              const nextRound = round + 1;
              setRound(nextRound);
              const seq = generateSequence(ROUNDS[nextRound]);
              setSequence(seq);
              setShowIndex(0);
              setRecallIndex(0);
              setPhase("show");
              setRoundFailed(false);
            }, 800);
          }
        } else {
          setRecallIndex(nextRecallIndex);
        }
      } else {
        // Wrong tap
        setCellFeedback((f) => ({ ...f, [emoji]: "wrong" }));
        setRoundFailed(true);

        const failures = consecutiveFailures + 1;
        setConsecutiveFailures(failures);

        setTimeout(() => {
          setCellFeedback({});

          // End game early if failed on rounds 1 or 2 (consecutive early failures)
          if (round <= 1 && failures >= 2) {
            gameOverRef.current = true;
            setPhase("results");
            return;
          }

          if (round >= ROUNDS.length - 1) {
            // Was last round anyway
            gameOverRef.current = true;
            setPhase("results");
          } else {
            // Advance to next round despite failure
            const nextRound = round + 1;
            setRound(nextRound);
            const seq = generateSequence(ROUNDS[nextRound]);
            setSequence(seq);
            setShowIndex(0);
            setRecallIndex(0);
            setPhase("show");
            setRoundFailed(false);
          }
        }, 800);
      }
    },
    [
      phase,
      roundFailed,
      sequence,
      recallIndex,
      round,
      consecutiveFailures,
      generateSequence,
    ]
  );

  // Calculate and submit results
  const handleFinish = useCallback(() => {
    const spanNorm = Math.min(maxSpan / 6, 1.0);
    const roundCompletion = successfulRounds / ROUNDS.length;
    const avgRt =
      reactionTimes.length > 0
        ? reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length
        : Infinity;
    const recallSpeed = Math.max(0, Math.min(1, 1 - (avgRt - 500) / 4500));

    onComplete({
      questionId: `${themeId}-memory`,
      selectedKey: maxSpan >= 5 ? "high" : maxSpan >= 3 ? "moderate" : "low",
      primaryParam: "WM",
      secondaryParam: "ATT",
      primarySignal: maxSpan >= 5 ? "high" : maxSpan >= 3 ? "moderate" : "low",
      secondarySignal: avgRt < 2000 ? "high" : avgRt < 4000 ? "moderate" : "low",
      indicators: [
        { param: "WM", metric: "spanNorm", value: spanNorm, weight: 1.0 },
        { param: "WM", metric: "roundCompletion", value: roundCompletion, weight: 0.6 },
        { param: "ATT", metric: "recallSpeed", value: recallSpeed, weight: 0.5 },
      ],
      rawMetrics: { maxSpan, roundsCompleted: successfulRounds, avgReactionTimeMs: avgRt === Infinity ? -1 : Math.round(avgRt) },
    });
  }, [themeId, maxSpan, successfulRounds, reactionTimes, onComplete]);

  // Results view
  if (phase === "results") {
    const spanLabel =
      maxSpan >= 5 ? "Excellent" : maxSpan >= 3 ? "Good" : "Keep Practicing";

    return (
      <div className="min-h-[400px] bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 flex flex-col items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-sm w-full text-center space-y-4">
          <div className="text-4xl">
            {maxSpan >= 5 ? "🧠" : maxSpan >= 3 ? "👍" : "💪"}
          </div>
          <h2 className="text-xl font-bold text-gray-800">
            {config.stageName} Complete!
          </h2>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex justify-between px-4">
              <span>Best sequence</span>
              <span className="font-semibold text-emerald-600">
                {maxSpan} items
              </span>
            </div>
            <div className="flex justify-between px-4">
              <span>Rounds completed</span>
              <span className="font-semibold text-emerald-600">
                {successfulRounds} / {ROUNDS.length}
              </span>
            </div>
            <div className="flex justify-between px-4 pt-2 border-t border-gray-100">
              <span>Rating</span>
              <span className="font-bold text-emerald-700">{spanLabel}</span>
            </div>
          </div>
          <button
            onClick={handleFinish}
            className="mt-4 w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all shadow-md hover:shadow-lg active:scale-[0.98]"
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  // Show phase - display items one by one
  if (phase === "show") {
    const currentEmoji =
      showIndex >= 0 && showIndex < sequence.length
        ? sequence[showIndex]
        : null;

    return (
      <div className="min-h-[400px] bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-4 sm:p-6 flex flex-col gap-4">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-800">
                {config.stageName}
              </h2>
              <p className="text-sm text-gray-500">{config.instruction}</p>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-400 uppercase tracking-wider">
                Round
              </div>
              <div className="text-xl font-bold text-emerald-600">
                {round + 1}/{ROUNDS.length}
              </div>
            </div>
          </div>

          {/* Round progress */}
          <div className="flex gap-1.5">
            {ROUNDS.map((_, i) => (
              <div
                key={i}
                className={`flex-1 h-1.5 rounded-full transition-all ${
                  i < round
                    ? "bg-emerald-400"
                    : i === round
                    ? "bg-teal-300"
                    : "bg-gray-200"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Watch area */}
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <p className="text-sm font-semibold text-teal-700 uppercase tracking-wider animate-pulse">
            Watch carefully!
          </p>

          <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-white shadow-xl border-4 border-emerald-200 flex items-center justify-center">
            {currentEmoji ? (
              <span
                key={`${round}-${showIndex}`}
                className="text-5xl sm:text-6xl animate-bounce"
              >
                {currentEmoji}
              </span>
            ) : (
              <span className="text-gray-300 text-2xl">...</span>
            )}
          </div>

          {/* Item counter dots */}
          <div className="flex gap-2">
            {sequence.map((_, i) => (
              <div
                key={i}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  i < showIndex
                    ? "bg-emerald-400"
                    : i === showIndex
                    ? "bg-teal-500 scale-125"
                    : "bg-gray-200"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Recall phase - tap items in order
  const correctSoFar = sequence.slice(0, recallIndex);

  return (
    <div className="min-h-[400px] bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-4 sm:p-6 flex flex-col gap-4">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-xl p-4 space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-800">
              {config.stageName}
            </h2>
            <p className="text-sm text-gray-500">
              Tap the items in the order shown!
            </p>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-400 uppercase tracking-wider">
              Round
            </div>
            <div className="text-xl font-bold text-emerald-600">
              {round + 1}/{ROUNDS.length}
            </div>
          </div>
        </div>

        {/* Round progress */}
        <div className="flex gap-1.5">
          {ROUNDS.map((_, i) => (
            <div
              key={i}
              className={`flex-1 h-1.5 rounded-full transition-all ${
                i < round
                  ? "bg-emerald-400"
                  : i === round
                  ? "bg-teal-300"
                  : "bg-gray-200"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Recall progress indicator */}
      <div className="flex justify-center gap-2">
        {sequence.map((_, i) => (
          <div
            key={i}
            className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-bold transition-all ${
              i < recallIndex
                ? "border-emerald-400 bg-emerald-100 text-emerald-600"
                : i === recallIndex
                ? "border-teal-400 bg-white text-teal-600 shadow-md"
                : "border-gray-200 bg-gray-50 text-gray-300"
            }`}
          >
            {i < recallIndex ? (
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            ) : (
              i + 1
            )}
          </div>
        ))}
      </div>

      {/* Item grid */}
      <div className="flex-1 flex items-center justify-center">
        <div className="grid grid-cols-4 gap-3 sm:gap-4 w-full max-w-[360px]">
          {config.items.map((emoji) => {
            const isAlreadyUsed = correctSoFar.includes(emoji);
            const feedback = cellFeedback[emoji];

            return (
              <button
                key={emoji}
                onClick={() => handleItemTap(emoji)}
                disabled={isAlreadyUsed || roundFailed}
                className={`aspect-square rounded-2xl border-2 flex items-center justify-center text-3xl sm:text-4xl transition-all select-none ${
                  feedback === "correct"
                    ? "border-emerald-400 bg-emerald-100 scale-95"
                    : feedback === "wrong"
                    ? "border-red-400 bg-red-100 scale-95 animate-pulse"
                    : isAlreadyUsed
                    ? "border-emerald-300 bg-emerald-50 opacity-50 cursor-not-allowed"
                    : "border-gray-200 bg-white shadow-md hover:shadow-lg hover:border-teal-300 cursor-pointer active:scale-95"
                }`}
                aria-label={`Select ${emoji}`}
              >
                {emoji}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
