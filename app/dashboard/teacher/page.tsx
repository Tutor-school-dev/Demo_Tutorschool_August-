"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import TeacherNav from "@/components/dashboard/TeacherNav";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Star, BookOpen, DollarSign, ArrowRight, GraduationCap } from "lucide-react";
import LearningRadar from "@/components/dashboard/LearningRadar";
import { teacherAPI, authAPI, type ConnectedStudent } from "@/lib/api";

interface LearningPattern {
  subject: string;
  score: number;
}

const T_PARAM_LABELS: Record<string, string> = {
  t1_pacing: "Pacing (Mastery-Based)",
  t2_scaffolding: "Scaffolding (Support Calibration)",
  t3_feedback_style: "Feedback Style",
  t4_explanation_style: "Explanation Style",
  t5_questioning: "Diagnostic Questioning",
  t6_adaptability: "Cognitive Flexibility",
  t7_psychological_safety: "Psychological Safety",
  t8_patience: "Patience & Error Tolerance",
};

export default function TeacherDashboardPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [teacherName, setTeacherName] = useState<string>("Teacher");
  const [totalStudents, setTotalStudents] = useState<string>("—");
  const [subjectCount, setSubjectCount] = useState<string>("—");
  const [rating, setRating] = useState<string>("—");
  const [lessonPrice, setLessonPrice] = useState<string>("—");
  const [students, setStudents] = useState<ConnectedStudent[]>([]);
  const [radarData, setRadarData] = useState<LearningPattern[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const meCheck = await authAPI.me();
        if (meCheck.data.role !== "teacher") {
          router.push("/dashboard/student");
          return;
        }
        if (!meCheck.data.onboarding_completed) {
          router.push("/dashboard/teacher/test/assessment");
          return;
        }

        const [profileRes, meRes, studentsRes] = await Promise.allSettled([
          teacherAPI.getProfile(),
          Promise.resolve(meCheck),
          teacherAPI.getMyStudents(),
        ]);

        if (meRes.status === "fulfilled") {
          setTeacherName(meRes.value.data.full_name || "Teacher");
        } else {
          const storedName = localStorage.getItem("name");
          if (storedName) setTeacherName(storedName);
        }

        if (profileRes.status === "fulfilled") {
          const profile = profileRes.value.data as Record<string, unknown>;
          const scores = profile.scores as Record<string, { point_estimate: number } | null> | undefined;
          if (scores) {
            const pattern = Object.entries(scores)
              .filter(([, v]) => v !== null)
              .map(([key, triple]) => ({
                subject: T_PARAM_LABELS[key] || key,
                score: Math.round((triple as { point_estimate: number }).point_estimate * 100),
              }));
            if (pattern.length > 0) setRadarData(pattern);
          }
          if (profile.rating != null) setRating(String(profile.rating));
          if (profile.lesson_price != null) setLessonPrice(String(profile.lesson_price));
          if (Array.isArray(profile.subjects)) setSubjectCount(String((profile.subjects as unknown[]).length));
        }

        if (studentsRes.status === "fulfilled") {
          const data = studentsRes.value.data;
          setStudents(data);
          setTotalStudents(String(data.length));
        }
      } catch {
        // API errors handled via individual allSettled results
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <TeacherNav />
        <div className="flex items-center justify-center pt-32">
          <p className="text-slate-400 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <TeacherNav />

      <div className="p-4 sm:p-6 lg:p-8 pt-20 pb-24 md:pb-8 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-serif">
            Welcome back, {teacherName}!
          </h1>
          <p className="text-slate-500 mt-1">Here&apos;s an overview of your teaching activities</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                <Users className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{totalStudents}</p>
                <p className="text-xs text-slate-500">Students</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-violet-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{subjectCount}</p>
                <p className="text-xs text-slate-500">Subjects</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                <Star className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{rating}</p>
                <p className="text-xs text-slate-500">Rating</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{lessonPrice !== "—" ? `₹${lessonPrice}` : "—"}</p>
                <p className="text-xs text-slate-500">Per Session</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4 font-serif">Teaching Profile</h2>
              {radarData.length > 0 ? (
                <LearningRadar data={radarData} color="#059669" />
              ) : (
                <div className="flex items-center justify-center h-48 text-slate-400 text-sm">
                  Complete your assessment to see your teaching profile
                </div>
              )}
              <div className="mt-4 text-center">
                <Button variant="outline" onClick={() => router.push("/dashboard/teacher/test")} className="rounded-full text-emerald-700 border-emerald-200 hover:bg-emerald-50">
                  <GraduationCap className="w-4 h-4 mr-2" />
                  Take Assessment
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="lg:col-span-2 space-y-6">
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold text-slate-900 mb-4 font-serif">Quick Actions</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button onClick={() => router.push("/dashboard/teacher/test")} className="flex items-center justify-center p-4 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors">
                    <GraduationCap className="w-5 h-5 text-emerald-600 mr-2" />
                    <span className="text-emerald-700 font-medium text-sm">Teaching Assessment</span>
                  </button>
                  <button onClick={() => router.push("/dashboard/teacher/students")} className="flex items-center justify-center p-4 bg-violet-50 hover:bg-violet-100 rounded-lg transition-colors">
                    <Users className="w-5 h-5 text-violet-600 mr-2" />
                    <span className="text-violet-700 font-medium text-sm">View Students</span>
                  </button>
                  <button onClick={() => router.push("/dashboard/teacher/matching")} className="flex items-center justify-center p-4 bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors">
                    <Star className="w-5 h-5 text-amber-600 mr-2" />
                    <span className="text-amber-700 font-medium text-sm">Find Match</span>
                  </button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-slate-900 font-serif">Your Students</h2>
                  <button onClick={() => router.push("/dashboard/teacher/students")} className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">
                    View all <ArrowRight className="w-3 h-3 inline ml-1" />
                  </button>
                </div>
                {students.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500 text-sm">No students connected yet — they&apos;ll appear here after matching</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {students.slice(0, 4).map((student) => (
                      <div key={student.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-emerald-100 rounded-full flex items-center justify-center text-sm font-bold text-emerald-700">
                            {student.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-900">{student.name}</p>
                            <p className="text-xs text-slate-500">
                              {student.grade_level ? `Class ${student.grade_level}` : ""}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-slate-900">{student.sessions_completed}</p>
                          <p className="text-xs text-slate-500">sessions</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
