"use client";

import { useState, useEffect } from "react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { LearningPattern } from "@/lib/api";

const SHORT_LABELS: Record<string, string> = {
  "Concept Formation & Abstraction Ability": "Concept Formation",
  "Reasoning Strategy & Transfer Ability": "Reasoning & Transfer",
  "Working Memory & Retention Stability": "Working Memory",
  "Divergent Thinking": "Divergent Thinking",
  "Cognitive Flexibility & Logical Reasoning": "Logical Reasoning",
  "Expression & Explanation Quality": "Expression Quality",
  "Pacing (Mastery-Based Instructional Progression)": "Pacing",
  "Scaffolding (Contingent Support Calibration)": "Scaffolding",
  "Feedback Style (Corrective/Elaborative/Encouraging)": "Feedback Style",
  "Diagnostic Questioning": "Diagnostic Quest.",
  "Motivation Style (Autonomy-Supportive vs Controlled)": "Motivation Style",
  "Cognitive Flexibility": "Cog. Flexibility",
  "Psychological Safety": "Psych. Safety",
  "Patience & Error Tolerance": "Patience",
};

function shortenLabel(label: string): string {
  return SHORT_LABELS[label] || label;
}

interface LearningRadarProps {
  data: LearningPattern[];
  color?: string;
  label?: string;
  size?: "sm" | "md" | "lg";
}

export default function LearningRadar({
  data,
  color = "#059669",
  label = "Learning",
  size = "md",
}: LearningRadarProps) {
  const [mounted, setMounted] = useState(false);
  const heights = { sm: 200, md: 300, lg: 400 };

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className="w-full flex items-center justify-center bg-gray-50 rounded-lg"
        style={{ height: heights[size] }}
      >
        <div className="animate-pulse text-gray-400">Loading chart...</div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div
        className="w-full flex items-center justify-center bg-gray-50 rounded-lg"
        style={{ height: heights[size] }}
      >
        <p className="text-gray-400 text-sm">No data available</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={heights[size]}>
      <RadarChart data={data} cx="50%" cy="50%" outerRadius="72%">
        <PolarGrid stroke="#e2e8f0" />
        <PolarAngleAxis
          dataKey="subject"
          tickFormatter={shortenLabel}
          tick={{ fontSize: size === "sm" ? 9 : 11, fill: "#64748b" }}
        />
        <PolarRadiusAxis
          angle={30}
          domain={[0, 100]}
          tick={{ fontSize: 9, fill: "#94a3b8" }}
          axisLine={false}
        />
        <Radar
          name={label}
          dataKey="score"
          stroke={color}
          fill={color}
          fillOpacity={0.25}
          strokeWidth={2}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "white",
            border: "1px solid #e2e8f0",
            borderRadius: "8px",
            fontSize: "12px",
          }}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}
