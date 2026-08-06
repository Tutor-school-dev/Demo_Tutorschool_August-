"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import StudentNav from "@/components/dashboard/StudentNav";
import AIMatchResults from "@/components/AIMatchResults";
import Cookies from "js-cookie";

export default function MatchingResultsPage() {
  const router = useRouter();
  const [results, setResults] = useState(null);

  useEffect(() => {
    const authToken = Cookies.get("jwt_Token");
    const model = localStorage.getItem("model");

    if (!authToken || model !== "Student") {
      router.push("/auth?model=student");
      return;
    }

    const assessmentResults = localStorage.getItem("cognitiveAssessmentResults");
    if (!assessmentResults) {
      router.push("/dashboard/student/test/assessment");
      return;
    }

    setResults(JSON.parse(assessmentResults));
  }, [router]);

  if (!results) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <StudentNav />
      <div className="pt-20 pb-24 md:pb-8">
        <AIMatchResults onClose={() => router.push("/dashboard/student")} />
      </div>
    </div>
  );
}
