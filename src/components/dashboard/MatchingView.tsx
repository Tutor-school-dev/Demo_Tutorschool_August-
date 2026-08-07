"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import RadarCompare from "./RadarCompare";
import FitScoreBadge from "./FitScoreBadge";
import {
  demoStudents,
  demoTeachers,
  calculateFitScore,
  getMatchBreakdown,
} from "@/mock/demo-data";

export default function MatchingView() {
  const [selectedStudentId, setSelectedStudentId] = useState(demoStudents[0].id);
  const selectedStudent = demoStudents.find((s) => s.id === selectedStudentId)!;

  const rankedTeachers = demoTeachers
    .map((teacher) => ({
      ...teacher,
      fitScore: calculateFitScore(selectedStudent.learningPattern, teacher.teachingPattern),
      breakdown: getMatchBreakdown(selectedStudent.learningPattern, teacher.teachingPattern),
    }))
    .sort((a, b) => b.fitScore - a.fitScore);

  const selectedTeacher = rankedTeachers[0];

  return (
    <div className="p-4 sm:p-6 lg:p-8 pt-20 pb-24 md:pb-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-serif">
          Smart Matching
        </h1>
        <p className="text-slate-500 mt-1">
          Find the perfect tutor based on learning pattern compatibility
        </p>
      </div>

      {/* Student selector */}
      <div className="mb-6">
        <label className="text-sm font-medium text-slate-700 mb-2 block">Select Student</label>
        <div className="flex flex-wrap gap-2">
          {demoStudents.map((s) => (
            <button
              key={s.id}
              onClick={() => setSelectedStudentId(s.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedStudentId === s.id
                  ? "bg-emerald-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {s.name}
            </button>
          ))}
        </div>
      </div>

      {/* Radar comparison */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Pattern Comparison</CardTitle>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-sm text-slate-600">{selectedStudent.name} vs {selectedTeacher.name}</span>
            <FitScoreBadge score={selectedTeacher.fitScore} size="sm" />
          </div>
        </CardHeader>
        <CardContent>
          <RadarCompare
            studentData={selectedStudent.learningPattern}
            teacherData={selectedTeacher.teachingPattern}
            studentName={selectedStudent.name}
            teacherName={selectedTeacher.name}
          />
          {/* Breakdown */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-4">
            {selectedTeacher.breakdown.map((item) => (
              <div key={item.dimension} className="bg-gray-50 rounded-lg p-3">
                <p className="text-[10px] text-slate-500 mb-1">{item.dimension}</p>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${item.overlap}%`,
                      backgroundColor: item.overlap >= 85 ? "#059669" : item.overlap >= 70 ? "#d97706" : "#dc2626",
                    }}
                  />
                </div>
                <p className="text-xs font-medium mt-1" style={{
                  color: item.overlap >= 85 ? "#059669" : item.overlap >= 70 ? "#d97706" : "#dc2626",
                }}>
                  {item.overlap}%
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
