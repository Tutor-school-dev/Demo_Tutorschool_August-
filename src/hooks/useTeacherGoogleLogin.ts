"use client";

import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useDashboardStore } from "./useDashboardStore";
import { useApplyJob } from "./useApplyJob";
import { getApiUrl } from "@/lib/utils";

export const useTeacherGoogleLogin = (redirectFromJobListing?: string, job_id?: string) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { set_dashboard_data } = useDashboardStore();
  const { apply_job } = useApplyJob();

  const handleGoogleLogin = async (response: any) => {
    const token = response.credential;
    setLoading(true);

    try {
      const apiUrl = getApiUrl();
      const res = await axios.post(`${apiUrl}/auth/teacher/google`, {
        id_token: token,
      });

      const { data } = res;
      toast.info(data.message || "Google login successful!");

      // Handle new user registration flow
      if (data.access_hash) {
        Cookies.set("access_hash", data.access_hash, { expires: 1 }); // 1 day
        router.push(`/create-account?model=teacher&email=${data.email}`);
        return;
      }

      // Set JWT token for existing user
      Cookies.set("jwt_Token", data.jwt_token, { expires: 7 }); // Fixed: use jwt_Token for consistency

      // Store user data
      if (typeof window !== 'undefined') {
        localStorage.setItem("model", "Teacher");
        localStorage.setItem("email", data.teacher.email);
        localStorage.setItem("name", data.teacher.name);
      }

      set_dashboard_data(data.teacher, "teacher");

      // Apply for job if coming from job listing
      if (redirectFromJobListing === "fromJobListing" && job_id) {
        console.log("Applying job...", job_id, data.teacher.id);
        const job_message = await apply_job(job_id, data.teacher.id);
        set_dashboard_data(job_message, "job_message");
      }

      // Navigation logic
      if (data.go_to_dashboard && data.model === 'teacher') {
        const redirect = redirectFromJobListing === "fromJobListing" 
          ? `?redirectFromJobListing=${redirectFromJobListing}` 
          : '';
        
        router.push(`/dashboard/teacher${redirect}`);
        return;
      }

      // Check profile completion status
      const stepNames = {
        basic_done: data.teacher.basic_done,
        location_done: data.teacher.location_done
      };

      for (const [key, value] of Object.entries(stepNames)) {
        if (!value) {
          router.push(`/teacher-profile?step=${key}`);
          return;
        }
      }

    } catch (err: any) {
      console.error('Google login error:', err);
      const message = err.response?.data?.message || err.dashboard_response?.data?.message || "Google login failed";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleFailure = (error: any) => {
    console.error("Google Login Failed:", error);
    toast.error("Google login failed. Please try again.");
  };

  return { handleGoogleLogin, handleFailure, loading };
};