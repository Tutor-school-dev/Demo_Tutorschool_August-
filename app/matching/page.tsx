"use client";

import StudentNav from "@/components/dashboard/StudentNav";
import MatchingEngine from "@/components/dashboard/MatchingEngine";

export default function MatchingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <StudentNav />
      <MatchingEngine />
    </div>
  );
}
