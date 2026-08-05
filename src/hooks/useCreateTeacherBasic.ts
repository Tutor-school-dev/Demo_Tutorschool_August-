"use client";

import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { getApiUrl } from "@/lib/utils";

export const useCreateTeacherBasic = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const createBasic = async (values: any, next: () => void) => {
    setLoading(true);
    try {
      const apiUrl = getApiUrl();
      const authToken = Cookies.get("jwt_Token"); // Fixed: use jwt_Token for consistency
      
      if (!authToken) {
        toast.error("Authentication required. Please login again.");
        router.push("/auth?model=teacher");
        return;
      }

      const response = await axios.post(`${apiUrl}/onboarding/teacher/basic`, {
        degree: values.highestQualification === "Others" ? values.otherQualification : values.highestQualification,
        class: values.class,
        university: values.university,
        current_status: values.status,
        teaching_mode: values.teachingMethod,
        referral: values.referralSource
      }, { 
        headers: { 
          authorization: `bearer ${authToken}` 
        } 
      });
      
      toast.success(response.data.message || "Basic info saved successfully");
      next();
    } catch (err: any) {
      console.error("Create teacher basic error:", err);
      const message = err.response?.data?.message || 'Something went wrong, Please try again!';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return { createBasic, loading };
};