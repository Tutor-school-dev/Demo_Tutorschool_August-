"use client";

import { useState, useCallback } from "react";
import { QuestionAnswer } from "@/lib/questionBankScoring";
import { PuzzleConfig } from "../themes";

interface PuzzleGameProps {
  config: PuzzleConfig;
  themeId: string;
  onComplete: (answer: QuestionAnswer) => void;
}

type Peg = "green" | "yellow" | "gray";

interface GuessRecord {
  guess: string[];
  feedback: Peg[];
}

function evaluateGuess(guess: string[], secret: string[]): Peg[] {
  const result: Peg[] = new Array(4).fill("gray");
  const secretRemaining: (string | null)[] = [...secret];
  const guessRemaining: (string | null)[] = [...guess];

  // First pass: exact matches
  for (let i = 0; i < 4; i++) {
    if (guess[i] === secret[i]) {
      result[i] = "green";
      secretRemaining[i] = null;
      guessRemaining[i] = null;
    }
  }

  // Second pass: correct color, wrong position
  for (let i = 0; i < 4; i++) {
    if (guessRemaining[i] !== null) {
      const idx = secretRemaining.indexOf(guessRemaining[i]);
      if (idx !== -1) {
        result[i] = "yellow";
        secretRemaining[idx] = null;
      }
    }
  }

  return result;
}

const MAX_ATTEMPTS = 8;
const MAX_HINTS = 2;

