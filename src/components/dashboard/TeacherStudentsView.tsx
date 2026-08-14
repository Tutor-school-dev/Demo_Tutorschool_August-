"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import LearningRadar from "./LearningRadar";
import FitScoreBadge from "./FitScoreBadge";
import { teacherAPI, ConnectedStudent } from "@/lib/api";
import { demoStudents } from "@/mock/demo-data";
import { LearningPattern } from "@/mock/demo-data";

const S_PARAM_LABELS = ["Attention", "Working Memory", "Feedback Sensitivity", "Motivation", "Abstraction", "Dev. Stage", "Persistence"];

function studentToPattern(scores: Record<string, number | null>): LearningPattern[] {
  return S_PARAM_LABELS.map((label, i) => ({
    subject: label,
    score: Math.round((scores[`s${i + 1}`] ?? 0.5) * 100),
  }));
}

export default function TeacherStudentsView() {
  const [students, setStudents] = useState<ConnectedStudent[]>([]);
  const [useFallback, setUseFallback] = useState(false);

  useEffect(() => {
    teacherAPI.getMyStudents()
      .then(res => {
        if (res.data.length > 0) {
          setStudents(res.data);
        } else {
          setUseFallback(true);
        }
      })
      .catch(() => setUseFallback(true));
  }, []);

  if (useFallback) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 pt-20 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-serif">
            Your Students
          </h1>
          <p className="text-slate-500 mt-1">
            Learning profiles and progress of all connected students
          </p>
        </div>
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {demoStudents.map((student) => (
            <Card key={student.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                      <span className="text-sm font-bold text-emerald-700">{student.avatar}</span>
                    </div>
                    <div>
                      <CardTitle className="text-base">{student.name}</CardTitle>
                      <p className="text-xs text-slate-500">
                        {student.grade} &middot; {student.board}
                      </p>
                    </div>
                  </div>
                  <FitScoreBadge score={student.fitScore} size="sm" />
                </div>
              </CardHeader>
              <CardContent>
                <LearningRadar data={student.learningPattern} size="sm" color="#059669" />
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {student.subjects.map((subj) => (
                    <Badge key={subj} variant="secondary" className="bg-gray-100 text-gray-600 text-xs border-0">
                      {subj}
                    </Badge>
                  ))}
                </div>
                <div className="grid grid-cols-3 gap-2 mt-4 text-center">
                  <div className="bg-gray-50 rounded-lg p-2">
                    <p className="text-sm font-bold text-slate-900">{student.sessionsCompleted}</p>
                    <p className="text-[10px] text-slate-500">Sessions</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2">
                    <p className="text-sm font-bold text-slate-900">{student.averageScore}%</p>
                    <p className="text-[10px] text-slate-500">Avg Score</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2">
                    <p className="text-sm font-bold text-slate-900">{student.streak}</p>
                    <p className="text-[10px] text-slate-500">Streak</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 pt-20 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-serif">
          Your Students
        </h1>
        <p className="text-slate-500 mt-1">
          Learning profiles and progress of all connected students
        </p>
      </div>

      {students.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-slate-400 text-lg">Loading students...</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {students.map((student) => (
            <Card key={student.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                      <span className="text-sm font-bold text-emerald-700">
                        {student.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                      </span>
                    </div>
                    <div>
                      <CardTitle className="text-base">{student.name}</CardTitle>
                      <p className="text-xs text-slate-500">
                        {student.grade_level ? `Class ${student.grade_level}` : ""}
                      </p>
                    </div>
                  </div>
                  <FitScoreBadge score={Math.round((student.compatibility_score / 5.5) * 100)} size="sm" />
                </div>
              </CardHeader>
              <CardContent>
                <LearningRadar data={studentToPattern(student.scores)} size="sm" color="#059669" />
                <div className="grid grid-cols-2 gap-2 mt-4 text-center">
                  <div className="bg-gray-50 rounded-lg p-2">
                    <p className="text-sm font-bold text-slate-900">{student.sessions_completed}</p>
                    <p className="text-[10px] text-slate-500">Sessions</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2">
                    <p className="text-sm font-bold text-slate-900">
                      {Math.round((student.compatibility_score / 5.5) * 100)}%
                    </p>
                    <p className="text-[10px] text-slate-500">Fit Score</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
