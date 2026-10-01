"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { buildAnswer, type QuestionAnswer } from "../../../types";

interface Props {
  onComplete: (answer: QuestionAnswer) => void;
}

type SignalColor = "RED" | "YELLOW" | "GREEN" | "STATIC";

interface Signal {
  id: string;
  color: SignalColor;
  isDuplicate: boolean;
  routable: boolean;
}

const LANE_MAP: Record<string, number> = { RED: 1, YELLOW: 2, GREEN: 3 };
const DURATION_MS = 45000;

function generateLoadSignals(): Signal[] {
  const colors: SignalColor[] = ["RED", "YELLOW", "GREEN"];
  const signals: Signal[] = [];
  const seenIds = new Set<string>();
  let counter = 1;

  for (let i = 0; i < 28; i++) {
    const roll = Math.random();

    if (roll < 0.2) {
      signals.push({ id: `SIG-${String(counter++).padStart(2, "0")}`, color: "STATIC", isDuplicate: false, routable: false });
    } else if (roll < 0.35 && signals.length > 3) {
      const prev = signals.filter((s) => s.color !== "STATIC" && !s.isDuplicate);
      if (prev.length > 0) {
        const dup = prev[Math.floor(Math.random() * prev.length)];
        signals.push({ id: dup.id, color: dup.color, isDuplicate: true, routable: false });
      } else {
        const c = colors[Math.floor(Math.random() * 3)];
        const id = `SIG-${String(counter++).padStart(2, "0")}`;
        seenIds.add(id);
        signals.push({ id, color: c, isDuplicate: false, routable: true });
      }
    } else {
      const c = colors[Math.floor(Math.random() * 3)];
      const id = `SIG-${String(counter++).padStart(2, "0")}`;
      seenIds.add(id);
      signals.push({ id, color: c, isDuplicate: false, routable: true });
    }
  }

  return signals;
}

