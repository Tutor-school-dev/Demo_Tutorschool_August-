"use client";

import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { getApiUrl } from "@/lib/utils";

export const useTeacherPasswordReset = () => {
  const [loading, setLoading] = useState(false);

  const sendResetOTP = async (phoneNumber: string, setOTPSent: (sent: boolean) => void) => {
    try {
      setLoading(true);
      const apiUrl = getApiUrl();
      const response = await axios.get(`${apiUrl}/auth/teacher/reset_password?phone=${phoneNumber}`);
      
      toast.info(response.data.message);
      
      // Log OTP for development
      if (process.env.NODE_ENV !== 'production') {
        console.log(`Teacher reset OTP for testing: ${response.data.otp}`);
      }
      
      setOTPSent(true);
    } catch (error: any) {
      console.error('Send reset OTP error:', error);
      const message = error.response?.data?.message || "Failed to send reset OTP. Please try again.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async (
    phoneNumber: string, 
    otp: string, 
    newPassword: string, 
    setOpen: (open: boolean) => void
  ) => {
    try {
      setLoading(true);
      const apiUrl = getApiUrl();
      const response = await axios.post(`${apiUrl}/auth/teacher/change_password`, {
        phone: phoneNumber,
        otp: otp,
        password: newPassword
      });
      
      toast.success(response.data.message);
      setOpen(false);
    } catch (error: any) {
      console.error('Change password error:', error);
      const message = error.response?.data?.message || "Failed to change password. Please try again.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return { sendResetOTP, changePassword, loading };
};