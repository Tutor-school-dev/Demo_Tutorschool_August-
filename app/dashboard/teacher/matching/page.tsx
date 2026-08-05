"use client";

import TeacherNav from "@/components/dashboard/TeacherNav";
import MatchingView from "@/components/dashboard/MatchingView";

export default function TeacherMatchingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <TeacherNav />
      <MatchingView />
    </div>
  );
}
