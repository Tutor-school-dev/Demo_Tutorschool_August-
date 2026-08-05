"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { LoadingButton } from "@/components/ui/LoadingButton";
import { GoogleLogin } from "@react-oauth/google";
import { useTeacherLogin } from "@/hooks/useTeacherLogin";
import { useTeacherGoogleLogin } from "@/hooks/useTeacherGoogleLogin";
import { useSearchParams } from "next/navigation";
import HidePasswordSvg from "@/components/svg/HidePasswordSvg";
import ShowPasswordSvg from "@/components/svg/ShowPasswordSvg";
import { TeacherResetPassword } from "./TeacherResetPassword";

export default function TeacherLogin() {
  const [number, setNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const searchParams = useSearchParams();
  
  const redirectFromJobListing = searchParams.get('redirectFromJobListing');
  const job_id = searchParams.get('job_id');
  
  const { login, loading } = useTeacherLogin(
    redirectFromJobListing || undefined, 
    job_id || undefined
  );
  
  const { handleGoogleLogin, handleFailure, loading: googleLoading } = useTeacherGoogleLogin(
    redirectFromJobListing || undefined, 
    job_id || undefined
  );

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 10);
    setNumber(value);
  };

  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login(e, number, password);
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
      <div className="flex flex-col justify-start items-center gap-5 w-full h-full">
        <Input
          value={number}
          onChange={handleNumberChange}
          maxLength={10}
          type="tel"
          placeholder="Number (without +91)"
          className="bg-green-100 border-2 border-black rounded-lg h-10 overflow-hidden text-black"
          style={{ borderRadius: "12px" }}
        />
        
        <div className="relative w-full">
          <Input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type={showPassword ? "text" : "password"}
            placeholder="password"
            className="bg-green-100 pr-10 border-2 border-black rounded-lg h-10 text-black"
            style={{ borderRadius: "12px" }}
          />
          <button
            type="button"
            onClick={() => setShowPassword(prevState => !prevState)}
            className="right-2 absolute inset-y-0 flex items-center bg-transparent border-none cursor-pointer"
          >
            {showPassword ? <HidePasswordSvg /> : <ShowPasswordSvg />}
          </button>
        </div>
        
        <div className="flex justify-center mt-7 w-full">
          <LoadingButton
            onClick={handleManualLogin}
            isLoading={loading}
            className="bg-blue-950 p-2 sm:p-3 rounded-lg w-full sm:w-2/3 md:w-1/2 lg:w-1/2 h-9 sm:h-8 md:h-9 text-white text-lg sm:text-xl"
            style={{ borderRadius: "12px" }}
          >
            Sign In
          </LoadingButton>
        </div>
        
        <div className="flex justify-center mt-4">
          <TeacherResetPassword flag="teacher" />
        </div>
        
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