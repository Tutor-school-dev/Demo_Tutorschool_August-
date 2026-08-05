"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get("jwt_Token");
    if (!token) {
      router.push("/auth");
      return;
    }

    const model = localStorage.getItem("model")?.toLowerCase();
    if (model === "student") {
      router.push("/dashboard/student");
    } else if (model === "parent" || model === "learner") {
      router.push("/dashboard/parent");
    } else {
      router.push("/dashboard/teacher");
    }
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Welcome to Dashboard</h1>
        <p className="text-muted-foreground">Redirecting to your dashboard...</p>
      </div>
    </div>
  );
}
