"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import StudentNav from "@/components/dashboard/StudentNav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import LearningRadar from "@/components/dashboard/LearningRadar";
import { ClipboardList } from "lucide-react";
import {
  studentAPI,
  authAPI,
  type StudentProfileResponse,
  type UserResponse,
} from "@/lib/api";

interface LearningPattern {
  subject: string;
  score: number;
}

const S_PARAM_LABELS: Record<string, string> = {
  s1_attention_stability: "Attention & Focus",
  s2_working_memory: "Working Memory",
  s3_feedback_sensitivity: "Feedback Sensitivity",
  s4_motivation: "Motivation",
  s5_abstraction: "Abstraction",
  s6_developmental_stage: "Dev. Stage",
  s7_persistence: "Persistence",
};

function scoresToPattern(scores: StudentProfileResponse["scores"]): LearningPattern[] {
  const entries = Object.entries(scores).filter(
    ([, v]) => v !== null
  ) as [string, { point_estimate: number }][];
  return entries.map(([key, triple]) => ({
    subject: S_PARAM_LABELS[key] || key,
    score: Math.round(triple.point_estimate * 100),
  }));
}

export default function StudentProfilePage() {
  const [profile, setProfile] = useState<StudentProfileResponse | null>(null);
  const [user, setUser] = useState<UserResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [profileRes, userRes] = await Promise.all([
          studentAPI.getProfile(),
          authAPI.me(),
        ]);
        setProfile(profileRes.data);
        setUser(userRes.data);
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
      <div className="min-h-screen bg-gray-50">
        <StudentNav />
        <div className="p-4 sm:p-6 lg:p-8 pt-20 pb-24 md:pb-8 max-w-5xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-32 bg-slate-200 rounded-lg" />
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="h-64 bg-slate-200 rounded-lg" />
              <div className="h-64 bg-slate-200 rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const learningPattern = profile ? scoresToPattern(profile.scores) : [];
  const hasScores = learningPattern.length > 0;

  if (!hasScores) {
    return (
      <div className="min-h-screen bg-gray-50">
        <StudentNav />
        <div className="p-4 sm:p-6 lg:p-8 pt-20 pb-24 md:pb-8 max-w-5xl mx-auto">
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-6">
              <ClipboardList className="w-8 h-8 text-emerald-600" />
            </div>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">
              Complete your assessment to see your profile
            </h2>
            <p className="text-slate-500 mb-6 max-w-md">
              Take the cognitive assessment to generate your learning pattern and unlock your full profile.
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
    );
  }

  const studentName = user?.full_name || localStorage.getItem("name") || "Student";
  const studentEmail = user?.email || localStorage.getItem("email") || "";
  const gradeLabel = profile?.grade_level ? `Class ${profile.grade_level}` : "Student";
  const initials = studentName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="min-h-screen bg-gray-50">
      <StudentNav />
      <div className="p-4 sm:p-6 lg:p-8 pt-20 pb-24 md:pb-8 max-w-5xl mx-auto">
        {/* Profile header */}
        <Card className="border-0 shadow-sm mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
              <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center">
                <span className="text-2xl font-bold text-emerald-700">{initials}</span>
              </div>
              <div className="text-center sm:text-left flex-1">
                <h1 className="text-2xl font-bold text-slate-900">{studentName}</h1>
                <p className="text-slate-500 mt-0.5">{studentEmail}</p>
                <div className="flex flex-wrap gap-2 mt-3 justify-center sm:justify-start">
                  <Badge className="bg-emerald-50 text-emerald-700 border-0">{gradeLabel}</Badge>
                  <Badge className="bg-violet-50 text-violet-700 border-0">CBSE</Badge>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xl font-bold text-slate-900">0</p>
                  <p className="text-xs text-slate-500">Sessions</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xl font-bold text-slate-900">--</p>
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
              <LearningRadar data={learningPattern} size="lg" />
            </CardContent>
          </Card>

          {/* Dimension breakdown */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Dimension Scores</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {learningPattern.map((dim) => (
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
