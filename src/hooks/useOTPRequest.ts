"use client";

import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { getAppUrl } from "@/lib/utils";

export const useOTPRequest = () => {
  const [loading, setLoading] = useState(false);

  const requestOTP = async (phoneNumber: string, userType: 'teacher' | 'parent') => {
    setLoading(true);
    try {
      // Use different API base URLs for different user types (matching React repo)
      const apiUrl = getAppUrl();
      console.log(apiUrl);
      const endpoint = userType === 'teacher' ? '/auth/teacher/start' : '/auth/parent/start';
      
      const response = await axios.post(`${apiUrl}${endpoint}`, {
        phone: phoneNumber  // Match React repo field name
      });

      toast.success(response.data.message || "OTP sent successfully!");
      
      // Log OTP for development (matching React repo pattern)
      if (process.env.NODE_ENV !== 'production' && response.data.otp) {
        console.log(`OTP for testing: ${response.data.otp}`);
      }
      
      return true; // Simple boolean return for success
    } catch (err: any) {
      console.error('OTP request error:', err);
      const message = err.response?.data?.message || "Failed to send OTP. Please try again.";
      toast.error(message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { requestOTP, loading };
};