export default function IncreasingLoad({ onComplete }: Props) {
  const [signals] = useState<Signal[]>(() => generateLoadSignals());
  const [started, setStarted] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(-1);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | "skipped" | null>(null);
  const [timeLeft, setTimeLeft] = useState(DURATION_MS);
  const [done, setDone] = useState(false);

  const resultsRef = useRef<Array<{ correct: boolean; signalIdx: number; half: "first" | "second" }>>([]);
  const statsRef = useRef({ correctRouted: 0, wrongRouted: 0, staticIgnored: 0, staticRouted: 0, dupIgnored: 0, dupRouted: 0, totalRoutable: 0, totalStatic: 0, totalDup: 0, firstCorrect: 0, firstTotal: 0, secondCorrect: 0, secondTotal: 0 });
  const gameStartRef = useRef(0);
  const signalShownAt = useRef(0);
  const feedbackTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const signalTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const clockTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const gameOverRef = useRef(false);

  useEffect(() => {
    return () => {
      if (feedbackTimer.current) clearTimeout(feedbackTimer.current);
      if (signalTimer.current) clearTimeout(signalTimer.current);
      if (clockTimer.current) clearInterval(clockTimer.current);
    };
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
      setCurrentIdx(idx);
      setFeedback(null);
      signalShownAt.current = Date.now();

      const elapsed = Date.now() - gameStartRef.current;
      const progress = Math.min(1, elapsed / DURATION_MS);
      const interval = 2500 - progress * 1000;

      signalTimer.current = setTimeout(() => {
        if (!gameOverRef.current) {
          const sig = signals[idx];
          const half = elapsed < DURATION_MS / 2 ? "first" : "second";
          if (sig.routable) {
            statsRef.current.totalRoutable++;
            if (half === "first") statsRef.current.firstTotal++;
            else statsRef.current.secondTotal++;
          } else if (sig.color === "STATIC") statsRef.current.totalStatic++;
          else if (sig.isDuplicate) statsRef.current.totalDup++;
          showNext(idx + 1);
        }
      }, interval);
    },
    [signals, endGame]
  );

  const handleStart = useCallback(() => {
    setStarted(true);
    gameStartRef.current = Date.now();
    clockTimer.current = setInterval(() => {
      const remaining = DURATION_MS - (Date.now() - gameStartRef.current);
      if (remaining <= 0) { endGame(); return; }
      setTimeLeft(remaining);
    }, 200);
    showNext(0);
  }, [showNext, endGame]);

  const processAction = useCallback(
    (action: "lane" | "skip", lane?: number) => {
      if (currentIdx < 0 || currentIdx >= signals.length || feedback !== null || gameOverRef.current) return;

      if (signalTimer.current) clearTimeout(signalTimer.current);

      const sig = signals[currentIdx];
      const elapsed = Date.now() - gameStartRef.current;
      const half: "first" | "second" = elapsed < DURATION_MS / 2 ? "first" : "second";
      let isCorrect = false;

      if (sig.color === "STATIC") {
        statsRef.current.totalStatic++;
        if (action === "skip") { statsRef.current.staticIgnored++; isCorrect = true; }
        else statsRef.current.staticRouted++;
      } else if (sig.isDuplicate) {
        statsRef.current.totalDup++;
        if (action === "skip") { statsRef.current.dupIgnored++; isCorrect = true; }
        else statsRef.current.dupRouted++;
      } else {
        statsRef.current.totalRoutable++;
        if (half === "first") statsRef.current.firstTotal++;
        else statsRef.current.secondTotal++;

        if (action === "lane" && lane === LANE_MAP[sig.color]) {
          statsRef.current.correctRouted++;
          if (half === "first") statsRef.current.firstCorrect++;
          else statsRef.current.secondCorrect++;
          isCorrect = true;
        } else {
          statsRef.current.wrongRouted++;
        }
      }

      setFeedback(isCorrect ? (action === "skip" ? "skipped" : "correct") : "wrong");
      feedbackTimer.current = setTimeout(() => showNext(currentIdx + 1), 500);
    },
    [currentIdx, signals, feedback, showNext]
  );

  const handleLane = useCallback((lane: number) => processAction("lane", lane), [processAction]);
  const handleSkip = useCallback(() => processAction("skip"), [processAction]);

  const handleFinish = useCallback(() => {
    const s = statsRef.current;
    const loadAcc = s.totalRoutable > 0 ? s.correctRouted / s.totalRoutable : 0.5;
    const dupDet = s.totalDup > 0 ? s.dupIgnored / s.totalDup : 1;
    const noiseInh = s.totalStatic > 0 ? s.staticIgnored / s.totalStatic : 1;
    const firstAcc = s.firstTotal > 0 ? s.firstCorrect / s.firstTotal : 0.5;
    const secondAcc = s.secondTotal > 0 ? s.secondCorrect / s.secondTotal : 0.5;
    const fatigueRatio = firstAcc > 0 ? Math.min(1, secondAcc / firstAcc) : 0.5;

    const answer = buildAnswer(
      "network-s2-load",
      `${s.correctRouted}/${s.totalRoutable}`,
      "ATT",
      "WM",
      [
        { param: "ATT", metric: "load_accuracy", value: loadAcc, weight: 1.0 },
        { param: "WM", metric: "duplicate_detection", value: dupDet, weight: 0.8 },
        { param: "ATT", metric: "noise_inhibition", value: noiseInh, weight: 0.6 },
        { param: "WM", metric: "fatigue_ratio", value: fatigueRatio, weight: 0.7 },
      ],
      {
        correctRouted: s.correctRouted, totalRoutable: s.totalRoutable, staticIgnored: s.staticIgnored,
        staticRouted: s.staticRouted, dupIgnored: s.dupIgnored, dupRouted: s.dupRouted,
        firstHalfAcc: Math.round(firstAcc * 100), secondHalfAcc: Math.round(secondAcc * 100),
      }
    );

    onComplete(answer);
  }, [onComplete]);

  if (!started) {
    return (
      <div className="w-full max-w-2xl mx-auto space-y-6 text-center">
        <h2 className="text-xl font-bold text-gray-800">Stage 2: Increasing Load</h2>
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 space-y-4">
          <p className="text-sm text-gray-600">Same rules, but faster — and watch out for:</p>
          <div className="flex flex-col gap-2 items-center text-sm">
            <span className="px-3 py-1 bg-gray-400 text-white rounded-lg">GRAY (STATIC) — Skip these!</span>
            <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-lg border border-orange-300">Duplicate IDs — Skip the second one!</span>
          </div>
          <p className="text-xs text-gray-400">45 seconds. Speed increases over time.</p>
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
        <h2 className="text-xl font-bold text-gray-800">Load Test Complete!</h2>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-3">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Signals Routed</p>
              <p className="font-bold text-lg text-gray-800">{s.correctRouted} / {s.totalRoutable}</p>
            </div>
            <div>
              <p className="text-gray-500">Noise Filtered</p>
              <p className="font-bold text-lg text-gray-800">{s.staticIgnored} / {s.totalStatic}</p>
            </div>
            <div>
              <p className="text-gray-500">Duplicates Caught</p>
              <p className="font-bold text-lg text-gray-800">{s.dupIgnored} / {s.totalDup}</p>
            </div>
            <div>
              <p className="text-gray-500">Consistency</p>
              <p className="font-bold text-lg text-gray-800">{Math.round((s.firstTotal > 0 ? s.firstCorrect / s.firstTotal : 0) * 100)}% → {Math.round((s.secondTotal > 0 ? s.secondCorrect / s.secondTotal : 0) * 100)}%</p>
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
  const pct = ((DURATION_MS - timeLeft) / DURATION_MS) * 100;

  const colorStyle: Record<SignalColor, string> = {
    RED: "bg-red-500 text-white",
    YELLOW: "bg-yellow-400 text-gray-900",
    GREEN: "bg-green-500 text-white",
    STATIC: "bg-gray-400 text-white",
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-800">Route or Skip</h2>
        <span className="text-sm font-mono text-gray-500">{Math.ceil(timeLeft / 1000)}s</span>
      </div>

      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div className="h-full bg-indigo-500 transition-all duration-200 rounded-full" style={{ width: `${pct}%` }} />
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[1, 2, 3].map((lane) => (
          <button key={lane} onClick={() => handleLane(lane)} disabled={feedback !== null}
            className={`h-20 rounded-xl border-2 flex items-center justify-center font-semibold text-sm transition-all ${
              lane === 1 ? "bg-red-100 border-red-300" : lane === 2 ? "bg-yellow-50 border-yellow-300" : "bg-green-100 border-green-300"
            } ${feedback === null ? "hover:scale-[1.03] cursor-pointer active:scale-95" : "opacity-60"}`}
          >
            Lane {lane}
          </button>
        ))}
      </div>

      {currentSignal && (
        <div className="flex flex-col items-center gap-3">
          {feedback && (
            <span className={`text-sm font-bold ${feedback === "wrong" ? "text-red-600" : "text-green-600"}`}>
              {feedback === "correct" ? "✓" : feedback === "skipped" ? "✓ Skipped" : "✗ Wrong"}
            </span>
          )}
          <div className={`relative w-20 h-24 rounded-xl ${colorStyle[currentSignal.color]} flex flex-col items-center justify-center shadow-lg`}>
            <span className="text-[10px] font-mono opacity-70">{currentSignal.id}</span>
            <span className="text-xs font-bold mt-1">{currentSignal.color === "STATIC" ? "---" : currentSignal.color}</span>
            {currentSignal.isDuplicate && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 rounded-full text-[9px] font-bold flex items-center justify-center text-white">2x</span>
            )}
          </div>
          <button onClick={handleSkip} disabled={feedback !== null}
            className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${feedback === null ? "bg-gray-200 text-gray-700 hover:bg-gray-300 cursor-pointer" : "bg-gray-100 text-gray-400 cursor-not-allowed"}`}
          >
            Skip (Noise / Duplicate)
          </button>
        </div>
      )}
    </div>
  );
}
