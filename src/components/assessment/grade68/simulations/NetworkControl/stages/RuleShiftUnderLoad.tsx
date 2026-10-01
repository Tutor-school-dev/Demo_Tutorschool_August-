"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { buildAnswer, type QuestionAnswer } from "../../../types";

interface Props {
  onComplete: (answer: QuestionAnswer) => void;
}

type SignalColor = "RED" | "YELLOW" | "GREEN";
type RulePhase = "reversed" | "transition" | "new_rule";

interface Signal {
  id: string;
  color: SignalColor;
}

const PHASE_DURATIONS: Record<RulePhase, number> = { reversed: 20000, transition: 10000, new_rule: 20000 };
const TOTAL_DURATION = 50000;
const INTERVAL = 2000;

function getCorrectLane(color: SignalColor, phase: RulePhase): number {
  if (phase === "reversed") {
    if (color === "GREEN") return 1;
    if (color === "YELLOW") return 2;
    if (color === "RED") return 3;
  }
  if (phase === "new_rule") {
    if (color === "RED") return 1;
    if (color === "YELLOW") return 4;
    if (color === "GREEN") return 3;
  }
  return color === "RED" ? 1 : color === "YELLOW" ? 2 : 3;
}

function generateShiftSignals(): Signal[] {
  const colors: SignalColor[] = ["RED", "YELLOW", "GREEN"];
  const count = Math.floor(TOTAL_DURATION / INTERVAL);
  return Array.from({ length: count }, (_, i) => ({
    id: `SIG-${String(i + 1).padStart(2, "0")}`,
    color: colors[Math.floor(Math.random() * 3)],
  }));
}

const PHASE_BANNERS: Record<RulePhase, { text: string; bg: string }> = {
  reversed: { text: "⚠️ REVERSED RULES: Green→1, Yellow→2, Red→3", bg: "bg-orange-100 border-orange-300 text-orange-800" },
  transition: { text: "✅ NORMAL RULES RESTORED: Red→1, Yellow→2, Green→3", bg: "bg-green-100 border-green-300 text-green-800" },
  new_rule: { text: "🆕 NEW RULE: Red→1, Yellow→Lane 4, Green→3", bg: "bg-purple-100 border-purple-300 text-purple-800" },
};

