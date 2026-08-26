"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Trophy, Flame, Target, ClipboardList } from "lucide-react";
import LearningRadar from "./LearningRadar";
import FitScoreBadge from "./FitScoreBadge";
import {
  studentAPI,
  matchingAPI,
  type StudentProfileResponse,
  type MatchResultAPI,
} from "@/lib/api";

interface LearningPattern {
  subject: string;
  score: number;
}

const S_PARAM_LABELS: Record<string, string> = {
  s1_attention_stability: "Attention & Focus Stability",
  s2_working_memory: "Working Memory & Retention",
  s3_feedback_sensitivity: "Feedback Sensitivity",
  s4_motivation: "Motivation & Drive",
  s5_abstraction: "Abstraction & Pattern Recognition",
  s6_developmental_stage: "Developmental Stage",
  s7_persistence: "Persistence & Grit",
};

function scoresToLearningPattern(scores: StudentProfileResponse["scores"]): LearningPattern[] {
  const entries = Object.entries(scores).filter(
    ([, v]) => v !== null
  ) as [string, { point_estimate: number }][];
  return entries.map(([key, triple]) => ({
    subject: S_PARAM_LABELS[key] || key,
    score: Math.round(triple.point_estimate * 100),
  }));
}

export default function StudentDashboard() {
  const [profile, setProfile] = useState<StudentProfileResponse | null>(null);
  const [topMatch, setTopMatch] = useState<MatchResultAPI | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (localStorage.getItem("demo_mode") === "true") {
        const stored = localStorage.getItem("assessment_scores");
        if (stored) {
          const scores = JSON.parse(stored);
          const mockProfile: StudentProfileResponse = {
            id: "demo",
            user_id: "demo",
            grade_level: 5,
            school: null,
            subjects: null,
            learning_goals: null,
            scores: {
              s1_attention_stability: scores.ATT ? { point_estimate: scores.ATT.score, confidence: scores.ATT.confidence, observations: scores.ATT.observations } : null,
              s2_working_memory: scores.WM ? { point_estimate: scores.WM.score, confidence: scores.WM.confidence, observations: scores.WM.observations } : null,
              s3_feedback_sensitivity: scores.FB ? { point_estimate: scores.FB.score, confidence: scores.FB.confidence, observations: scores.FB.observations } : null,
              s4_motivation: scores.STR ? { point_estimate: scores.STR.score, confidence: scores.STR.confidence, observations: scores.STR.observations } : null,
              s5_abstraction: scores.ABS ? { point_estimate: scores.ABS.score, confidence: scores.ABS.confidence, observations: scores.ABS.observations } : null,
              s6_developmental_stage: scores.PER ? { point_estimate: scores.PER.score, confidence: scores.PER.confidence, observations: scores.PER.observations } : null,
              s7_persistence: scores.PAC ? { point_estimate: scores.PAC.score, confidence: scores.PAC.confidence, observations: scores.PAC.observations } : null,
            },
          };
          setProfile(mockProfile);
          setTopMatch({
            teacher_id: "demo-teacher",
            teacher_name: "Ms. Priya Sharma",
            compatibility_score: 0.87,
            match_confidence: 0.82,
            offer_probability: 0.9,
            exploration_flag: false,
            rank: 1,
            breakdown: {},
          });
        }
        setLoading(false);
        return;
      }
      try {
        const [profileRes, matchRes] = await Promise.all([
          studentAPI.getProfile(),
          matchingAPI.compute(3),
        ]);
        setProfile(profileRes.data);
        if (matchRes.data.matches.length > 0) {
          setTopMatch(matchRes.data.matches[0]);
        }
      } catch {
        // API failed — will show empty state
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 pt-20 pb-24 md:pb-8 max-w-7xl mx-auto">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-slate-200 rounded w-64" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-20 bg-slate-200 rounded-lg" />
            ))}
          </div>
          <div className="h-64 bg-slate-200 rounded-lg" />
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 pt-20 pb-24 md:pb-8 max-w-7xl mx-auto">
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-6">
            <ClipboardList className="w-8 h-8 text-emerald-600" />
          </div>
          <h2 className="text-xl font-semibold text-slate-900 mb-2">
            Complete your cognitive assessment to unlock your dashboard
          </h2>
          <p className="text-slate-500 mb-6 max-w-md">
            Take a quick assessment so we can build your personalized learning profile and match you with the best tutors.
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

  const studentName = localStorage.getItem("name") || "Student";
  const studentGrade = `Class ${profile.grade_level || 10}`;
  const learningPattern = scoresToLearningPattern(profile.scores);
  const fitScore = topMatch
    ? Math.round((topMatch.compatibility_score / 5.5) * 100)
    : 0;
  const matchedTeacherName = topMatch ? topMatch.teacher_name : null;

  return (
    <div className="p-4 sm:p-6 lg:p-8 pt-20 pb-24 md:pb-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-serif">
          Welcome back, {studentName.split(" ")[0]}!
        </h1>
        <p className="text-slate-500 mt-1">
          {studentGrade} &middot; CBSE
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">0</p>
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
              <p className="text-2xl font-bold text-slate-900">0</p>
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
              <p className="text-2xl font-bold text-slate-900">--</p>
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
              <p className="text-2xl font-bold text-slate-900">0 days</p>
              <p className="text-xs text-slate-500">Streak</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Your Learning Pattern</CardTitle>
          </CardHeader>
          <CardContent>
            <LearningRadar data={learningPattern} size="lg" />
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Your Matched Tutor</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center text-center gap-4">
            {matchedTeacherName ? (
              <>
                <FitScoreBadge score={fitScore} size="lg" />
                <p className="text-xs text-slate-500 -mt-2">Fit Score</p>
                <div className="w-14 h-14 bg-violet-100 rounded-full flex items-center justify-center">
                  <span className="text-lg font-bold text-violet-700">
                    {matchedTeacherName
                      .split(" ")
                      .map((w) => w[0])
                      .join("")
                      .slice(0, 2)}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-slate-900">{matchedTeacherName}</p>
                </div>
              </>
            ) : (
              <div className="py-6">
                <p className="text-sm text-slate-500">No match yet. Complete your assessment to get paired.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6 border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Recent Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="py-8 text-center">
            <p className="text-sm text-slate-500">No sessions yet</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
