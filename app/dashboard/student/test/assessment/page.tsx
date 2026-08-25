"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import StudentQuestionAssessment from "@/components/assessment/StudentQuestionAssessment";

export default function CognitiveAssessmentPage() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const token = Cookies.get("jwt_Token");
    const model = localStorage.getItem("model");

    if (!token) {
      router.push("/auth?model=student");
      return;
    }

    if (model !== "Student") {
      router.push("/dashboard");
      return;
    }

    setIsAuthorized(true);
  }, [router]);

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return <StudentQuestionAssessment />;
}
