"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { authAPI } from "@/lib/api";
import StudentNav from "@/components/dashboard/StudentNav";
import StudentDashboard from "@/components/dashboard/StudentDashboard";

export default function StudentDashboardPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("demo_mode") === "true") {
      setReady(true);
      return;
    }
    const token = Cookies.get("jwt_Token");
    if (!token) {
      router.push("/auth?model=student");
      return;
    }
    authAPI.me().then((res) => {
      if (res.data.role !== "student") {
        router.push("/dashboard/teacher");
        return;
      }
      if (!res.data.onboarding_completed) {
        router.push("/dashboard/student/test/assessment");
      } else {
        setReady(true);
      }
    }).catch(() => {
      router.push("/auth?model=student");
    });
  }, [router]);

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <StudentNav />
      <StudentDashboard />
    </div>
  );
}
