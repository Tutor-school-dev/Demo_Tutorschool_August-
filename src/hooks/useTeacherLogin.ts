"use client";

import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useDashboardStore } from "./useDashboardStore";
import { useApplyJob } from "./useApplyJob";
import { getApiUrl } from "@/lib/utils";

export const useTeacherLogin = (redirectFromJobListing?: string, job_id?: string) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { set_dashboard_data } = useDashboardStore();
  const { apply_job } = useApplyJob();

  const login = async (e: React.FormEvent, phoneNumber: string, password: string) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const apiUrl = getApiUrl();
      const response = await axios.post(`${apiUrl}/auth/teacher/login`, {
        phone: phoneNumber,
        password: password
      });

      const { data } = response;
      
      // Set JWT token in cookies
      Cookies.set("jwt_Token", data.jwt_token, { expires: 7 }); // Fixed: use jwt_Token for consistency
      
      toast.success(data.message || "Login successful!");

      // Store user data in localStorage and store
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
        
        if (typeof window !== 'undefined') {
          localStorage.setItem("redirectFromJobListing", "fromJobListing");
        }
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
      console.error('Login error:', err);
      const message = err.response?.data?.message || "Login failed. Please try again.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return { login, loading };
};