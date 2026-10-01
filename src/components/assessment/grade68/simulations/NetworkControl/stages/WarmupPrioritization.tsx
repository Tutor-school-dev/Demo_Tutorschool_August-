"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { buildAnswer, type QuestionAnswer } from "../../../types";

interface Props {
  onComplete: (answer: QuestionAnswer) => void;
}

type SignalColor = "RED" | "YELLOW" | "GREEN";

interface Signal {
  id: string;
  color: SignalColor;
}

const LANE_MAP: Record<SignalColor, number> = { RED: 1, YELLOW: 2, GREEN: 3 };
const COLOR_STYLES: Record<SignalColor, string> = {
  RED: "bg-red-500 text-white",
  YELLOW: "bg-yellow-400 text-gray-900",
  GREEN: "bg-green-500 text-white",
};
const LANE_COLORS = ["bg-red-100 border-red-300", "bg-yellow-50 border-yellow-300", "bg-green-100 border-green-300"];
const LANE_LABELS = ["Lane 1 (RED)", "Lane 2 (YELLOW)", "Lane 3 (GREEN)"];

function generateSignals(): Signal[] {
  const colors: SignalColor[] = ["RED", "YELLOW", "GREEN"];
  return Array.from({ length: 10 }, (_, i) => ({
    id: `SIG-${String(i + 1).padStart(2, "0")}`,
    color: colors[Math.floor(Math.random() * 3)],
  }));
}

export default function WarmupPrioritization({ onComplete }: Props) {
  const [signals] = useState<Signal[]>(() => generateSignals());
  const [currentIdx, setCurrentIdx] = useState(-1);
  const [started, setStarted] = useState(false);
  const [results, setResults] = useState<Array<{ correct: boolean; rt: number }>>([]);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [done, setDone] = useState(false);

  const signalShownAt = useRef(0);
  const feedbackTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const nextTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (feedbackTimer.current) clearTimeout(feedbackTimer.current);
      if (nextTimer.current) clearTimeout(nextTimer.current);
    };
  }, []);

  const showNext = useCallback(
    (idx: number) => {
      if (idx >= signals.length) {
        setDone(true);
        return;
      }
      setCurrentIdx(idx);
      setFeedback(null);
      signalShownAt.current = Date.now();
    },
    [signals.length]
  );

  const handleStart = useCallback(() => {
    setStarted(true);
    showNext(0);
  }, [showNext]);

  const handleLaneClick = useCallback(
    (lane: number) => {
      if (currentIdx < 0 || currentIdx >= signals.length || feedback !== null) return;

      const rt = Date.now() - signalShownAt.current;
      const correctLane = LANE_MAP[signals[currentIdx].color];
      const isCorrect = lane === correctLane;

      setResults((prev) => [...prev, { correct: isCorrect, rt }]);
      setFeedback(isCorrect ? "correct" : "wrong");

      feedbackTimer.current = setTimeout(() => {
        showNext(currentIdx + 1);
      }, 800);
    },
    [currentIdx, signals, feedback, showNext]
  );

  const handleFinish = useCallback(() => {
    const correct = results.filter((r) => r.correct).length;
    const avgRT = results.length > 0 ? results.reduce((s, r) => s + r.rt, 0) / results.length : 5000;

    const answer = buildAnswer(
      "network-s1-warmup",
      `${correct}/${results.length}`,
      "ATT",
      "ATT",
      [
        { param: "ATT", metric: "baseline_accuracy", value: correct / 10, weight: 1.0 },
        { param: "ATT", metric: "baseline_speed", value: Math.max(0, Math.min(1, 1 - (avgRT - 500) / 4500)), weight: 0.5 },
      ],
      { correct, total: results.length, avgReactionTimeMs: Math.round(avgRT) }
    );

    onComplete(answer);
  }, [results, onComplete]);

  if (!started) {
    return (
      <div className="w-full max-w-2xl mx-auto space-y-6 text-center">
        <h2 className="text-xl font-bold text-gray-800">Stage 1: Signal Routing</h2>
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 space-y-4">
          <p className="text-sm text-gray-600">Route each colored signal to the correct lane:</p>
          <div className="flex justify-center gap-4 text-sm font-medium">
            <span className="px-3 py-1 bg-red-500 text-white rounded-lg">RED → Lane 1</span>
            <span className="px-3 py-1 bg-yellow-400 text-gray-900 rounded-lg">YELLOW → Lane 2</span>
            <span className="px-3 py-1 bg-green-500 text-white rounded-lg">GREEN → Lane 3</span>
          </div>
          <p className="text-xs text-gray-400">10 signals will appear one at a time. Click the correct lane for each.</p>
        </div>
        <button onClick={handleStart} className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-xl shadow-md hover:bg-indigo-500 cursor-pointer active:scale-[0.98] transition-all">
          Start
        </button>
      </div>
    );
  }

  if (done) {
    const correct = results.filter((r) => r.correct).length;
    return (
      <div className="w-full max-w-2xl mx-auto space-y-6 text-center">
        <h2 className="text-xl font-bold text-gray-800">Warm-up Complete!</h2>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-3">
          <p className="text-4xl">{correct >= 8 ? "🎯" : correct >= 5 ? "👍" : "💪"}</p>
          <p className="text-lg font-semibold text-gray-800">{correct} / 10 correct</p>
          <p className="text-sm text-gray-500">
            Average response time: {Math.round(results.reduce((s, r) => s + r.rt, 0) / results.length)}ms
          </p>
        </div>
        <button onClick={handleFinish} className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-xl shadow-md hover:bg-indigo-500 cursor-pointer active:scale-[0.98] transition-all">
          Continue
        </button>
      </div>
    );
  }

  const currentSignal = signals[currentIdx];

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-800">Route the Signal</h2>
        <span className="text-sm font-medium text-gray-500">{currentIdx + 1} / 10</span>
      </div>

      <div className="flex gap-1.5">
        {signals.map((_, i) => (
          <div key={i} className={`flex-1 h-1.5 rounded-full ${i < currentIdx ? (results[i]?.correct ? "bg-green-400" : "bg-red-400") : i === currentIdx ? "bg-indigo-400" : "bg-gray-200"}`} />
        ))}
      </div>

      {/* Lanes */}
      <div className="grid grid-cols-3 gap-3">
        {[1, 2, 3].map((lane, i) => (
          <button
            key={lane}
            onClick={() => handleLaneClick(lane)}
            disabled={feedback !== null}
            className={`h-24 rounded-xl border-2 ${LANE_COLORS[i]} flex items-center justify-center font-semibold text-sm transition-all ${
              feedback === null ? "hover:scale-[1.03] cursor-pointer active:scale-95" : "opacity-70"
            }`}
          >
            {LANE_LABELS[i]}
          </button>
        ))}
      </div>

      {/* Current signal */}
      <div className="flex flex-col items-center gap-4">
        {feedback && (
          <div className={`text-lg font-bold ${feedback === "correct" ? "text-green-600" : "text-red-600"}`}>
            {feedback === "correct" ? "✓ Correct!" : "✗ Wrong lane!"}
          </div>
        )}
        <div className={`w-24 h-28 rounded-xl ${COLOR_STYLES[currentSignal.color]} flex flex-col items-center justify-center shadow-lg ${feedback === null ? "animate-bounce" : ""}`}>
          <span className="text-[10px] font-mono opacity-70">{currentSignal.id}</span>
          <span className="text-sm font-bold mt-1">{currentSignal.color}</span>
        </div>
      </div>
    </div>
  );
}
