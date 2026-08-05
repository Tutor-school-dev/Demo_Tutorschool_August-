"use client";

import TeacherNavbar from "@/components/TeacherNavbar";
import TeacherStudentsView from "@/components/dashboard/TeacherStudentsView";

export default function TeacherStudentsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <TeacherNavbar />
      <TeacherStudentsView />
    </div>
  );
}
