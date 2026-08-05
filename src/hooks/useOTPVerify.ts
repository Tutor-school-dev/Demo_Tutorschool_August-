"use client";

import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useDashboardStore } from "./useDashboardStore";
import { getAppUrl, getApiUrl } from "@/lib/utils";

export const useOTPVerify = () => {
  const [loading, setLoading] = useState(false);
  const [VerifyOTPLoading, setVerifyOTPLoading] = useState(false);
  const router = useRouter();
  const { set_dashboard_data } = useDashboardStore();

  // New method matching React app pattern
  const VerifyOTP = async (setOpen: (open: boolean) => void, phoneNumber: string, otp: string, model: string) => {
    if (!otp || otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    try {
      setVerifyOTPLoading(true);
      // Use NEXT_PUBLIC_APP_URL for parent auth (matching React repo)
      const apiUrl = getAppUrl();
      const response = await axios.post(`${apiUrl}/auth/${model}/verify`, {
        phone: phoneNumber,
        otp: otp
      });
      
      toast.success(response.data.message);
      
      // Store phone number in localStorage (matching React repo)
      localStorage.setItem("Phone", phoneNumber);
      
      // Handle different response types (matching React repo logic)
      if (response.data.type === "SIGNUP") {
        // Store access_hash for new user onboarding
        Cookies.set("access_hash", response.data.access_hash, { expires: 1 });
        router.push(`/onboarding?model=${model}`);
      } else if (response.data.type === "LOGIN") {
        // Store JWT token for existing user
        Cookies.set("jwt_Token", response.data.jwt_token, { expires: 7 }); // 7 days
        router.push(model === 'parent' ? '/dashboard/parent' : '/dashboard/teacher');
      }
      
    } catch (err: any) {
      console.error('Verify OTP error:', err);
      const message = err.response?.data?.message || "Invalid OTP. Please try again.";
      toast.error(message);
    } finally {
      setVerifyOTPLoading(false);
    }
  };

  const verifyOTP = async (
    phoneNumber: string, 
    otp: string, 
    userType: 'teacher' | 'parent',
    isSignup: boolean = false,
    signupData?: any
  ) => {
    setLoading(true);
    try {
      const apiUrl = getApiUrl();
      
      let endpoint, payload;
      
      if (isSignup) {
        // Signup verification
        endpoint = userType === 'teacher' ? '/auth/teacher/signup' : '/auth/parent/signup';
        payload = {
          phone_number: phoneNumber,
          otp: otp,
          ...signupData
        };
      } else {
        // Login verification
        endpoint = userType === 'teacher' ? '/auth/teacher/verify-otp' : '/auth/parent/verify-otp';
        payload = {
          phone_number: phoneNumber,
          otp: otp
        };
      }

      const response = await axios.post(`${apiUrl}${endpoint}`, payload);
      const { data } = response;

      toast.success(data.message || "Verification successful!");

      // Handle new user registration flow (if access_hash is provided)
      if (data.access_hash) {
        Cookies.set("access_hash", data.access_hash, { expires: 1 }); // 1 day
        const email = data.email || signupData?.email;
        router.push(`/create-account?model=${userType}&email=${email}`);
        return { success: true, needsRegistration: true };
      }

      // Set JWT token for existing/new user
      Cookies.set("jwt_Token", data.jwt_token, { expires: 7 }); // Fixed: use jwt_Token for consistency

      // Store user data
      const userData = userType === 'teacher' ? data.teacher : data.parent;
      const modelName = userType === 'teacher' ? 'Teacher' : 'Parent';
      
      if (typeof window !== 'undefined') {
        localStorage.setItem("model", modelName);
        localStorage.setItem("name", userData.name);
        if (userData.email) {
          localStorage.setItem("email", userData.email);
        }
      }

      set_dashboard_data(userData, userType);

      // Navigate based on user type and profile completion
      if (userType === 'teacher') {
        // Check profile completion status for teachers
        if (data.go_to_dashboard && data.model === 'teacher') {
          router.push('/dashboard/teacher');
          return { success: true, redirected: true };
        }

        const stepNames = {
          basic_done: userData.basic_done,
          location_done: userData.location_done
        };

        for (const [key, value] of Object.entries(stepNames)) {
          if (!value) {
            router.push(`/teacher-profile?step=${key}`);
            return { success: true, redirected: true };
          }
        }
      } else {
        // Parent dashboard
        router.push('/dashboard/parent');
        return { success: true, redirected: true };
      }

      return { success: true, data: userData };
    } catch (err: any) {
      console.error('OTP verification error:', err);
      const message = err.response?.data?.message || "OTP verification failed. Please try again.";
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  return { 
    verifyOTP, 
    loading, 
    VerifyOTP, 
    VerifyOTPLoading 
  };
};