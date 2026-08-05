"use client";

import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { getApiUrl } from "@/lib/utils";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export const useTeacherOTP = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const sendOTP = async (phoneNumber: string, setStep: (step: string) => void) => {
    try {
      setLoading(true);
      const apiUrl = getApiUrl();
      console.log(apiUrl);
      const response = await axios.post(`${apiUrl}/auth/teacher/start`, {
        phone: phoneNumber,
      });
      
      toast.success(response.data.message);
      
      // Log OTP for development with enhanced visibility
      if (process.env.NODE_ENV !== 'production') {
        const otp = response.data.otp;
        console.log(`🔑 TEACHER OTP for phone ${phoneNumber}: ${otp}`);
        console.log(`%c OTP: ${otp} `, 'background: #4CAF50; color: white; font-size: 16px; font-weight: bold; padding: 4px 8px; border-radius: 4px;');
        
        // Also show OTP in a toast for development
        setTimeout(() => {
          toast.info(`Development OTP: ${otp}`, {
            duration: 10000, // Show for 10 seconds
          });
        }, 1000);
      }
      
      setStep("otp");
    } catch (error: any) {
      console.error('Send OTP error:', error);
      const message = error.response?.data?.message || "Failed to send OTP. Please try again.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async (phoneNumber: string, otp: string) => {
    try {
      setLoading(true);
      const apiUrl = getApiUrl();
      const response = await axios.post(`${apiUrl}/auth/teacher/verify`, {
        phone: phoneNumber,
        otp: otp
      });
      
      toast.success(response.data.message);
      
      if (typeof window !== 'undefined') {
        localStorage.setItem("Phone", phoneNumber);
      }
      
      if (response.data.type === "SIGNUP") {
        Cookies.set("access_hash", response.data.access_hash, { expires: 1 }); // 1 day
        router.push(`/create-account?model=teacher`);
      } else if (response.data.type === "LOGIN") {
        Cookies.set("jwt_Token", response.data.jwt_token, { expires: 7 }); // Fixed: use jwt_Token for consistency
        
        // Store user data
        if (typeof window !== 'undefined') {
          localStorage.setItem("model", "Teacher");
          localStorage.setItem("email", response.data.teacher?.email || "");
          localStorage.setItem("name", response.data.teacher?.name || "");
        }
        
        router.push('/dashboard/teacher');
      }
      
    } catch (error: any) {
      console.error('Verify OTP error:', error);
      const message = error.response?.data?.message || "Invalid OTP. Please try again.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return { sendOTP, verifyOTP, loading };
};