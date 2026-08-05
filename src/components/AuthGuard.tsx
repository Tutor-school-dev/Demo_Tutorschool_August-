"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

interface AuthGuardProps {
  children: React.ReactNode;
  redirectAuthenticatedUsers?: boolean;
}

export default function AuthGuard({ children, redirectAuthenticatedUsers = false }: AuthGuardProps) {
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const checkAuth = () => {
      const jwtToken = Cookies.get("jwt_Token");
      const model = localStorage.getItem("model");
      
      console.log("AuthGuard check:", { jwtToken: !!jwtToken, model, redirectAuthenticatedUsers });
      
      if (jwtToken && model && redirectAuthenticatedUsers) {
        // User is logged in and we're on an auth page, redirect to dashboard
        const dashboardPath = model.toLowerCase() === "parent" ? "/dashboard/parent" : "/dashboard/teacher";
        console.log("AuthGuard redirecting to:", dashboardPath);
        router.push(dashboardPath);
      }
    };

    checkAuth();
  }, [router, redirectAuthenticatedUsers]);

  return <>{children}</>;
}