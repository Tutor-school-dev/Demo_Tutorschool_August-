"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, X, Star, CheckCircle, Sparkles, Loader2, ClipboardList } from "lucide-react";
import Link from "next/link";
import { matchingAPI, type MatchResultAPI } from "@/lib/api";

interface AIMatchResultsProps {
  onClose: () => void;
}

const C_MAX = 5.5;

function generateInsight(breakdown: Record<string, { contribution: number; inverted: boolean }>): string {
  const sorted = Object.entries(breakdown).sort((a, b) => b[1].contribution - a[1].contribution);
  const top = sorted[0];
  if (!top) return "Good overall compatibility based on cognitive profile analysis.";

  const labels: Record<string, string> = {
    "S1×T1": "attention stability and pacing alignment",
    "S1×T8": "attention pattern and patience",
    "S2×T2": "working memory and scaffolding approach",
    "S3×T3": "feedback sensitivity and teaching style",
    "S4×T5": "motivation profile and questioning technique",
    "S5×T4": "abstraction ability and explanation style",
    "S6×T6": "developmental stage and adaptability",
    "S7×T7": "persistence and psychological safety",
  };

  return `Strong alignment in ${labels[top[0]] || "cognitive profiles"}. This tutor's teaching approach is well-suited to your learning pattern.`;
}

const AIMatchResults: React.FC<AIMatchResultsProps> = ({ onClose }) => {
  const [backendMatches, setBackendMatches] = useState<MatchResultAPI[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMatches() {
      try {
        const res = await matchingAPI.compute(4);
        if (res.data.matches.length > 0) {
          setBackendMatches(res.data.matches);
        }
      } catch {
        // API failed — will show empty state
      } finally {
        setLoading(false);
      }
    }
    fetchMatches();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-3" />
          <p className="text-gray-600">Computing matches from your cognitive profile...</p>
        </div>
      </div>
    );
  }

  if (!backendMatches || backendMatches.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
                    <Brain className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-1">AI-Powered Matches</h2>
                    <p className="text-gray-600">No matches found yet</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full h-10 w-10">
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>
            <div className="p-8">
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-6">
                  <ClipboardList className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  No matches found yet. Complete your assessment to get matched with teachers.
                </h3>
                <p className="text-slate-500 mb-6 max-w-md">
                  Once your cognitive profile is ready, our AI will find the best tutors for your learning style.
                </p>
                <Link
                  href="/dashboard/student/test/assessment"
                  className="inline-flex items-center px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-full transition-colors"
                >
                  Start Assessment
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const rankedTeachers = backendMatches.map((match) => ({
    teacher: {
      id: match.teacher_id,
      name: match.teacher_name,
      avatar: match.teacher_name.split(" ").map(w => w[0]).join("").slice(0, 2),
      subjects: [] as string[],
      experience: "",
      teachingMode: "Both",
      rating: 4.8,
      totalStudents: 0,
    },
    score: Math.round((match.compatibility_score / C_MAX) * 100),
    reasoning: generateInsight(match.breakdown),
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
                  <Brain className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">AI-Powered Matches</h2>
                  <p className="text-gray-600">
                    {"Tutors matched using bilinear compatibility model (C = Sᵀ · M₀ · T)"}
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full h-10 w-10">
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>

          <div className="p-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-full mb-3">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm font-medium">{rankedTeachers.length} Matches Found</span>
              </div>
              <p className="text-gray-600">Based on your cognitive assessment results</p>
            </div>

            <div className="space-y-6">
              {rankedTeachers.map((match, index) => (
                <div
                  key={match.teacher.id}
                  className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all"
                >
                  <div className="flex items-start gap-4">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold">
                        {match.teacher.avatar}
                      </div>
                      <div className="absolute -top-1 -right-1 bg-white rounded-full px-2 py-0.5 text-xs font-bold text-gray-700 shadow border">
                        #{index + 1}
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">{match.teacher.name}</h3>
                          {match.teacher.experience && (
                            <p className="text-sm text-gray-600">{match.teacher.experience} experience</p>
                          )}
                        </div>
                        <div className={`px-4 py-2 rounded-xl text-white font-bold shadow ${
                          match.score >= 90 ? "bg-gradient-to-r from-emerald-500 to-emerald-700" :
                          match.score >= 80 ? "bg-gradient-to-r from-blue-500 to-blue-700" :
                          "bg-gradient-to-r from-amber-500 to-amber-700"
                        }`}>
                          {match.score}% Match
                        </div>
                      </div>

                      {match.teacher.subjects.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3">
                          {match.teacher.subjects.map((subj) => (
                            <Badge key={subj} variant="secondary" className="bg-gray-100 text-gray-700 border-0 text-xs">
                              {subj}
                            </Badge>
                          ))}
                          <Badge variant="outline" className="text-xs">
                            {match.teacher.teachingMode}
                          </Badge>
                        </div>
                      )}

                      {match.teacher.rating > 0 && (
                        <div className="flex items-center gap-1 mb-3">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < Math.floor(match.teacher.rating) ? "text-yellow-500 fill-current" : "text-gray-300"
                              }`}
                            />
                          ))}
                          <span className="text-sm text-gray-600 ml-1">{match.teacher.rating}</span>
                          {match.teacher.totalStudents > 0 && (
                            <span className="text-sm text-gray-400 ml-2">{match.teacher.totalStudents} students</span>
                          )}
                        </div>
                      )}

                      <div className="p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100">
                        <div className="flex items-center gap-2 mb-1">
                          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                          <span className="text-xs font-semibold text-gray-700">AI Match Insight</span>
                        </div>
                        <p className="text-sm text-gray-700">{match.reasoning}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-center mt-8">
              <Button onClick={onClose} size="lg" className="px-8">
                Back to Results
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIMatchResults;
