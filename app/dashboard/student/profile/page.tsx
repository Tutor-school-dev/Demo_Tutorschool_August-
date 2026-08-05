"use client";

import StudentNav from "@/components/dashboard/StudentNav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import LearningRadar from "@/components/dashboard/LearningRadar";
import { demoStudents } from "@/mock/demo-data";

export default function StudentProfilePage() {
  const student = demoStudents[0];

  return (
    <div className="min-h-screen bg-gray-50">
      <StudentNav />
      <div className="p-4 sm:p-6 lg:p-8 pt-20 pb-24 md:pb-8 max-w-5xl mx-auto">
        {/* Profile header */}
        <Card className="border-0 shadow-sm mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
              <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center">
                <span className="text-2xl font-bold text-emerald-700">{student.avatar}</span>
              </div>
              <div className="text-center sm:text-left flex-1">
                <h1 className="text-2xl font-bold text-slate-900">{student.name}</h1>
                <p className="text-slate-500 mt-0.5">{student.email}</p>
                <div className="flex flex-wrap gap-2 mt-3 justify-center sm:justify-start">
                  <Badge className="bg-emerald-50 text-emerald-700 border-0">{student.grade}</Badge>
                  <Badge className="bg-violet-50 text-violet-700 border-0">{student.board}</Badge>
                  {student.subjects.map((subj) => (
                    <Badge key={subj} variant="secondary" className="bg-gray-100 text-gray-600 border-0">
                      {subj}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xl font-bold text-slate-900">{student.sessionsCompleted}</p>
                  <p className="text-xs text-slate-500">Sessions</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xl font-bold text-slate-900">{student.averageScore}%</p>
                  <p className="text-xs text-slate-500">Avg Score</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Learning Pattern */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Learning Pattern</CardTitle>
            </CardHeader>
            <CardContent>
              <LearningRadar data={student.learningPattern} size="lg" />
            </CardContent>
          </Card>

          {/* Dimension breakdown */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Dimension Scores</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {student.learningPattern.map((dim) => (
                <div key={dim.subject}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-slate-700">{dim.subject}</span>
                    <span className="text-sm font-bold text-slate-900">{dim.score}/100</span>
                  </div>
                  <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${dim.score}%`,
                        backgroundColor: dim.score >= 85 ? "#059669" : dim.score >= 70 ? "#d97706" : "#6366f1",
                      }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
