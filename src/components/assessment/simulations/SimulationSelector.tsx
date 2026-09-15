"use client";

import { THEMES, SimulationTheme } from "./themes";

const COLOR_MAP: Record<string, string> = {
  emerald: "border-emerald-300 hover:border-emerald-500 hover:bg-emerald-50",
  violet: "border-violet-300 hover:border-violet-500 hover:bg-violet-50",
  cyan: "border-cyan-300 hover:border-cyan-500 hover:bg-cyan-50",
  amber: "border-amber-300 hover:border-amber-500 hover:bg-amber-50",
  rose: "border-rose-300 hover:border-rose-500 hover:bg-rose-50",
};

interface SimulationSelectorProps {
  onSelect: (theme: SimulationTheme) => void;
}

export default function SimulationSelector({ onSelect }: SimulationSelectorProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-6 sm:p-8">
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">Choose Your Adventure</h2>
          <p className="text-sm text-gray-500 mt-1">Pick a world to explore — each one tests your thinking skills!</p>
        </div>

        <div className="grid gap-3">
          {THEMES.map((theme) => (
            <button
              key={theme.id}
              onClick={() => onSelect(theme)}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 bg-white ${COLOR_MAP[theme.color] || COLOR_MAP.emerald}`}
            >
              <div className="flex items-center gap-4">
                <span className="text-4xl">{theme.emoji}</span>
                <div>
                  <h3 className="font-bold text-gray-800">{theme.name}</h3>
                  <p className="text-sm text-gray-500">{theme.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
