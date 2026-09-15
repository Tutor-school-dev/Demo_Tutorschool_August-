"use client";

import { useState, useRef, useCallback } from "react";
import type { QuestionAnswer } from "@/lib/questionBankScoring";
import type { ChoiceConfig } from "../themes";

interface ChoiceGameProps {
  config: ChoiceConfig;
  themeId: string;
  onComplete: (answer: QuestionAnswer) => void;
}

type Phase = "choose" | "outcome" | "bonus";

const OUTCOME_MESSAGES: Record<string, string[]> = {
  default: [
    "You found a hidden stream!",
    "A friendly creature waves hello!",
    "You discovered a secret clearing!",
    "Something sparkles in the distance!",
    "The path opens to a beautiful view!",
  ],
};

function getOutcomeMessage(pathName: string): string {
  const messages = OUTCOME_MESSAGES.default;
  const index = Math.abs(
    pathName.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0)
  ) % messages.length;
  return messages[index];
}

export default function ChoiceGame({
  config,
  themeId,
  onComplete,
}: ChoiceGameProps) {
  const [phase, setPhase] = useState<Phase>("choose");
  const [chosenIndex, setChosenIndex] = useState<number | null>(null);
  const [outcomeMsg, setOutcomeMsg] = useState("");
  const [bonusActive, setBonusActive] = useState(false);
  const [bonusCountdown, setBonusCountdown] = useState(3);

  const pathsShownAt = useRef<number>(Date.now());
  const planningTimeMs = useRef<number>(0);
  const tookBonus = useRef<boolean>(false);

  const finishGame = useCallback(
    (chosenName: string, planMs: number, didBonus: boolean) => {
      const engagement = didBonus ? 0.9 : (planMs > 2000 ? 0.6 : 0.25);
      const planningCare = Math.max(0.1, Math.min(1.0, planMs / 5000));

      let signal: string;
      if (didBonus) signal = "high";
      else if (planMs > 2000) signal = "moderate";
      else signal = "low";

      onComplete({
        questionId: `${themeId}-choice`,
        selectedKey: chosenName,
        primaryParam: "PAC",
        secondaryParam: "PAC",
        primarySignal: signal,
        secondarySignal: signal,
        indicators: [
          { param: "PAC", metric: "engagement", value: engagement, weight: 0.8 },
          { param: "PAC", metric: "planningCare", value: planningCare, weight: 0.5 },
        ],
        rawMetrics: { planningTimeMs: Math.round(planMs), tookBonus: didBonus ? 1 : 0 },
      });
    },
    [themeId, onComplete]
  );

  const handleChoosePath = useCallback(
    (index: number) => {
      const now = Date.now();
      planningTimeMs.current = now - pathsShownAt.current;
      setChosenIndex(index);
      setOutcomeMsg(getOutcomeMessage(config.paths[index].name));
      setPhase("outcome");

      setTimeout(() => {
        setPhase("bonus");
      }, 2000);
    },
    [config.paths]
  );

  const handleBonusYes = useCallback(() => {
    tookBonus.current = true;
    setBonusActive(true);

    let remaining = 3;
    const interval = setInterval(() => {
      remaining -= 1;
      setBonusCountdown(remaining);
      if (remaining <= 0) {
        clearInterval(interval);
        finishGame(
          config.paths[chosenIndex!].name,
          planningTimeMs.current,
          true
        );
      }
    }, 1000);
  }, [chosenIndex, config.paths, finishGame]);

  const handleBonusNo = useCallback(() => {
    finishGame(
      config.paths[chosenIndex!].name,
      planningTimeMs.current,
      false
    );
  }, [chosenIndex, config.paths, finishGame]);

  return (
    <div className="min-h-[480px] w-full bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl shadow-xl p-6 flex flex-col items-center">
      {/* Header */}
      <h2 className="text-2xl font-bold text-emerald-800 mb-1">
        {config.stageName}
      </h2>
      <p className="text-sm text-teal-600 mb-6 text-center max-w-md">
        {config.instruction}
      </p>

      {/* Phase: Choose */}
      {phase === "choose" && (
        <div className="flex-1 flex flex-col items-center justify-center w-full">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-2xl">
            {config.paths.map((path, i) => (
              <button
                key={path.name}
                onClick={() => handleChoosePath(i)}
                className="group bg-white rounded-xl shadow-md hover:shadow-lg border-2 border-transparent hover:border-emerald-400 transition-all duration-200 p-5 flex flex-col items-center text-center cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2"
              >
                <span className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-200">
                  {path.emoji}
                </span>
                <span className="font-semibold text-emerald-800 text-lg mb-1">
                  {path.name}
                </span>
                <span className="text-sm text-teal-600 leading-snug">
                  {path.description}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Phase: Outcome */}
      {phase === "outcome" && chosenIndex !== null && (
        <div className="flex-1 flex flex-col items-center justify-center animate-fade-in">
          <div className="bg-white rounded-xl shadow-md p-8 max-w-sm text-center">
            <span className="text-5xl block mb-4">
              {config.paths[chosenIndex].emoji}
            </span>
            <p className="text-lg font-semibold text-emerald-700 mb-2">
              {config.paths[chosenIndex].name}
            </p>
            <p className="text-teal-600">{outcomeMsg}</p>
            <div className="mt-4 flex justify-center gap-1">
              <span className="inline-block w-2 h-2 bg-emerald-400 rounded-full animate-bounce [animation-delay:0ms]" />
              <span className="inline-block w-2 h-2 bg-teal-400 rounded-full animate-bounce [animation-delay:150ms]" />
              <span className="inline-block w-2 h-2 bg-emerald-400 rounded-full animate-bounce [animation-delay:300ms]" />
            </div>
          </div>
        </div>
      )}

      {/* Phase: Bonus */}
      {phase === "bonus" && !bonusActive && (
        <div className="flex-1 flex flex-col items-center justify-center animate-fade-in">
          <div className="bg-white rounded-xl shadow-md p-8 max-w-sm text-center">
            <span className="text-4xl block mb-4">&#x2728;</span>
            <p className="text-lg font-semibold text-emerald-800 mb-4">
              {config.bonusPrompt}
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={handleBonusYes}
                className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-medium rounded-lg shadow hover:from-emerald-600 hover:to-teal-600 transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2"
              >
                Yes, let&apos;s go!
              </button>
              <button
                onClick={handleBonusNo}
                className="px-5 py-2.5 bg-white text-teal-700 font-medium rounded-lg border border-teal-300 hover:bg-teal-50 transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-300 focus:ring-offset-2"
              >
                No thanks, continue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bonus exploration active */}
      {phase === "bonus" && bonusActive && (
        <div className="flex-1 flex flex-col items-center justify-center animate-fade-in">
          <div className="bg-white rounded-xl shadow-md p-8 max-w-sm text-center">
            <div className="relative mb-4">
              <span className="text-5xl inline-block animate-spin [animation-duration:3s]">
                &#x1F30D;
              </span>
              <span className="absolute -top-1 -right-1 text-2xl animate-ping">
                &#x2728;
              </span>
            </div>
            <p className="text-lg font-semibold text-emerald-700 mb-2">
              Bonus Exploration!
            </p>
            <p className="text-teal-600 mb-3">
              Discovering something amazing...
            </p>
            <div className="flex justify-center gap-1.5">
              {[0, 1, 2].map((dot) => (
                <span
                  key={dot}
                  className={`inline-block w-3 h-3 rounded-full transition-colors duration-300 ${
                    3 - bonusCountdown > dot
                      ? "bg-emerald-500"
                      : "bg-emerald-200"
                  }`}
                />
              ))}
            </div>
            <p className="text-xs text-teal-400 mt-2">
              {bonusCountdown}s remaining
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
