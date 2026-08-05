"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Users, ArrowRight, Sparkles } from "lucide-react";
import RadarCompare from "./RadarCompare";
import FitScoreBadge from "./FitScoreBadge";
import LearningRadar from "./LearningRadar";
import {
  demoTeachers,
  calculateFitScore,
  getMatchBreakdown,
  LearningPattern,
  DIMENSIONS,
} from "@/mock/demo-data";

export default function MatchingEngine() {
  const [step, setStep] = useState<"input" | "results">("input");
  const [scores, setScores] = useState<number[]>([70, 70, 70, 70, 70, 70]);

  const learningPattern: LearningPattern[] = DIMENSIONS.map((dim, i) => ({
    subject: dim,
    score: scores[i],
  }));

  const rankedTeachers = demoTeachers
    .map((teacher) => ({
      ...teacher,
      fitScore: calculateFitScore(learningPattern, teacher.teachingPattern),
      breakdown: getMatchBreakdown(learningPattern, teacher.teachingPattern),
    }))
    .sort((a, b) => b.fitScore - a.fitScore);

  const [selectedTeacherId, setSelectedTeacherId] = useState<string | null>(null);
  const selectedTeacher = selectedTeacherId
    ? rankedTeachers.find((t) => t.id === selectedTeacherId)
    : rankedTeachers[0];

  if (step === "input") {
    return (
      <div className="p-4 sm:p-6 lg:p-8 pt-20 pb-24 md:pb-8 max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            AI-Powered Matching
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 font-serif">
            Find Your Perfect Tutor
          </h1>
          <p className="text-slate-500 mt-2 max-w-lg mx-auto">
            Rate yourself on each learning dimension and we&apos;ll match you with the tutor
            whose teaching style fits your learning pattern best.
          </p>
        </div>

        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Rate Your Learning Style</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-5">
                {DIMENSIONS.map((dim, i) => (
                  <div key={dim}>
                    <div className="flex justify-between mb-1.5">
                      <label className="text-sm font-medium text-slate-700">{dim}</label>
                      <span className="text-sm font-bold text-emerald-600">{scores[i]}</span>
                    </div>
                    <input
                      type="range"
                      min={20}
                      max={100}
                      value={scores[i]}
                      onChange={(e) => {
                        const newScores = [...scores];
                        newScores[i] = parseInt(e.target.value);
                        setScores(newScores);
                      }}
                      className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-emerald-600"
                    />
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-center">
                <LearningRadar data={learningPattern} size="md" />
              </div>
            </div>
            <div className="mt-8 flex justify-center">
              <Button
                onClick={() => {
                  setStep("results");
                  setSelectedTeacherId(null);
                }}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-full text-base"
              >
                Find My Match
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 pt-20 pb-24 md:pb-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-serif">
            Your Matches
          </h1>
          <p className="text-slate-500 mt-1">Tutors ranked by learning pattern compatibility</p>
        </div>
        <Button
          variant="outline"
          onClick={() => setStep("input")}
          className="rounded-full"
        >
          Adjust Pattern
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Comparison chart */}
        <Card className="lg:col-span-2 border-0 shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Pattern Overlap</CardTitle>
              {selectedTeacher && (
                <FitScoreBadge score={selectedTeacher.fitScore} size="md" />
              )}
            </div>
          </CardHeader>
          <CardContent>
            {selectedTeacher && (
              <>
                <RadarCompare
                  studentData={learningPattern}
                  teacherData={selectedTeacher.teachingPattern}
                  studentName="You"
                  teacherName={selectedTeacher.name}
                />
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
              </>
            )}
          </CardContent>
        </Card>

        {/* Teacher ranking */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Best Matches</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {rankedTeachers.map((teacher, idx) => (
              <button
                key={teacher.id}
                onClick={() => setSelectedTeacherId(teacher.id)}
                className={`w-full text-left p-3 rounded-xl transition-all ${
                  (selectedTeacherId || rankedTeachers[0].id) === teacher.id
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
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                      <span className="text-xs text-slate-600">{teacher.rating}</span>
                      <Users className="w-3 h-3 text-slate-400" />
                      <span className="text-xs text-slate-500">{teacher.totalStudents}</span>
                    </div>
                  </div>
                  <FitScoreBadge score={teacher.fitScore} size="sm" />
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {teacher.subjects.map((subj) => (
                    <Badge key={subj} variant="secondary" className="bg-white text-gray-600 text-[10px] border-0">
                      {subj}
                    </Badge>
                  ))}
                  <Badge variant="secondary" className="bg-white text-gray-600 text-[10px] border-0">
                    ₹{teacher.lessonPrice}/hr
                  </Badge>
                </div>
              </button>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
