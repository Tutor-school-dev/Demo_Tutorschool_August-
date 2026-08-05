"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { LoadingButton } from "@/components/ui/LoadingButton";
import { GoogleLogin } from "@react-oauth/google";
import { useTeacherLogin } from "@/hooks/useTeacherLogin";
import { useTeacherGoogleLogin } from "@/hooks/useTeacherGoogleLogin";
import HidePasswordSvg from "@/components/svg/HidePasswordSvg";
import ShowPasswordSvg from "@/components/svg/ShowPasswordSvg";

interface LoginProps {
  predefinedFlag?: string;
  redirectFromJobListing?: string;
  job_id?: string;
}

export default function Login({ predefinedFlag, redirectFromJobListing, job_id }: LoginProps) {
  const [number, setNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Use teacher hooks (since we're in job application context)
  const { login, loading: manualLoading } = useTeacherLogin(redirectFromJobListing, job_id);
  const { handleGoogleLogin, handleFailure, loading: googleLoading } = useTeacherGoogleLogin(redirectFromJobListing, job_id);

  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login(e, number, password);
  };

  const isLoading = manualLoading || googleLoading;

  if (googleLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-center">
          <div className="mx-auto mb-4 border-4 border-gray-300 border-t-blue-600 rounded-full w-8 h-8 animate-spin"></div>
          <p className="text-muted-foreground">Verifying your Google account...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-between items-center gap-6 p-4 w-full h-full">
      <div className="flex flex-col justify-start items-center gap-4 w-full">
        <Input
          value={number}
          onChange={(e) => setNumber(e.target.value)}
          maxLength={10}
          type="tel"
          placeholder="Phone number (without +91)"
          className="w-full"
        />
        
        <div className="relative w-full">
          <Input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="pr-10 w-full"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="right-3 absolute inset-y-0 flex items-center bg-transparent border-none cursor-pointer text-muted-foreground hover:text-foreground"
          >
            {showPassword ? <HidePasswordSvg className="w-4 h-4" /> : <ShowPasswordSvg className="w-4 h-4" />}
          </button>
        </div>

        <LoadingButton
          onClick={handleManualLogin}
          isLoading={manualLoading}
          loadingText="Signing in..."
          className="w-full"
          disabled={!number || !password}
        >
          Sign In
        </LoadingButton>

        {/* Divider */}
        <div className="flex justify-center items-center mt-4 w-full">
          <div className="flex-1 bg-border h-px" />
          <span className="mx-3 text-muted-foreground text-sm">OR</span>
          <div className="flex-1 bg-border h-px" />
        </div>

        {/* Google Login */}
        <div className="flex justify-center w-full">
          <GoogleLogin 
            onSuccess={handleGoogleLogin} 
            onError={() => handleFailure("Google login failed")}
            size="large"
            width="100%"
            text="signin_with"
          />
        </div>
      </div>
    </div>
  );
}