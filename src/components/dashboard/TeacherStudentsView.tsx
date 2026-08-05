"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import LearningRadar from "./LearningRadar";
import FitScoreBadge from "./FitScoreBadge";
import { demoStudents } from "@/mock/demo-data";

export default function TeacherStudentsView() {
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
