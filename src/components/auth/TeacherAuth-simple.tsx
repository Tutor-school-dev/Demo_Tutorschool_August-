"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { LoadingButton } from "@/components/ui/LoadingButton";
import { GoogleLogin } from "@react-oauth/google";
import { useTeacherLogin } from "@/hooks/useTeacherLogin";
import { useTeacherGoogleLogin } from "@/hooks/useTeacherGoogleLogin";
import HidePasswordSvg from "@/components/svg/HidePasswordSvg";
import ShowPasswordSvg from "@/components/svg/ShowPasswordSvg";

export default function TeacherAuth() {
  const searchParams = useSearchParams();
  const [isLogin, setIsLogin] = useState(true);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Get redirect params from URL if coming from job application
  const redirectFromJobListing = searchParams.get('redirect');
  const job_id = searchParams.get('job_id');

  const { login, loading: manualLoading } = useTeacherLogin();
  const { handleGoogleLogin, loading: googleLoading } = useTeacherGoogleLogin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      login(e, phoneNumber, password);
    } else {
      // Handle signup - we'll implement this later
      console.log("Teacher signup not implemented yet");
    }
  };

  // Show loading overlay for Google login
  if (googleLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-center">
          <div className="mx-auto mb-4 border-4 border-gray-300 border-t-blue-600 rounded-full w-8 h-8 animate-spin"></div>
          <p className="text-muted-foreground">Hang tight while we verify your gmail</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4 w-full">
        <Input
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          maxLength={10}
          type="tel"
          placeholder="Number (without +91)"
          className="bg-green-100 border-2 border-black rounded-lg h-10 text-black"
        />

        {/* Password input with show/hide toggle */}
        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="bg-green-100 border-2 border-black pr-10 rounded-lg h-10 text-black"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="top-1/2 right-3 absolute text-gray-500 hover:text-gray-700 -translate-y-1/2"
          >
            {showPassword ? <HidePasswordSvg /> : <ShowPasswordSvg />}
          </button>
        </div>

        <LoadingButton
          isLoading={manualLoading}
          type="submit"
          className="bg-blue-700 hover:bg-blue-800 rounded-lg w-full h-10 text-white font-medium transition-colors"
          disabled={!phoneNumber || !password}
        >
          {isLogin ? 'Login' : 'Sign Up'}
        </LoadingButton>
      </form>

      {/* Google Login - Only show if Client ID is available */}
      {process.env.NEXT_PUBLIC_CLIENT_ID && (
        <>
          {/* OR divider */}
          <div className="flex justify-center items-center mt-4 w-full">
            <div className="flex-1 bg-gray-300 h-px" />
            <span className="mx-2 text-gray-500 text-sm">OR</span>
            <div className="flex-1 bg-gray-300 h-px" />
          </div>

          {/* Google Login */}
          <div className="flex justify-center">
            <GoogleLogin onSuccess={handleGoogleLogin} onError={() => console.log('Google login failed')} />
          </div>
        </>
      )}

      {/* Switch between Login/Signup */}
      <div className="text-center text-sm">
        <span className="text-muted-foreground">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
        </span>
        <button
          type="button"
          onClick={() => setIsLogin(!isLogin)}
          className="text-primary hover:underline font-medium"
        >
          {isLogin ? 'Sign up' : 'Log in'}
        </button>
      </div>
    </div>
  );
}