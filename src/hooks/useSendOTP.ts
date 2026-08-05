"use client";

import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { getApiUrl } from "@/lib/utils";

export const useSendOTP = () => {
  const [loading, setLoading] = useState(false);

  const SendOTP = async (phoneNumber: string, setOpen: (open: boolean) => void, model: string) => {
    if (!phoneNumber || phoneNumber.trim() === '') {
      toast.error("Please enter valid Phone Number or Register via Google");
      return;
    }

    try {
      setLoading(true);
      const apiUrl = getApiUrl();
      const response = await axios.post(`${apiUrl}/auth/${model}/start`, {
        phone: phoneNumber,
      });
      
      setOpen(true);
      toast.success(response.data.message);
      
      // Log OTP for development with enhanced visibility
      if (process.env.NODE_ENV !== 'production') {
        const otp = response.data.otp;
        console.log(`🔑 ${model.toUpperCase()} OTP for phone ${phoneNumber}: ${otp}`);
        console.log(`%c OTP: ${otp} `, 'background: #4CAF50; color: white; font-size: 16px; font-weight: bold; padding: 4px 8px; border-radius: 4px;');
        
        // Also show OTP in a toast for development
        setTimeout(() => {
          toast.info(`Development OTP: ${otp}`, {
            duration: 10000, // Show for 10 seconds
          });
        }, 1000);
      }
    } catch (err: any) {
      console.error('Send OTP error:', err);
      const message = err.response?.data?.message || "Failed to send OTP. Please try again.";
      toast.error(message);
      setOpen(false);
    } finally {
      setLoading(false);
    }
  };

  return { SendOTP, loading };
};