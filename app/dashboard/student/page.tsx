"use client";

import StudentNav from "@/components/dashboard/StudentNav";
import StudentDashboard from "@/components/dashboard/StudentDashboard";

export default function StudentDashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <StudentNav />
      <StudentDashboard />
    </div>
  );
}
