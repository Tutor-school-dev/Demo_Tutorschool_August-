"use client";

import { useState } from "react";
import TeacherNav from "@/components/dashboard/TeacherNav";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, Star, Users, Clock, DollarSign, Save } from "lucide-react";
import LearningRadar from "@/components/dashboard/LearningRadar";
import { demoTeachers, demoStudents, teacherDimensions } from "@/mock/demo-data";

export default function TeacherProfilePage() {
  const teacher = demoTeachers[0];
  const [name, setName] = useState(teacher.name);
  const [email, setEmail] = useState(teacher.email);
  const [price, setPrice] = useState(String(teacher.lessonPrice));
  const [mode, setMode] = useState(teacher.teachingMode);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    localStorage.setItem("name", name);
    localStorage.setItem("email", email);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

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
                  <span className="text-2xl font-bold text-emerald-700">{teacher.avatar}</span>
                </div>
                <h2 className="text-xl font-bold text-slate-900">{name}</h2>
                <p className="text-sm text-slate-500">{email}</p>
                <div className="flex flex-wrap justify-center gap-2 mt-3">
                  {teacher.subjects.map((s) => (
                    <Badge key={s} className="bg-emerald-50 text-emerald-700 border-0">{s}</Badge>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-3 mt-5">
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <Users className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
                    <p className="text-lg font-bold text-slate-900">{teacher.totalStudents}</p>
                    <p className="text-xs text-slate-500">Students</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <Star className="w-4 h-4 text-amber-500 mx-auto mb-1" />
                    <p className="text-lg font-bold text-slate-900">{teacher.rating}</p>
                    <p className="text-xs text-slate-500">Rating</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <Clock className="w-4 h-4 text-violet-600 mx-auto mb-1" />
                    <p className="text-lg font-bold text-slate-900">{teacher.experience}</p>
                    <p className="text-xs text-slate-500">Experience</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <DollarSign className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
                    <p className="text-lg font-bold text-slate-900">₹{teacher.lessonPrice}</p>
                    <p className="text-xs text-slate-500">Per Session</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Teaching Dimensions Radar */}
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4 font-serif">Teaching Dimensions</h3>
                <LearningRadar data={teacherDimensions} color="#059669" />
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {demoStudents.map((student) => (
                    <div key={student.id} className="p-4 bg-gray-50 rounded-lg hover:bg-white hover:shadow-sm transition-all">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-900 text-sm">{student.name}</p>
                          <p className="text-xs text-slate-500">{student.grade} &middot; {student.board}</p>
                        </div>
                      </div>
                      <div className="h-48 mb-4">
                        <LearningRadar data={student.learningPattern} color="#6366f1" size="sm" />
                      </div>
                      <div className="flex justify-between text-xs text-slate-500">
                        <span>{student.sessionsCompleted} sessions</span>
                        <span>Avg: {student.averageScore}%</span>
                        <span className="text-emerald-600 font-medium">{student.streak} day streak</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
