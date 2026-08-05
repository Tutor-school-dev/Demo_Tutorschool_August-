"use client";

import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { getApiUrl } from "@/lib/utils";

export const useCreateTeacherAccount = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onSubmit = async (values: any) => {
    setLoading(true);
    try {
      const apiUrl = getApiUrl();
      const access_hash = Cookies.get("access_hash");
      
      if (!access_hash) {
        toast.error("Session expired. Please try again.");
        router.push("/auth?model=teacher");
        return;
      }

      const response = await axios.post(`${apiUrl}/auth/teacher/create`, { 
        ...values, 
        access_hash: access_hash 
      });
      
      Cookies.set("jwt_Token", response.data.jwt_token, { expires: 7 }); // Fixed: use jwt_Token for consistency
      Cookies.remove("access_hash"); // Remove access hash after successful account creation
      
      toast.success('Teacher account created successfully');
      
      // Store user data
      if (typeof window !== 'undefined') {
        localStorage.setItem("model", "Teacher");
        localStorage.setItem("email", values.email);
        localStorage.setItem("name", values.name);
      }
      
      router.push('/teacher-profile');
    } catch (err: any) {
      console.error("Create teacher account error:", err);
      const message = err.response?.data?.message || 'Something went wrong, Please try again!';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return { onSubmit, loading };
};