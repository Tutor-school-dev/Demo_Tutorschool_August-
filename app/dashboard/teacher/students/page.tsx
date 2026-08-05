"use client";

import TeacherNav from "@/components/dashboard/TeacherNav";
import TeacherStudentsView from "@/components/dashboard/TeacherStudentsView";

export default function TeacherStudentsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <TeacherNav />
      <TeacherStudentsView />
    </div>
  );
}
