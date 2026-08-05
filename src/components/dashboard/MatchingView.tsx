"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Users } from "lucide-react";
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

  const [selectedTeacherId, setSelectedTeacherId] = useState(rankedTeachers[0].id);
  const selectedTeacher = rankedTeachers.find((t) => t.id === selectedTeacherId)!;

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
              onClick={() => {
                setSelectedStudentId(s.id);
                const newRanked = demoTeachers
                  .map((t) => ({
                    ...t,
                    fitScore: calculateFitScore(s.learningPattern, t.teachingPattern),
                  }))
                  .sort((a, b) => b.fitScore - a.fitScore);
                setSelectedTeacherId(newRanked[0].id);
              }}
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

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Radar comparison */}
        <Card className="lg:col-span-2 border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Pattern Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <RadarCompare
              studentData={selectedStudent.learningPattern}
              teacherData={selectedTeacher.teachingPattern}
              studentName={selectedStudent.name}
              teacherName={selectedTeacher.name}
            />
            {/* Breakdown */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
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

        {/* Ranked teachers */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Ranked Tutors</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {rankedTeachers.map((teacher, idx) => (
              <button
                key={teacher.id}
                onClick={() => setSelectedTeacherId(teacher.id)}
                className={`w-full text-left p-3 rounded-xl transition-all ${
                  selectedTeacherId === teacher.id
                    ? "bg-emerald-50 ring-2 ring-emerald-200"
                    : "bg-gray-50 hover:bg-gray-100"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center">
                      <span className="text-sm font-bold text-violet-700">{teacher.avatar}</span>
                    </div>
                    {idx === 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-amber-400 rounded-full flex items-center justify-center text-[9px] font-bold text-white">
                        1
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900 truncate">{teacher.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <div className="flex items-center gap-0.5">
                        <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                        <span className="text-xs text-slate-600">{teacher.rating}</span>
                      </div>
                      <div className="flex items-center gap-0.5">
                        <Users className="w-3 h-3 text-slate-400" />
                        <span className="text-xs text-slate-500">{teacher.totalStudents}</span>
                      </div>
                    </div>
                  </div>
                  <FitScoreBadge score={teacher.fitScore} size="sm" />
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {teacher.subjects.slice(0, 2).map((subj) => (
                    <Badge key={subj} variant="secondary" className="bg-white text-gray-600 text-[10px] border-0">
                      {subj}
                    </Badge>
                  ))}
                </div>
              </button>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
