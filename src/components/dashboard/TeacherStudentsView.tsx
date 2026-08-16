"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";
import LearningRadar from "./LearningRadar";
import FitScoreBadge from "./FitScoreBadge";
import { teacherAPI, ConnectedStudent } from "@/lib/api";

interface LearningPattern {
  subject: string;
  score: number;
}

const S_PARAM_LABELS = ["Attention", "Working Memory", "Feedback Sensitivity", "Motivation", "Abstraction", "Dev. Stage", "Persistence"];

function studentToPattern(scores: Record<string, number | null>): LearningPattern[] {
  return S_PARAM_LABELS.map((label, i) => ({
    subject: label,
    score: Math.round((scores[`s${i + 1}`] ?? 0.5) * 100),
  }));
}

export default function TeacherStudentsView() {
  const [students, setStudents] = useState<ConnectedStudent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    teacherAPI.getMyStudents()
      .then(res => {
        setStudents(res.data);
      })
      .catch(() => {
        setStudents([]);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 pt-20 max-w-7xl mx-auto">
        <div className="flex items-center justify-center pt-16">
          <p className="text-slate-400 text-lg">Loading...</p>
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
          <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500 text-base">No students connected yet.</p>
          <p className="text-slate-400 text-sm mt-1">Students will appear here once they match with you.</p>
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
