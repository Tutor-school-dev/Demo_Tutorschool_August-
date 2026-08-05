"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { LoadingButton } from "@/components/ui/LoadingButton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GoogleLogin } from "@react-oauth/google";
import { useTeacherLogin } from "@/hooks/useTeacherLogin";
import { useTeacherGoogleLogin } from "@/hooks/useTeacherGoogleLogin";
import { useSendOTP } from "@/hooks/useSendOTP";
import SendOTPDialog from "./SendOTPDialog";
import { TeacherResetPassword } from "./TeacherResetPassword";
import HidePasswordSvg from "@/components/svg/HidePasswordSvg";
import ShowPasswordSvg from "@/components/svg/ShowPasswordSvg";

export default function TeacherAuth() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState("SIGNIN");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [otpDialogOpen, setOtpDialogOpen] = useState(false);

  // Get redirect params from URL if coming from job application
  const redirectFromJobListing = searchParams.get('redirect');
  const job_id = searchParams.get('job_id');

  const { login, loading: loginLoading } = useTeacherLogin(redirectFromJobListing || undefined, job_id || undefined);
  const { handleGoogleLogin, loading: googleLoading } = useTeacherGoogleLogin(redirectFromJobListing || undefined, job_id || undefined);
  const { SendOTP, loading: otpLoading } = useSendOTP();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber || !password) return;
    login(e, phoneNumber, password);
  };

  const handleSignup = () => {
    if (!phoneNumber || phoneNumber.length !== 10) {
      return;
    }
    SendOTP(phoneNumber, setOtpDialogOpen, "teacher");
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
    <div className="flex flex-col justify-between items-center mb-10 w-full">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col justify-between items-center mb-10 w-full">
        {/* Tabs Header */}
        <TabsList className="grid grid-cols-2 bg-white border-2 border-black rounded-full w-4/5 h-10 mb-8">
          <TabsTrigger
            value="SIGNIN"
            className="flex-1 data-[state=active]:bg-blue-950 rounded-l-full h-7 data-[state=active]:text-white"
          >
            Sign In
          </TabsTrigger>
          <TabsTrigger
            value="SIGNUP"
            className="flex-1 data-[state=active]:bg-blue-950 rounded-r-full h-7 data-[state=active]:text-white"
          >
            Sign Up
          </TabsTrigger>
        </TabsList>

        {/* Sign In Content */}
        <TabsContent value="SIGNIN" className="w-full">
          <div className="flex flex-col justify-between items-center gap-10 p-2 md:p-10 w-full h-full">
            <div className="flex flex-col justify-start items-center gap-5 w-full h-full">
              <Input
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, "").slice(0, 10))}
                maxLength={10}
                type="tel"
                placeholder="Number (without +91)"
                className="bg-green-100 border-2 border-black rounded-lg h-10 overflow-hidden text-black"
                style={{ borderRadius: "12px" }}
              />
              
              <div className="relative w-full">
                <div className="relative">
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
                
                <div className="flex justify-center mt-7">
                  <LoadingButton
                    onClick={handleLogin}
                    isLoading={loginLoading}
                    className="bg-blue-950 p-2 sm:p-3 rounded-lg w-full sm:w-2/3 md:w-1/2 lg:w-1/2 h-9 sm:h-8 md:h-9 text-white text-lg sm:text-xl"
                    style={{ borderRadius: "12px" }}
                    disabled={!phoneNumber || !password}
                  >
                    Sign In
                  </LoadingButton>
                </div>
                
                <div className="flex justify-center mt-4">
                  <TeacherResetPassword flag="TEACHER" />
                </div>
                
                <div className="flex justify-center items-center mt-4 w-full">
                  <div className="flex-1 bg-gray-300 h-px" />
                  <span className="mx-2 text-gray-500 text-sm">OR</span>
                  <div className="flex-1 bg-gray-300 h-px" />
                </div>
              </div>

              <GoogleLogin 
                onSuccess={handleGoogleLogin} 
                onError={() => console.log('Google login failed')} 
              />
            </div>
          </div>
        </TabsContent>

        {/* Sign Up Content */}
        <TabsContent value="SIGNUP" className="w-full">
          <div className="flex flex-col justify-between items-center gap-10 p-2 md:p-10 w-full h-full">
            <h1 className="font-extrabold text-2xl">
              Tutor Sign-Up
            </h1>
            
            <div className="flex flex-col justify-start items-center gap-5 w-full h-full">
              <Input
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, "").slice(0, 10))}
                type="tel"
                maxLength={10}
                placeholder="Number (without +91)"
                className="bg-green-100 border-2 border-black rounded-lg h-10 overflow-hidden text-black"
                style={{ borderRadius: "12px" }}
              />
              
              <LoadingButton
                onClick={handleSignup}
                isLoading={otpLoading}
                disabled={!phoneNumber || phoneNumber.length !== 10 || otpLoading}
                className="bg-blue-950 rounded-lg h-10 text-white sm:text-base md:text-xl"
              >
                Send OTP
              </LoadingButton>
              
              <SendOTPDialog 
                open={otpDialogOpen} 
                setOpen={setOtpDialogOpen} 
                phoneNumber={phoneNumber} 
                model="teacher" 
              />
              
              <div className="flex justify-center items-center mt-4 w-full">
                <div className="flex-1 bg-gray-300 h-px" />
                <span className="mx-2 text-gray-500 text-sm">OR</span>
                <div className="flex-1 bg-gray-300 h-px" />
              </div>
              
              <GoogleLogin 
                onSuccess={handleGoogleLogin} 
                onError={() => console.log('Google login failed')} 
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}