export default function PuzzleGame({
  config,
  themeId,
  onComplete,
}: PuzzleGameProps) {
  const [secret] = useState(() =>
    Array.from(
      { length: 4 },
      () => config.colors[Math.floor(Math.random() * config.colors.length)]
    )
  );

  const [currentGuess, setCurrentGuess] = useState<(string | null)[]>([
    null,
    null,
    null,
    null,
  ]);
  const [selectedSlot, setSelectedSlot] = useState(0);
  const [history, setHistory] = useState<GuessRecord[]>([]);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [revealedPositions, setRevealedPositions] = useState<Set<number>>(
    new Set()
  );
  const [solved, setSolved] = useState(false);
  const [skipped, setSkipped] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const attempts = history.length;

  const handleSlotClick = useCallback((index: number) => {
    setSelectedSlot(index);
  }, []);

  const handleColorPick = useCallback(
    (color: string) => {
      if (gameOver) return;
      const nextGuess = [...currentGuess];
      nextGuess[selectedSlot] = color;
      setCurrentGuess(nextGuess);
      // Auto-advance to next empty slot based on the updated guess
      for (let i = 1; i <= 4; i++) {
        const nextIdx = (selectedSlot + i) % 4;
        if (nextGuess[nextIdx] === null) {
          setSelectedSlot(nextIdx);
          return;
        }
      }
    },
    [gameOver, selectedSlot, currentGuess]
  );

  const handleCheck = useCallback(() => {
    if (gameOver) return;
    if (currentGuess.some((c) => c === null)) return;

    const guess = currentGuess as string[];
    const feedback = evaluateGuess(guess, secret);
    const newHistory = [...history, { guess, feedback }];
    setHistory(newHistory);

    const isSolved = feedback.every((p) => p === "green");
    if (isSolved) {
      setSolved(true);
      setGameOver(true);
      setShowResults(true);
    } else if (newHistory.length >= MAX_ATTEMPTS) {
      setGameOver(true);
      setShowResults(true);
    }

    // Preserve hint-revealed positions in the next guess
    setCurrentGuess(() => {
      const next: (string | null)[] = [null, null, null, null];
      revealedPositions.forEach((pos) => {
        next[pos] = secret[pos];
      });
      return next;
    });
    setSelectedSlot(0);
  }, [gameOver, currentGuess, secret, history, revealedPositions]);

  const handleHint = useCallback(() => {
    if (gameOver || hintsUsed >= MAX_HINTS) return;

    // Find unrevealed positions
    const unrevealed: number[] = [];
    for (let i = 0; i < 4; i++) {
      if (!revealedPositions.has(i)) {
        unrevealed.push(i);
      }
    }
    if (unrevealed.length === 0) return;

    const pos = unrevealed[Math.floor(Math.random() * unrevealed.length)];
    setRevealedPositions((prev) => new Set([...prev, pos]));
    setCurrentGuess((prev) => {
      const next = [...prev];
      next[pos] = secret[pos];
      return next;
    });
    setHintsUsed((prev) => prev + 1);
  }, [gameOver, hintsUsed, revealedPositions, secret]);

  const handleSkip = useCallback(() => {
    if (gameOver) return;
    setSkipped(true);
    setGameOver(true);
    setShowResults(true);
  }, [gameOver]);

  const computeResult = useCallback((): QuestionAnswer => {
    const perseverance = solved
      ? (hintsUsed === 0 ? 0.85 : 0.7 + 0.15 * (1 - hintsUsed / MAX_HINTS))
      : (skipped ? 0.1 : 0.4);
    const efficiency = solved
      ? Math.max(0, Math.min(1, 1 - (attempts - 1) / 7))
      : 0.15;

    let primarySignal: string;
    if (solved && hintsUsed === 0) primarySignal = "high";
    else if (solved) primarySignal = "moderate";
    else primarySignal = "low";

    let secondarySignal: string;
    if (solved && attempts <= 4) secondarySignal = "high";
    else if (solved && attempts <= 7) secondarySignal = "moderate";
    else secondarySignal = "low";

    return {
      questionId: `${themeId}-puzzle`,
      selectedKey: solved ? (hintsUsed > 0 ? "solved-with-hints" : "solved") : skipped ? "skipped" : "failed",
      primaryParam: "PAC",
      secondaryParam: "STR",
      primarySignal,
      secondarySignal,
      indicators: [
        { param: "PAC", metric: "perseverance", value: perseverance, weight: 1.0 },
        { param: "STR", metric: "efficiency", value: efficiency, weight: 0.7 },
      ],
      rawMetrics: { attempts, hintsUsed, solved: solved ? 1 : 0, skipped: skipped ? 1 : 0 },
    };
  }, [solved, hintsUsed, attempts, skipped, themeId]);

  const handleContinue = useCallback(() => {
    onComplete(computeResult());
  }, [onComplete, computeResult]);

  const pegEmoji: Record<Peg, string> = {
    green: "🟢",
    yellow: "🟡",
    gray: "⚫",
  };

  // --- Results screen ---
  if (showResults) {
    const result = computeResult();
    return (
      <div className="min-h-[480px] bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 flex flex-col items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center space-y-5">
          <h2 className="text-2xl font-bold text-emerald-800">
            {config.stageName} Complete
          </h2>

          {/* Reveal the secret */}
          <div>
            <p className="text-sm text-gray-500 mb-2">The secret code was:</p>
            <div className="flex justify-center gap-2">
              {secret.map((color, i) => (
                <span
                  key={i}
                  className="text-3xl w-12 h-12 flex items-center justify-center bg-gray-100 rounded-lg"
                >
                  {color}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-3 text-left">
            <div className="flex justify-between px-4 py-2 bg-emerald-50 rounded-lg">
              <span className="text-gray-600">Result</span>
              <span className="font-semibold text-emerald-700">
                {solved ? "Solved" : skipped ? "Skipped" : "Out of attempts"}
              </span>
            </div>
            <div className="flex justify-between px-4 py-2 bg-emerald-50 rounded-lg">
              <span className="text-gray-600">Attempts used</span>
              <span className="font-semibold text-emerald-700">{attempts}</span>
            </div>
            <div className="flex justify-between px-4 py-2 bg-emerald-50 rounded-lg">
              <span className="text-gray-600">Hints used</span>
              <span className="font-semibold text-emerald-700">
                {hintsUsed}
              </span>
            </div>
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
              Perseverance: {result.primarySignal}
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
              Strategy: {result.secondarySignal}
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
  const guessFull = currentGuess.every((c) => c !== null);

  return (
    <div className="min-h-[480px] bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 flex flex-col">
      {/* Header */}
      <div className="text-center mb-4">
        <h2 className="text-2xl font-bold text-emerald-800">
          {config.stageName}
        </h2>
        <p className="text-gray-600 mt-1">{config.instruction}</p>
      </div>

      {/* Attempt counter */}
      <div className="flex justify-between text-sm text-gray-500 mb-4">
        <span>
          Attempt {attempts + 1} of {MAX_ATTEMPTS}
        </span>
        <span>
          Hints: {hintsUsed}/{MAX_HINTS}
        </span>
      </div>

      {/* Guess slots */}
      <div className="flex justify-center gap-3 mb-4">
        {currentGuess.map((color, i) => (
          <button
            key={i}
            onClick={() => handleSlotClick(i)}
            className={`w-14 h-14 rounded-xl border-2 flex items-center justify-center text-2xl transition-all ${
              revealedPositions.has(i)
                ? "border-emerald-400 bg-emerald-50 ring-2 ring-emerald-200"
                : selectedSlot === i
                ? "border-emerald-500 bg-white shadow-md scale-110"
                : "border-gray-300 bg-white hover:border-emerald-300"
            }`}
            disabled={revealedPositions.has(i)}
          >
            {color ?? (
              <span className="w-3 h-3 rounded-full bg-gray-200" />
            )}
          </button>
        ))}
      </div>

      {/* Color palette */}
      <div className="flex justify-center gap-3 mb-5">
        {config.colors.map((color, i) => (
          <button
            key={i}
            onClick={() => handleColorPick(color)}
            disabled={gameOver}
            className="w-12 h-12 rounded-xl bg-white border-2 border-gray-200 hover:border-emerald-400 hover:shadow-md flex items-center justify-center text-2xl transition-all active:scale-95"
          >
            {color}
          </button>
        ))}
      </div>

      {/* Action buttons */}
      <div className="flex justify-center gap-3 mb-5">
        <button
          onClick={handleCheck}
          disabled={!guessFull || gameOver}
          className={`px-6 py-2.5 rounded-xl font-semibold text-sm transition-all ${
            guessFull && !gameOver
              ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-600 hover:to-teal-600 shadow-md"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          Check
        </button>
        <button
          onClick={handleHint}
          disabled={gameOver || hintsUsed >= MAX_HINTS}
          className={`px-6 py-2.5 rounded-xl font-semibold text-sm transition-all ${
            !gameOver && hintsUsed < MAX_HINTS
              ? "bg-white border-2 border-emerald-300 text-emerald-600 hover:bg-emerald-50"
              : "bg-gray-100 text-gray-400 border-2 border-gray-200 cursor-not-allowed"
          }`}
        >
          Hint ({MAX_HINTS - hintsUsed})
        </button>
        <button
          onClick={handleSkip}
          disabled={gameOver}
          className={`px-6 py-2.5 rounded-xl font-semibold text-sm transition-all ${
            !gameOver
              ? "bg-white border-2 border-gray-300 text-gray-500 hover:bg-gray-50"
              : "bg-gray-100 text-gray-400 border-2 border-gray-200 cursor-not-allowed"
          }`}
        >
          Skip
        </button>
      </div>

      {/* Guess history */}
      {history.length > 0 && (
        <div className="flex-1 overflow-y-auto">
          <p className="text-xs text-gray-400 mb-2 font-medium uppercase tracking-wide">
            Previous guesses
          </p>
          <div className="space-y-2">
            {[...history].reverse().map((record, idx) => (
              <div
                key={history.length - 1 - idx}
                className="flex items-center gap-3 bg-white rounded-xl px-4 py-2 shadow-sm"
              >
                <span className="text-xs text-gray-400 font-mono w-5">
                  {history.length - idx}
                </span>
                <div className="flex gap-1.5">
                  {record.guess.map((color, i) => (
                    <span
                      key={i}
                      className="text-xl w-8 h-8 flex items-center justify-center"
                    >
                      {color}
                    </span>
                  ))}
                </div>
                <div className="flex gap-1 ml-auto">
                  {record.feedback.map((peg, i) => (
                    <span key={i} className="text-sm">
                      {pegEmoji[peg]}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
