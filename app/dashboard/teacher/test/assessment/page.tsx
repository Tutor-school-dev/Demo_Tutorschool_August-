"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { authAPI } from "@/lib/api";
import { TeacherCognitiveAssessmentFlow } from "@/components/TeacherCognitiveAssessmentFlow";

export default function TeacherAssessmentPage() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("demo_mode") === "true") {
      setIsAuthorized(true);
      return;
    }
    const token = Cookies.get("jwt_Token");
    if (!token) {
      router.push("/auth?model=teacher");
      return;
    }

    authAPI.me().then((res) => {
      if (res.data.role !== "teacher") {
        router.push("/dashboard/student");
        return;
      }
      setIsAuthorized(true);
    }).catch(() => {
      router.push("/auth?model=teacher");
    });
  }, [router]);

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return <TeacherCognitiveAssessmentFlow />;
}
