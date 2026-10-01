"use client";

import { useState, useCallback, useEffect } from "react";

export interface Category {
  key: string;
  label: string;
  emoji: string;
  min?: number;
  max?: number;
}

interface ResourceAllocatorProps {
  categories: Category[];
  total: number;
  initialValues?: Record<string, number>;
  onChange: (values: Record<string, number>) => void;
}

export default function ResourceAllocator({ categories, total, initialValues, onChange }: ResourceAllocatorProps) {
  const [values, setValues] = useState<Record<string, number>>(() => {
    if (initialValues) return { ...initialValues };
    const even = Math.floor(total / categories.length);
    const vals: Record<string, number> = {};
    categories.forEach((c, i) => {
      vals[c.key] = i === 0 ? total - even * (categories.length - 1) : even;
    });
    return vals;
  });

  useEffect(() => {
    onChange(values);
  }, []);

  const used = Object.values(values).reduce((s, v) => s + v, 0);
  const remaining = total - used;

  const handleSlider = useCallback(
    (key: string, newVal: number) => {
      const cat = categories.find((c) => c.key === key)!;
      const min = cat.min ?? 0;
      const max = cat.max ?? total;
      const clamped = Math.max(min, Math.min(max, newVal));

      const otherUsed = used - values[key];
      const maxAllowed = total - otherUsed;
      const final = Math.min(clamped, maxAllowed);

      const next = { ...values, [key]: final };
      setValues(next);
      onChange(next);
    },
    [categories, total, used, values, onChange]
  );

  return (
    <div className="w-full max-w-lg space-y-4">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-gray-700">Budget Allocation</span>
        <span className={`font-bold ${remaining < 0 ? "text-red-500" : remaining === 0 ? "text-green-600" : "text-amber-600"}`}>
          {remaining} remaining of {total}
        </span>
      </div>

      {categories.map((cat) => {
        const val = values[cat.key] ?? 0;
        const pct = total > 0 ? (val / total) * 100 : 0;
        return (
          <div key={cat.key} className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">
                {cat.emoji} {cat.label}
              </span>
              <span className="text-sm font-bold text-indigo-600 w-12 text-right">{val}</span>
            </div>
            <input
              type="range"
              min={cat.min ?? 0}
              max={cat.max ?? total}
              value={val}
              onChange={(e) => handleSlider(cat.key, Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-400 rounded-full transition-all duration-150"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
