"use client";

import { useEffect, useState } from "react";
import TeacherNav from "@/components/dashboard/TeacherNav";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, Star, Users, Clock, DollarSign, Save } from "lucide-react";
import LearningRadar from "@/components/dashboard/LearningRadar";
import { teacherAPI, authAPI, type ConnectedStudent } from "@/lib/api";

interface LearningPattern {
  subject: string;
  score: number;
}

const T_PARAM_LABELS: Record<string, string> = {
  t1_pacing: "Pacing",
  t2_scaffolding: "Scaffolding",
  t3_feedback_style: "Feedback Style",
  t4_explanation_style: "Explanation Style",
  t5_questioning: "Questioning",
  t6_adaptability: "Adaptability",
  t7_psychological_safety: "Psych. Safety",
  t8_patience: "Patience",
};

export default function TeacherProfilePage() {
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [price, setPrice] = useState("");
  const [mode, setMode] = useState("Online");
  const [saved, setSaved] = useState(false);

  const [avatar, setAvatar] = useState("");
  const [subjects, setSubjects] = useState<string[]>([]);
  const [totalStudents, setTotalStudents] = useState<string>("—");
  const [ratingVal, setRatingVal] = useState<string>("—");
  const [experience, setExperience] = useState<string>("—");
  const [lessonPrice, setLessonPrice] = useState<string>("—");
  const [radarData, setRadarData] = useState<LearningPattern[]>([]);
  const [students, setStudents] = useState<ConnectedStudent[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const [profileRes, meRes, studentsRes] = await Promise.allSettled([
          teacherAPI.getProfile(),
          authAPI.me(),
          teacherAPI.getMyStudents(),
        ]);

        if (meRes.status === "fulfilled") {
          const user = meRes.value.data;
          setName(user.full_name || "");
          setEmail(user.email || "");
          setAvatar(user.full_name ? user.full_name.split(" ").map(w => w[0]).join("").slice(0, 2) : "");
        } else {
          setName(localStorage.getItem("name") || "");
          setEmail(localStorage.getItem("email") || "");
        }

        if (profileRes.status === "fulfilled") {
          const profile = profileRes.value.data as Record<string, unknown>;
          if (profile.lesson_price != null) {
            setPrice(String(profile.lesson_price));
            setLessonPrice(String(profile.lesson_price));
          }
          if (profile.teaching_mode) setMode(String(profile.teaching_mode));
          if (Array.isArray(profile.subjects)) setSubjects(profile.subjects as string[]);
          if (profile.rating != null) setRatingVal(String(profile.rating));
          if (profile.experience != null) setExperience(String(profile.experience));

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
        }

        if (studentsRes.status === "fulfilled") {
          const data = studentsRes.value.data;
          setStudents(data);
          setTotalStudents(String(data.length));
        }
      } catch {
        // Individual errors handled via allSettled
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSave = async () => {
    try {
      const updates: Record<string, unknown> = {};
      if (price) updates.hourly_rate = parseFloat(price);
      if (mode) updates.availability = { mode };
      await teacherAPI.updateProfile(updates as Parameters<typeof teacherAPI.updateProfile>[0]);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      setSaved(false);
    }
  };

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
      <div className="p-4 sm:p-6 lg:p-8 pt-20 pb-24 md:pb-8 max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-serif">Teacher Profile</h1>
          <p className="text-slate-500 mt-1">Your teaching profile and enrolled students</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile View */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6 text-center">
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-emerald-700">{avatar || "?"}</span>
                </div>
                <h2 className="text-xl font-bold text-slate-900">{name || "—"}</h2>
                <p className="text-sm text-slate-500">{email || "—"}</p>
                <div className="flex flex-wrap justify-center gap-2 mt-3">
                  {subjects.length > 0 ? subjects.map((s) => (
                    <Badge key={s} className="bg-emerald-50 text-emerald-700 border-0">{s}</Badge>
                  )) : (
                    <p className="text-xs text-slate-400">No subjects added</p>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3 mt-5">
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <Users className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
                    <p className="text-lg font-bold text-slate-900">{totalStudents}</p>
                    <p className="text-xs text-slate-500">Students</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <Star className="w-4 h-4 text-amber-500 mx-auto mb-1" />
                    <p className="text-lg font-bold text-slate-900">{ratingVal}</p>
                    <p className="text-xs text-slate-500">Rating</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <Clock className="w-4 h-4 text-violet-600 mx-auto mb-1" />
                    <p className="text-lg font-bold text-slate-900">{experience}</p>
                    <p className="text-xs text-slate-500">Experience</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <DollarSign className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
                    <p className="text-lg font-bold text-slate-900">{lessonPrice !== "—" ? `₹${lessonPrice}` : "—"}</p>
                    <p className="text-xs text-slate-500">Per Session</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Teaching Dimensions Radar */}
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4 font-serif">Teaching Dimensions</h3>
                {radarData.length > 0 ? (
                  <LearningRadar data={radarData} color="#059669" />
                ) : (
                  <div className="flex items-center justify-center h-48 text-slate-400 text-sm text-center">
                    Complete your teaching assessment to see your dimensions
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Edit Form + Students */}
          <div className="lg:col-span-2 space-y-6">
            {/* Edit Form */}
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4 font-serif">Edit Profile</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-1 block">Name</label>
                    <Input value={name} onChange={(e) => setName(e.target.value)} />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-1 block">Email</label>
                    <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-1 block">Lesson Price (₹)</label>
                    <Input value={price} onChange={(e) => setPrice(e.target.value)} type="number" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-1 block">Teaching Mode</label>
                    <select value={mode} onChange={(e) => setMode(e.target.value)} className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm">
                      <option value="Online">Online</option>
                      <option value="Offline">Offline</option>
                      <option value="Both">Both</option>
                    </select>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-3">
                  <Button onClick={handleSave} className="bg-emerald-600 hover:bg-emerald-700 rounded-full">
                    <Save className="w-4 h-4 mr-2" /> Save Changes
                  </Button>
                  {saved && <span className="text-sm text-emerald-600 font-medium">Saved!</span>}
                </div>
              </CardContent>
            </Card>

            {/* Enrolled Students */}
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4 font-serif">Enrolled Students</h3>
                {students.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500 text-sm">No students enrolled yet</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {students.map((student) => (
                      <div key={student.id} className="p-4 bg-gray-50 rounded-lg hover:bg-white hover:shadow-sm transition-all">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-emerald-600" />
                          </div>
                          <div>
                            <p className="font-medium text-slate-900 text-sm">{student.name}</p>
                            <p className="text-xs text-slate-500">
                              {student.grade_level ? `Class ${student.grade_level}` : ""}
                            </p>
                          </div>
                        </div>
                        <div className="flex justify-between text-xs text-slate-500">
                          <span>{student.sessions_completed} sessions</span>
                          <span className="text-emerald-600 font-medium">
                            Fit: {Math.round((student.compatibility_score / 5.5) * 100)}%
                          </span>
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
