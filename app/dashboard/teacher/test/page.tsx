"use client";

import Link from "next/link";
import TeacherNav from "@/components/dashboard/TeacherNav";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Clock, ArrowRight, GraduationCap, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { demoTeacherTests } from "@/mock/demo-data";

export default function TeacherTestPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <TeacherNav />
      <div className="p-4 sm:p-6 lg:p-8 pt-20 pb-24 md:pb-8 max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-serif">
            Assessments & Training
          </h1>
          <p className="text-slate-500 mt-1">Discover and develop your teaching style</p>
        </div>

        {/* Teaching Style Assessment CTA */}
        <Card className="border-0 shadow-md mb-8 bg-gradient-to-r from-emerald-50 via-teal-50 to-green-50 overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
                  <GraduationCap className="w-7 h-7 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-slate-900 text-lg">Teaching Style Profile</h3>
                    <Sparkles className="w-4 h-4 text-amber-500" />
                  </div>
                  <p className="text-sm text-slate-600">
                    Map your teaching approach across 8 dimensions — 7 quick scenarios, ~2 minutes
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    AI-powered profiling to match you with compatible students
                  </p>
                </div>
              </div>
              <Link href="/dashboard/teacher/test/assessment">
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full px-6 shadow-lg">
                  Start Assessment <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Past results */}
        <h2 className="text-lg font-semibold text-slate-900 mb-4 font-serif">Past Results</h2>
        <div className="space-y-3">
          {demoTeacherTests.map((test) => (
            <Card key={test.id} className="border-0 shadow-sm">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">{test.subject}</p>
                    <p className="text-xs text-slate-500">
                      {test.correctAnswers}/{test.totalQuestions} correct &middot; {test.date}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1 text-slate-500">
                    <Clock className="w-3.5 h-3.5" />
                    <span className="text-xs">{test.timeTaken}m</span>
                  </div>
                  <div className={`text-lg font-bold ${test.score >= 80 ? "text-emerald-600" : test.score >= 60 ? "text-amber-600" : "text-red-500"}`}>
                    {test.score}%
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
