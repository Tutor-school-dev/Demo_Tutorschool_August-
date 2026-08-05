"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { LoadingButton } from "@/components/ui/LoadingButton";
import { GoogleLogin } from "@react-oauth/google";
import { useSendOTP } from "@/hooks/useSendOTP";
import { useTeacherGoogleLogin } from "@/hooks/useTeacherGoogleLogin";
import SendOTPDialog from "@/components/auth/SendOTPDialog";
import { useSearchParams } from "next/navigation";

export default function TeacherSignup() {
  const [number, setNumber] = useState('');
  const [open, setOpen] = useState(false);
  const { SendOTP, loading } = useSendOTP();
  const searchParams = useSearchParams();
  
  const redirectFromJobListing = searchParams.get('redirectFromJobListing');
  const job_id = searchParams.get('job_id');
  
  const { handleGoogleLogin, handleFailure, loading: googleLoading } = useTeacherGoogleLogin(
    redirectFromJobListing || undefined, 
    job_id || undefined
  );

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 10);
    setNumber(value);
  };

  if (googleLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Hang tight while we verify your gmail</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-between items-center gap-10 p-2 md:p-10 w-full h-full">
      <h1 className="font-extrabold text-2xl">
        Tutor Sign-Up
      </h1>
      <div className="flex flex-col justify-start items-center gap-5 w-full h-full">
        <Input
          value={number}
          onChange={handleNumberChange}
          type="tel"
          maxLength={10}
          placeholder="Number (without +91)"
          className="bg-green-100 border-2 border-black rounded-lg h-10 overflow-hidden text-black"
          style={{ borderRadius: "12px" }}
        />
        <LoadingButton
          onClick={() => SendOTP(number, setOpen, "teacher")}
          isLoading={loading}
          disabled={!number || number.length !== 10 || loading}
          className="bg-blue-950 rounded-lg h-10 text-white sm:text-base md:text-xl"
        >
          Send OTP
        </LoadingButton>
        
        <SendOTPDialog 
          open={open} 
          setOpen={setOpen} 
          phoneNumber={number} 
          model="teacher" 
        />
        
        <div className="flex justify-center items-center mt-4 w-full">
          <div className="flex-1 bg-gray-300 h-px" />
          <span className="mx-2 text-gray-500 text-sm">OR</span>
          <div className="flex-1 bg-gray-300 h-px" />
        </div>
        
        <GoogleLogin 
          onSuccess={handleGoogleLogin} 
          onError={() => handleFailure(null)} 
        />
      </div>
    </div>
  );
}