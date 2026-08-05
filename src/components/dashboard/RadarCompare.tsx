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
import { LearningPattern } from "@/mock/demo-data";

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
