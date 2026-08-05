"use client";

import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { getApiUrl } from "@/lib/utils";

export const useVerifyOTP = () => {
  const [VerifyOTPLoading, setVerifyOTPLoading] = useState(false);
  const router = useRouter();

  const VerifyOTP = async (
    setOpen: (open: boolean) => void, 
    phoneNumber: string, 
    otp: string, 
    model: string
  ) => {
    try {
      setVerifyOTPLoading(true);
      const apiUrl = getApiUrl();
      const response = await axios.post(`${apiUrl}/auth/${model}/verify`, {
        phone: phoneNumber,
        otp: otp
      });
      
      toast.success(response.data.message);
      Cookies.set('access_hash', response.data.access_hash, { expires: 1 }); // 1 day
      
      setOpen(false);
      router.push(`/create-account?model=${model}&phone=${phoneNumber}`);
    } catch (error: any) {
      console.error('Verify OTP error:', error);
      const message = error.response?.data?.message || 'Something went wrong';
      toast.error(message);
      
      if (message === 'Invalid otp') return;
      setOpen(false);
    } finally {
      setVerifyOTPLoading(false);
    }
  };

  return { VerifyOTP, VerifyOTPLoading };
};