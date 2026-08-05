"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, X, Star, CheckCircle, Sparkles } from "lucide-react";
import { demoTeachers } from "@/mock/demo-data";

interface AIMatchResultsProps {
  onClose: () => void;
}

const matchReasons = [
  "Strong alignment with your working memory profile and processing speed. This tutor's structured, step-by-step approach matches your learning style.",
  "Excellent fit for your exploratory nature. This tutor encourages open-ended investigation and creative problem-solving.",
  "Great match for building confidence. This tutor specializes in scaffolded challenges that grow with the learner.",
  "Compatible with your precision-focused learning style. This tutor emphasizes accuracy and systematic approaches.",
];

const AIMatchResults: React.FC<AIMatchResultsProps> = ({ onClose }) => {
  const rankedTeachers = demoTeachers
    .map((teacher, idx) => ({
      teacher,
      score: [92, 87, 81, 76][idx] || 70,
      reasoning: matchReasons[idx] || "Good overall compatibility based on cognitive profile analysis.",
    }))
    .sort((a, b) => b.score - a.score);

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
                  <p className="text-gray-600">Tutors matched to your cognitive learning profile</p>
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
                          <p className="text-sm text-gray-600">{match.teacher.experience} experience</p>
                        </div>
                        <div className={`px-4 py-2 rounded-xl text-white font-bold shadow ${
                          match.score >= 90 ? "bg-gradient-to-r from-emerald-500 to-emerald-700" :
                          match.score >= 80 ? "bg-gradient-to-r from-blue-500 to-blue-700" :
                          "bg-gradient-to-r from-amber-500 to-amber-700"
                        }`}>
                          {match.score}% Match
                        </div>
                      </div>

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
                        <span className="text-sm text-gray-400 ml-2">{match.teacher.totalStudents} students</span>
                      </div>

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
