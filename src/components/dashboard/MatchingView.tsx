"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClipboardList } from "lucide-react";
import RadarCompare from "./RadarCompare";
import FitScoreBadge from "./FitScoreBadge";
import { matchingAPI, type MatchResultAPI } from "@/lib/api";

interface LearningPattern {
  subject: string;
  score: number;
}

const S_LABELS = ["Attention", "Working Memory", "Feedback Sens.", "Motivation", "Abstraction", "Dev. Stage", "Persistence"];

interface RankedMatch {
  id: string;
  name: string;
  fitScore: number;
  teachingPattern: LearningPattern[];
  breakdown: { dimension: string; overlap: number }[];
}

export default function MatchingView() {
  const [matches, setMatches] = useState<RankedMatch[]>([]);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [studentPattern, setStudentPattern] = useState<LearningPattern[]>([]);
  const [useFallback, setUseFallback] = useState(false);

  useEffect(() => {
    matchingAPI.compute(5)
      .then(res => {
        const data = res.data;
        if (!data.matches || data.matches.length === 0) {
          setUseFallback(true);
          return;
        }

        const sPattern = S_LABELS.map((label, i) => {
          const key = `s${i + 1}`;
          const first = data.matches[0];
          const breakdown = first.breakdown || {};
          const keys = Object.keys(breakdown).filter(k => k.startsWith(key));
          const sVal = keys.length > 0 ? (breakdown[keys[0]]?.s_value ?? 0.5) : 0.5;
          return { subject: label, score: Math.round(sVal * 100) };
        });
        setStudentPattern(sPattern);

        const ranked: RankedMatch[] = data.matches.map((m: MatchResultAPI) => {
          const tPattern = S_LABELS.map((label, i) => {
            const key = `s${i + 1}`;
            const keys = Object.keys(m.breakdown || {}).filter(k => k.startsWith(key));
            const tVal = keys.length > 0 ? (m.breakdown[keys[0]]?.t_value ?? 0.5) : 0.5;
            return { subject: label, score: Math.round(tVal * 100) };
          });

          const breakdown = Object.entries(m.breakdown || {}).map(([k, v]) => ({
            dimension: k.replace(/_/g, " "),
            overlap: Math.round((v.contribution / (m.compatibility_score || 1)) * 100),
          })).slice(0, 6);

          return {
            id: m.teacher_id,
            name: m.teacher_name,
            fitScore: Math.round((m.compatibility_score / 5.5) * 100),
            teachingPattern: tPattern,
            breakdown,
          };
        });
        setMatches(ranked);
      })
      .catch(() => setUseFallback(true));
  }, []);

  if (useFallback) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 pt-20 pb-24 md:pb-8 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-serif">
            Smart Matching
          </h1>
          <p className="text-slate-500 mt-1">
            Find the perfect tutor based on learning pattern compatibility
          </p>
        </div>
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-6">
            <ClipboardList className="w-8 h-8 text-emerald-600" />
          </div>
          <h2 className="text-xl font-semibold text-slate-900 mb-2">
            Complete your assessment to find tutor matches
          </h2>
          <p className="text-slate-500 mb-6 max-w-md">
            Take the cognitive assessment so our AI can match you with compatible tutors.
          </p>
          <Link
            href="/dashboard/student/test/assessment"
            className="inline-flex items-center px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-full transition-colors"
          >
            Start Assessment
          </Link>
        </div>
      </div>
    );
  }

  if (matches.length === 0) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 pt-20 max-w-7xl mx-auto">
        <p className="text-slate-400 text-center py-16">Computing matches...</p>
      </div>
    );
  }

  const selected = matches[selectedIdx];

  return (
    <div className="p-4 sm:p-6 lg:p-8 pt-20 pb-24 md:pb-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-serif">
          Smart Matching
        </h1>
        <p className="text-slate-500 mt-1">
          Find the perfect tutor based on learning pattern compatibility
        </p>
      </div>

      <div className="mb-6">
        <label className="text-sm font-medium text-slate-700 mb-2 block">Top Matches</label>
        <div className="flex flex-wrap gap-2">
          {matches.map((m, i) => (
            <button
              key={m.id}
              onClick={() => setSelectedIdx(i)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedIdx === i
                  ? "bg-emerald-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {m.name} ({m.fitScore}%)
            </button>
          ))}
        </div>
      </div>

      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Pattern Comparison</CardTitle>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-sm text-slate-600">You vs {selected.name}</span>
            <FitScoreBadge score={selected.fitScore} size="sm" />
          </div>
        </CardHeader>
        <CardContent>
          <RadarCompare
            studentData={studentPattern}
            teacherData={selected.teachingPattern}
            studentName="You"
            teacherName={selected.name}
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-4">
            {selected.breakdown.map((item) => (
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
        </CardContent>
      </Card>
    </div>
  );
}

