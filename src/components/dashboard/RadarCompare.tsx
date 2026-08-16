"use client";

import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Legend,
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

interface RadarCompareProps {
  studentData: LearningPattern[];
  teacherData: LearningPattern[];
  studentName: string;
  teacherName: string;
}

export default function RadarCompare({
  studentData,
  teacherData,
  studentName,
  teacherName,
}: RadarCompareProps) {
  const mergedData = studentData.map((s, i) => ({
    subject: s.subject,
    student: s.score,
    teacher: teacherData[i].score,
  }));

  return (
    <ResponsiveContainer width="100%" height={350}>
      <RadarChart data={mergedData} cx="50%" cy="50%" outerRadius="68%">
        <PolarGrid stroke="#e2e8f0" />
        <PolarAngleAxis
          dataKey="subject"
          tickFormatter={shortenLabel}
          tick={{ fontSize: 10, fill: "#64748b" }}
        />
        <PolarRadiusAxis
          angle={30}
          domain={[0, 100]}
          tick={{ fontSize: 9, fill: "#94a3b8" }}
          axisLine={false}
        />
        <Radar
          name={studentName}
          dataKey="student"
          stroke="#059669"
          fill="#059669"
          fillOpacity={0.2}
          strokeWidth={2}
        />
        <Radar
          name={teacherName}
          dataKey="teacher"
          stroke="#7c3aed"
          fill="#7c3aed"
          fillOpacity={0.15}
          strokeWidth={2}
          strokeDasharray="4 4"
        />
        <Legend
          wrapperStyle={{ fontSize: "12px", paddingTop: "12px" }}
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