export default function RuleShiftUnderLoad({ onComplete }: Props) {
  const [signals] = useState<Signal[]>(() => generateShiftSignals());
  const [started, setStarted] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(-1);
  const [rulePhase, setRulePhase] = useState<RulePhase>("reversed");
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [timeLeft, setTimeLeft] = useState(TOTAL_DURATION);
  const [done, setDone] = useState(false);

  const statsRef = useRef({
    reversedCorrect: 0, reversedTotal: 0,
    transitionCorrect: 0, transitionTotal: 0,
    newRuleCorrect: 0, newRuleTotal: 0,
  });

  const gameStartRef = useRef(0);
  const signalTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const feedbackTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const clockTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const gameOverRef = useRef(false);

  useEffect(() => {
    return () => {
      if (signalTimer.current) clearTimeout(signalTimer.current);
      if (feedbackTimer.current) clearTimeout(feedbackTimer.current);
      if (clockTimer.current) clearInterval(clockTimer.current);
    };
  }, []);

  const getCurrentPhase = useCallback((): RulePhase => {
    const elapsed = Date.now() - gameStartRef.current;
    if (elapsed < PHASE_DURATIONS.reversed) return "reversed";
    if (elapsed < PHASE_DURATIONS.reversed + PHASE_DURATIONS.transition) return "transition";
    return "new_rule";
  }, []);

  const endGame = useCallback(() => {
    if (gameOverRef.current) return;
    gameOverRef.current = true;
    if (clockTimer.current) clearInterval(clockTimer.current);
    if (signalTimer.current) clearTimeout(signalTimer.current);
    if (feedbackTimer.current) clearTimeout(feedbackTimer.current);
    setDone(true);
  }, []);

  const showNext = useCallback(
    (idx: number) => {
      if (gameOverRef.current) return;
      if (idx >= signals.length) { endGame(); return; }

      const phase = getCurrentPhase();
      setRulePhase(phase);
      setCurrentIdx(idx);
      setFeedback(null);

      signalTimer.current = setTimeout(() => {
        if (!gameOverRef.current) {
          const p = getCurrentPhase();
          if (p === "reversed") statsRef.current.reversedTotal++;
          else if (p === "transition") statsRef.current.transitionTotal++;
          else statsRef.current.newRuleTotal++;
          showNext(idx + 1);
        }
      }, INTERVAL);
    },
    [signals, endGame, getCurrentPhase]
  );

  const handleStart = useCallback(() => {
    setStarted(true);
    gameStartRef.current = Date.now();
    clockTimer.current = setInterval(() => {
      const remaining = TOTAL_DURATION - (Date.now() - gameStartRef.current);
      if (remaining <= 0) { endGame(); return; }
      setTimeLeft(remaining);
      setRulePhase(getCurrentPhase());
    }, 200);
    showNext(0);
  }, [showNext, endGame, getCurrentPhase]);

  const handleLane = useCallback(
    (lane: number) => {
      if (currentIdx < 0 || currentIdx >= signals.length || feedback !== null || gameOverRef.current) return;
      if (signalTimer.current) clearTimeout(signalTimer.current);

      const phase = getCurrentPhase();
      const correct = getCorrectLane(signals[currentIdx].color, phase);
      const isCorrect = lane === correct;

      if (phase === "reversed") { statsRef.current.reversedTotal++; if (isCorrect) statsRef.current.reversedCorrect++; }
      else if (phase === "transition") { statsRef.current.transitionTotal++; if (isCorrect) statsRef.current.transitionCorrect++; }
      else { statsRef.current.newRuleTotal++; if (isCorrect) statsRef.current.newRuleCorrect++; }

      setFeedback(isCorrect ? "correct" : "wrong");
      feedbackTimer.current = setTimeout(() => showNext(currentIdx + 1), 400);
    },
    [currentIdx, signals, feedback, getCurrentPhase, showNext]
  );

  const handleFinish = useCallback(() => {
    const s = statsRef.current;
    const revAcc = s.reversedTotal > 0 ? s.reversedCorrect / s.reversedTotal : 0.5;
    const transAcc = s.transitionTotal > 0 ? s.transitionCorrect / s.transitionTotal : 0.5;
    const newAcc = s.newRuleTotal > 0 ? s.newRuleCorrect / s.newRuleTotal : 0.5;
    const totalCorrect = s.reversedCorrect + s.transitionCorrect + s.newRuleCorrect;
    const totalSignals = s.reversedTotal + s.transitionTotal + s.newRuleTotal;
    const overallAcc = totalSignals > 0 ? totalCorrect / totalSignals : 0.5;

    const answer = buildAnswer(
      "network-s3-ruleshift",
      `${totalCorrect}/${totalSignals}`,
      "WM",
      "ATT",
      [
        { param: "WM", metric: "reversed_accuracy", value: revAcc, weight: 1.0 },
        { param: "ATT", metric: "shift_transition", value: transAcc, weight: 0.7 },
        { param: "WM", metric: "new_lane_accuracy", value: newAcc, weight: 0.8 },
        { param: "ATT", metric: "overall_sustained", value: overallAcc, weight: 0.5 },
      ],
      { reversedAcc: Math.round(revAcc * 100), transitionAcc: Math.round(transAcc * 100), newRuleAcc: Math.round(newAcc * 100), totalCorrect, totalSignals }
    );

    onComplete(answer);
  }, [onComplete]);

  if (!started) {
    return (
      <div className="w-full max-w-2xl mx-auto space-y-6 text-center">
        <h2 className="text-xl font-bold text-gray-800">Stage 3: Rule Shift</h2>
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 space-y-4">
          <p className="text-sm text-gray-600">The rules will change mid-game! Stay focused.</p>
          <div className="text-xs text-gray-500 space-y-1">
            <p><strong>Phase 1 (20s):</strong> REVERSED — Green→1, Yellow→2, Red→3</p>
            <p><strong>Phase 2 (10s):</strong> Normal rules restored</p>
            <p><strong>Phase 3 (20s):</strong> Yellow moves to new Lane 4</p>
          </div>
        </div>
        <button onClick={handleStart} className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-xl shadow-md hover:bg-indigo-500 cursor-pointer active:scale-[0.98] transition-all">
          Start
        </button>
      </div>
    );
  }

  if (done) {
    const s = statsRef.current;
    return (
      <div className="w-full max-w-2xl mx-auto space-y-6 text-center">
        <h2 className="text-xl font-bold text-gray-800">Rule Shift Complete!</h2>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Reversed</p>
              <p className="font-bold text-lg">{s.reversedTotal > 0 ? Math.round(s.reversedCorrect / s.reversedTotal * 100) : 0}%</p>
            </div>
            <div>
              <p className="text-gray-500">Transition</p>
              <p className="font-bold text-lg">{s.transitionTotal > 0 ? Math.round(s.transitionCorrect / s.transitionTotal * 100) : 0}%</p>
            </div>
            <div>
              <p className="text-gray-500">New Rule</p>
              <p className="font-bold text-lg">{s.newRuleTotal > 0 ? Math.round(s.newRuleCorrect / s.newRuleTotal * 100) : 0}%</p>
            </div>
          </div>
        </div>
        <button onClick={handleFinish} className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-xl shadow-md hover:bg-indigo-500 cursor-pointer active:scale-[0.98] transition-all">
          Continue
        </button>
      </div>
    );
  }

  const currentSignal = currentIdx >= 0 && currentIdx < signals.length ? signals[currentIdx] : null;
  const pct = ((TOTAL_DURATION - timeLeft) / TOTAL_DURATION) * 100;
  const banner = PHASE_BANNERS[rulePhase];
  const laneCount = rulePhase === "new_rule" ? 4 : 3;

  const colorStyle: Record<SignalColor, string> = {
    RED: "bg-red-500 text-white",
    YELLOW: "bg-yellow-400 text-gray-900",
    GREEN: "bg-green-500 text-white",
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-800">Rule Shift</h2>
        <span className="text-sm font-mono text-gray-500">{Math.ceil(timeLeft / 1000)}s</span>
      </div>

      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div className="h-full bg-indigo-500 transition-all duration-200 rounded-full" style={{ width: `${pct}%` }} />
      </div>

      <div className={`p-3 rounded-xl border text-sm font-semibold text-center ${banner.bg}`}>
        {banner.text}
      </div>

      <div className={`grid gap-3 ${laneCount === 4 ? "grid-cols-4" : "grid-cols-3"}`}>
        {Array.from({ length: laneCount }, (_, i) => i + 1).map((lane) => (
          <button key={lane} onClick={() => handleLane(lane)} disabled={feedback !== null}
            className={`h-20 rounded-xl border-2 flex items-center justify-center font-semibold text-sm transition-all ${
              lane === 1 ? "bg-red-100 border-red-300" : lane === 2 ? "bg-yellow-50 border-yellow-300" : lane === 3 ? "bg-green-100 border-green-300" : "bg-purple-100 border-purple-300"
            } ${feedback === null ? "hover:scale-[1.03] cursor-pointer active:scale-95" : "opacity-60"}`}
          >
            Lane {lane}
          </button>
        ))}
      </div>

      {currentSignal && (
        <div className="flex flex-col items-center gap-3">
          {feedback && (
            <span className={`text-sm font-bold ${feedback === "correct" ? "text-green-600" : "text-red-600"}`}>
              {feedback === "correct" ? "✓" : "✗"}
            </span>
          )}
          <div className={`w-20 h-24 rounded-xl ${colorStyle[currentSignal.color]} flex flex-col items-center justify-center shadow-lg`}>
            <span className="text-[10px] font-mono opacity-70">{currentSignal.id}</span>
            <span className="text-xs font-bold mt-1">{currentSignal.color}</span>
          </div>
        </div>
      )}
    </div>
  );
}
