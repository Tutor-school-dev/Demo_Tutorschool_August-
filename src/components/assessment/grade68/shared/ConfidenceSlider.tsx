"use client";

import { useState } from "react";

interface ConfidenceSliderProps {
  label?: string;
  onChange: (value: number) => void;
}

const LABELS = ["Not sure at all", "A little sure", "Somewhat sure", "Pretty sure", "Very sure"];

export default function ConfidenceSlider({ label = "How confident are you?", onChange }: ConfidenceSliderProps) {
  const [value, setValue] = useState(3);

  const handleChange = (v: number) => {
    setValue(v);
    onChange(v);
  };

  return (
    <div className="w-full max-w-md space-y-2">
      <p className="text-sm font-medium text-gray-700">{label}</p>
      <div className="flex items-center gap-3">
        <span className="text-xs text-gray-400 w-6 text-center">1</span>
        <input
          type="range"
          min={1}
          max={5}
          step={1}
          value={value}
          onChange={(e) => handleChange(Number(e.target.value))}
          className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-500"
        />
        <span className="text-xs text-gray-400 w-6 text-center">5</span>
      </div>
      <p className="text-xs text-indigo-600 text-center font-medium">{LABELS[value - 1]}</p>
    </div>
  );
}
