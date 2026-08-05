"use client";

import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { LearningPattern } from "@/mock/demo-data";

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
  const heights = { sm: 200, md: 300, lg: 400 };

  return (
    <ResponsiveContainer width="100%" height={heights[size]}>
      <RadarChart data={data} cx="50%" cy="50%" outerRadius="72%">
        <PolarGrid stroke="#e2e8f0" />
        <PolarAngleAxis
          dataKey="subject"
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
