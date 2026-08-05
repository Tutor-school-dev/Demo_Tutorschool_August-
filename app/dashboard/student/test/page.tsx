"use client";

import Link from "next/link";
import StudentNav from "@/components/dashboard/StudentNav";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Clock, ArrowRight, Brain, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { demoTests } from "@/mock/demo-data";

export default function TestPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <StudentNav />
      <div className="p-4 sm:p-6 lg:p-8 pt-20 pb-24 md:pb-8 max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-serif">
            Tests & Assessments
          </h1>
          <p className="text-slate-500 mt-1">Track your progress through practice tests</p>
        </div>

        {/* Cognitive Assessment CTA */}
        <Card className="border-0 shadow-md mb-8 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                  <Brain className="w-7 h-7 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-slate-900 text-lg">Cognitive Learning Fingerprint</h3>
                    <Sparkles className="w-4 h-4 text-amber-500" />
                  </div>
                  <p className="text-sm text-slate-600">
                    Discover how your brain learns best — 5 quick tasks, ~90 seconds
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    AI-powered assessment to find your perfect tutor match
                  </p>
                </div>
              </div>
              <Link href="/dashboard/student/test/assessment">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full px-6 shadow-lg">
                  Start Assessment <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Available test */}
        <Card className="border-0 shadow-sm mb-8 bg-gradient-to-r from-emerald-50 to-white">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                <FileText className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Practice Test Available</h3>
                <p className="text-sm text-slate-500">Mathematics — 20 questions — 30 mins</p>
              </div>
            </div>
            <Button className="bg-emerald-600 hover:bg-emerald-700 rounded-full">
              Start Test <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </CardContent>
        </Card>

        {/* Past test results */}
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Past Results</h2>
        <div className="space-y-3">
          {demoTests.map((test) => (
            <Card key={test.id} className="border-0 shadow-sm">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-violet-100 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-violet-600" />
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
                  <div
                    className={`text-lg font-bold ${
                      test.score >= 80 ? "text-emerald-600" : test.score >= 60 ? "text-amber-600" : "text-red-500"
                    }`}
                  >
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
