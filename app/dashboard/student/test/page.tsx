"use client";

import StudentNav from "@/components/dashboard/StudentNav";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Clock, ArrowRight } from "lucide-react";
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
