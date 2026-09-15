"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { QuestionAnswer } from "@/lib/questionBankScoring";
import { AttentionConfig } from "../themes";

interface AttentionGameProps {
  config: AttentionConfig;
  themeId: string;
  onComplete: (answer: QuestionAnswer) => void;
}

interface CellState {
  emoji: string;
  isTarget: boolean;
  id: number;
}

const GAME_DURATION = 25;
const GRID_SIZE = 4;
const INITIAL_INTERVAL = 1200;
const MIN_INTERVAL = 700;
const ITEM_DISPLAY_MS = 1000;
const DISTRACTOR_CHANCE = 0.2;

export default function AttentionGame({
  config,
  themeId,
  onComplete,
}: AttentionGameProps) {
  const [phase, setPhase] = useState<"playing" | "results">("playing");
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [grid, setGrid] = useState<(CellState | null)[]>(
    Array(GRID_SIZE * GRID_SIZE).fill(null)
  );
  const [score, setScore] = useState(0);
  const [commissions, setCommissions] = useState(0);
  const [misses, setMisses] = useState(0);
  const [totalShown, setTotalShown] = useState(0);
  const [tapFeedback, setTapFeedback] = useState<Record<number, "correct" | "wrong">>({});

  const itemIdRef = useRef(0);
  const statsRef = useRef({ score: 0, commissions: 0, misses: 0, totalShown: 0 });
  const gameActiveRef = useRef(true);

  // Keep statsRef in sync
  useEffect(() => {
    statsRef.current = { score, commissions, misses, totalShown };
  }, [score, commissions, misses, totalShown]);

  const handleCellTap = useCallback(
    (cellIndex: number) => {
      if (phase !== "playing") return;

      setGrid((prev) => {
        const cell = prev[cellIndex];
        if (!cell) return prev;

        const next = [...prev];
        next[cellIndex] = null;

        if (cell.isTarget) {
          setScore((s) => s + 1);
          setTapFeedback((f) => ({ ...f, [cellIndex]: "correct" }));
        } else {
          setCommissions((c) => c + 1);
          setTapFeedback((f) => ({ ...f, [cellIndex]: "wrong" }));
        }

        setTimeout(() => {
          setTapFeedback((f) => {
            const updated = { ...f };
            delete updated[cellIndex];
            return updated;
          });
        }, 300);

        return next;
      });
    },
    [phase]
  );

  // Countdown timer
  useEffect(() => {
    if (phase !== "playing") return;

    const interval = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(interval);
          gameActiveRef.current = false;
          // Brief delay before showing results
          setTimeout(() => setPhase("results"), 400);
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [phase]);

  // Spawn items on the grid
  useEffect(() => {
    if (phase !== "playing") return;

    let currentInterval = INITIAL_INTERVAL;
    let timeout: ReturnType<typeof setTimeout>;

    const spawnItem = () => {
      if (!gameActiveRef.current) return;

      setGrid((prev) => {
        const emptyCells = prev
          .map((cell, i) => (cell === null ? i : -1))
          .filter((i) => i !== -1);

        if (emptyCells.length === 0) return prev;

        const cellIndex =
          emptyCells[Math.floor(Math.random() * emptyCells.length)];
        const isDistractor = Math.random() < DISTRACTOR_CHANCE;
        const emoji = isDistractor
          ? config.distractor
          : config.targets[
              Math.floor(Math.random() * config.targets.length)
            ];

        const id = ++itemIdRef.current;

        const next = [...prev];
        next[cellIndex] = { emoji, isTarget: !isDistractor, id };

        setTotalShown((t) => t + 1);

        // Auto-remove after display time (counts as miss if target)
        setTimeout(() => {
          if (!gameActiveRef.current) return;
          setGrid((current) => {
            if (current[cellIndex]?.id === id) {
              if (current[cellIndex]?.isTarget) {
                setMisses((m) => m + 1);
              }
              const updated = [...current];
              updated[cellIndex] = null;
              return updated;
            }
            return current;
          });
        }, ITEM_DISPLAY_MS);

        return next;
      });

      // Speed up gradually
      const elapsed = GAME_DURATION - timeLeft;
      const progress = Math.min(elapsed / GAME_DURATION, 1);
      currentInterval =
        INITIAL_INTERVAL - progress * (INITIAL_INTERVAL - MIN_INTERVAL);

      timeout = setTimeout(spawnItem, currentInterval);
    };

    timeout = setTimeout(spawnItem, 600);

    return () => {
      clearTimeout(timeout);
    };
  }, [phase, config.targets, config.distractor, timeLeft]);

  // Calculate final results and call onComplete
  const handleFinish = useCallback(() => {
    const { score: s, commissions: c, totalShown: t } = statsRef.current;
    const accuracy = t > 0 ? s / t : 0;
    const adjustedScore = t > 0 ? (s - c) / t : 0;

    const getSignal = (val: number): "high" | "moderate" | "low" => {
      if (val > 0.8) return "high";
      if (val >= 0.5) return "moderate";
      return "low";
    };

    const accuracyBucket =
      accuracy > 0.8 ? "high" : accuracy >= 0.5 ? "moderate" : "low";

    onComplete({
      questionId: `${themeId}-attention`,
      selectedKey: accuracyBucket,
      primaryParam: "ATT",
      secondaryParam: "WM",
      primarySignal: getSignal(accuracy),
      secondarySignal: getSignal(adjustedScore),
    });
  }, [themeId, onComplete]);

  // Results view
  if (phase === "results") {
    const total = statsRef.current.totalShown;
    const accuracy = total > 0 ? statsRef.current.score / total : 0;
    const accuracyPct = Math.round(accuracy * 100);

    return (
      <div className="min-h-[400px] bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 flex flex-col items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-sm w-full text-center space-y-4">
          <div className="text-4xl">
            {accuracyPct >= 80 ? "🌟" : accuracyPct >= 50 ? "👍" : "💪"}
          </div>
          <h2 className="text-xl font-bold text-gray-800">
            {config.stageName} Complete!
          </h2>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex justify-between px-4">
              <span>Correct taps</span>
              <span className="font-semibold text-emerald-600">
                {statsRef.current.score}
              </span>
            </div>
            <div className="flex justify-between px-4">
              <span>False taps</span>
              <span className="font-semibold text-red-500">
                {statsRef.current.commissions}
              </span>
            </div>
            <div className="flex justify-between px-4">
              <span>Missed</span>
              <span className="font-semibold text-amber-500">
                {statsRef.current.misses}
              </span>
            </div>
            <div className="flex justify-between px-4 pt-2 border-t border-gray-100">
              <span>Accuracy</span>
              <span className="font-bold text-emerald-700">{accuracyPct}%</span>
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

  // Playing view
  const timerPct = (timeLeft / GAME_DURATION) * 100;

  return (
    <div className="min-h-[400px] bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-4 sm:p-6 flex flex-col gap-4">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-800">
              {config.stageName}
            </h2>
            <p className="text-sm text-gray-500">{config.instruction}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-center">
              <div className="text-xs text-gray-400 uppercase tracking-wider">
                Score
              </div>
              <div className="text-xl font-bold text-emerald-600">{score}</div>
            </div>
          </div>
        </div>

        {/* Timer bar */}
        <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-1000 ease-linear ${
              timeLeft > 10
                ? "bg-gradient-to-r from-emerald-400 to-teal-400"
                : timeLeft > 5
                ? "bg-gradient-to-r from-amber-400 to-orange-400"
                : "bg-gradient-to-r from-red-400 to-rose-500"
            }`}
            style={{ width: `${timerPct}%` }}
          />
        </div>
        <div className="text-center text-sm font-medium text-gray-500">
          {timeLeft}s remaining
        </div>
      </div>

      {/* 4x4 Grid */}
      <div className="flex-1 flex items-center justify-center">
        <div className="grid grid-cols-4 gap-2 sm:gap-3 w-full max-w-[340px] aspect-square">
          {grid.map((cell, i) => {
            const feedback = tapFeedback[i];
            return (
              <button
                key={i}
                onClick={() => handleCellTap(i)}
                className={`relative aspect-square rounded-xl border-2 transition-all duration-150 flex items-center justify-center text-3xl sm:text-4xl select-none active:scale-95 ${
                  feedback === "correct"
                    ? "border-emerald-400 bg-emerald-100 scale-95"
                    : feedback === "wrong"
                    ? "border-red-400 bg-red-100 scale-95"
                    : cell
                    ? "border-emerald-300 bg-white shadow-md hover:shadow-lg cursor-pointer"
                    : "border-gray-200 bg-white/60 cursor-default"
                }`}
                disabled={!cell}
                aria-label={cell ? "Tap this item" : "Empty cell"}
              >
                {cell && (
                  <span className="inline-block animate-bounce">
                    {cell.emoji}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
