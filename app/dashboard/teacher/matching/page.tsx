"use client";

import TeacherNavbar from "@/components/TeacherNavbar";
import MatchingView from "@/components/dashboard/MatchingView";

export default function TeacherMatchingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <TeacherNavbar />
      <MatchingView />
    </div>
  );
}
