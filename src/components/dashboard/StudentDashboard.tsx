"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Trophy, Flame, Target, Star } from "lucide-react";
import LearningRadar from "./LearningRadar";
import FitScoreBadge from "./FitScoreBadge";
import { demoStudents, demoTeachers, demoSessions } from "@/mock/demo-data";

export default function StudentDashboard() {
  const student = demoStudents[0];
  const matchedTeacher = demoTeachers.find((t) => t.id === student.matchedTeacherId)!;

  return (
    <div className="p-4 sm:p-6 lg:p-8 pt-20 pb-24 md:pb-8 max-w-7xl mx-auto">
      {/* Welcome header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-serif">
          Welcome back, {student.name.split(" ")[0]}!
        </h1>
        <p className="text-slate-500 mt-1">
          {student.grade} &middot; {student.board} &middot; {student.subjects.join(", ")}
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{student.sessionsCompleted}</p>
              <p className="text-xs text-slate-500">Sessions</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center">
              <Trophy className="w-5 h-5 text-violet-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{student.testsCompleted}</p>
              <p className="text-xs text-slate-500">Tests Done</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
              <Target className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{student.averageScore}%</p>
              <p className="text-xs text-slate-500">Avg Score</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center">
              <Flame className="w-5 h-5 text-rose-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{student.streak} days</p>
              <p className="text-xs text-slate-500">Streak</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Learning Pattern Radar */}
        <Card className="lg:col-span-2 border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Your Learning Pattern</CardTitle>
          </CardHeader>
          <CardContent>
            <LearningRadar data={student.learningPattern} size="lg" />
          </CardContent>
        </Card>

        {/* Matched Teacher Card */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Your Matched Tutor</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center text-center gap-4">
            <FitScoreBadge score={student.fitScore} size="lg" />
            <p className="text-xs text-slate-500 -mt-2">Fit Score</p>
            <div className="w-14 h-14 bg-violet-100 rounded-full flex items-center justify-center">
              <span className="text-lg font-bold text-violet-700">{matchedTeacher.avatar}</span>
            </div>
            <div>
              <p className="font-semibold text-slate-900">{matchedTeacher.name}</p>
              <p className="text-sm text-slate-500">{matchedTeacher.subjects.join(", ")}</p>
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span className="text-sm font-medium">{matchedTeacher.rating}</span>
              <span className="text-xs text-slate-400">({matchedTeacher.totalStudents} students)</span>
            </div>
            <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border-0">
              {matchedTeacher.experience} experience
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Recent Sessions */}
      <Card className="mt-6 border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Recent Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {demoSessions.slice(0, 5).map((session) => (
              <div
                key={session.id}
                className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center">
                    <BookOpen className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">{session.subject}</p>
                    <p className="text-xs text-slate-500">
                      {session.teacherName} &middot; {session.duration} min
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-slate-900">{session.score}%</p>
                  <p className="text-xs text-slate-500">{session.date}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
