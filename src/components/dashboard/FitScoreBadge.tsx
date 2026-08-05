"use client";

interface FitScoreBadgeProps {
  score: number;
  size?: "sm" | "md" | "lg";
}

export default function FitScoreBadge({ score, size = "md" }: FitScoreBadgeProps) {
  const sizes = {
    sm: { outer: 56, inner: 44, text: "text-sm", stroke: 4 },
    md: { outer: 80, inner: 64, text: "text-xl", stroke: 5 },
    lg: { outer: 110, inner: 90, text: "text-3xl", stroke: 6 },
  };

  const s = sizes[size];
  const radius = (s.inner - s.stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const color =
    score >= 85 ? "#059669" : score >= 70 ? "#d97706" : "#dc2626";

  return (
    <div
      className="relative inline-flex items-center justify-center"
      style={{ width: s.outer, height: s.outer }}
    >
      <svg
        width={s.inner}
        height={s.inner}
        className="transform -rotate-90"
      >
        <circle
          cx={s.inner / 2}
          cy={s.inner / 2}
          r={radius}
          fill="none"
          stroke="#e2e8f0"
          strokeWidth={s.stroke}
        />
        <circle
          cx={s.inner / 2}
          cy={s.inner / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={s.stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-700 ease-out"
        />
      </svg>
      <span
        className={`absolute ${s.text} font-bold`}
        style={{ color }}
      >
        {score}%
      </span>
    </div>
  );
}
