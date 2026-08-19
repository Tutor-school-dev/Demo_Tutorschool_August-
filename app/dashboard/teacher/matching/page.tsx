"use client";

import TeacherNav from "@/components/dashboard/TeacherNav";
import TeacherMatchingView from "@/components/dashboard/TeacherMatchingView";

export default function TeacherMatchingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <TeacherNav />
      <TeacherMatchingView />
    </div>
  );
}
