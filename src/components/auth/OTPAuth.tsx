"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { LoadingButton } from "@/components/ui/LoadingButton";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useOTPRequest } from "@/hooks/useOTPRequest";
import { useOTPVerify } from "@/hooks/useOTPVerify";
import { ArrowLeft } from "lucide-react";

interface OTPAuthProps {
  userType: 'teacher' | 'parent';
  isSignup?: boolean;
  signupData?: any;
  onBack?: () => void;
}

export default function OTPAuth({ userType, isSignup = false, signupData, onBack }: OTPAuthProps) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [showOTPInput, setShowOTPInput] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const { requestOTP, loading: otpRequestLoading } = useOTPRequest();
  const { verifyOTP, loading: verifyLoading } = useOTPVerify();

  // Countdown timer for resend OTP
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber || phoneNumber.length !== 10) {
      return;
    }

    const result = await requestOTP(phoneNumber, userType);
    if (result) {
      setShowOTPInput(true);
      setCountdown(30); // 30 seconds countdown
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) {
      return;
    }

    const result = await verifyOTP(phoneNumber, otp, userType, isSignup, signupData);
    if (result.success) {
      // Navigation is handled inside the hook
      console.log("OTP verification successful");
    }
  };

  const handleResendOTP = async () => {
    if (countdown > 0) return;
    
    const result = await requestOTP(phoneNumber, userType);
    if (result) {
      setCountdown(30);
      setOtp(""); // Clear previous OTP
    }
  };

  const handleBackToPhone = () => {
    setShowOTPInput(false);
    setOtp("");
    setCountdown(0);
  };

  if (!showOTPInput) {
    return (
      <div className="flex flex-col justify-between items-center gap-6 p-4 w-full h-full">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground self-start"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        )}

        <div className="text-center mb-4">
          <h3 className="text-lg font-semibold mb-2">
            {isSignup ? 'Create Account with OTP' : 'Login with OTP'}
          </h3>
          <p className="text-sm text-muted-foreground">
            We'll send a verification code to your phone number
          </p>
        </div>

        <form onSubmit={handleSendOTP} className="space-y-4 w-full">
          <Input
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
            maxLength={10}
            type="tel"
            placeholder="Enter 10-digit phone number"
            className="bg-green-100 border-2 border-black rounded-lg h-10 text-black text-center"
            style={{ borderRadius: "12px" }}
            required
          />

          <div className="flex justify-center mt-7">
            <LoadingButton
              type="submit"
              isLoading={otpRequestLoading}
              className="bg-blue-950 p-2 sm:p-3 rounded-lg w-full sm:w-2/3 md:w-1/2 lg:w-1/2 h-9 sm:h-8 md:h-9 text-primary-100 text-lg sm:text-xl"
              style={{ borderRadius: "12px" }}
              disabled={!phoneNumber || phoneNumber.length !== 10}
            >
              Send OTP
            </LoadingButton>
          </div>
        </form>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200 w-full">
          <h4 className="text-sm font-semibold text-blue-800 mb-2">
            Why use OTP?
          </h4>
          <ul className="text-xs text-blue-700 space-y-1">
            <li>• Quick and secure authentication</li>
            <li>• No need to remember passwords</li>
            <li>• Instant verification</li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-between items-center gap-6 p-4 w-full h-full">
      <button
        type="button"
        onClick={handleBackToPhone}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground self-start"
      >
        <ArrowLeft className="w-4 h-4" />
        Change Number
      </button>

      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold mb-2">Enter Verification Code</h3>
        <p className="text-sm text-muted-foreground">
          We've sent a 6-digit code to +91 {phoneNumber}
        </p>
      </div>

      <form onSubmit={handleVerifyOTP} className="space-y-6 w-full">
        <div className="flex justify-center">
          <InputOTP
            maxLength={6}
            value={otp}
            onChange={(value) => setOtp(value)}
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </div>

        <div className="flex justify-center mt-7">
          <LoadingButton
            type="submit"
            isLoading={verifyLoading}
            className="bg-blue-950 p-2 sm:p-3 rounded-lg w-full sm:w-2/3 md:w-1/2 lg:w-1/2 h-9 sm:h-8 md:h-9 text-primary-100 text-lg sm:text-xl"
            style={{ borderRadius: "12px" }}
            disabled={!otp || otp.length !== 6}
          >
            Verify OTP
          </LoadingButton>
        </div>

        <div className="text-center">
          {countdown > 0 ? (
            <p className="text-sm text-muted-foreground">
              Resend OTP in {countdown}s
            </p>
          ) : (
            <button
              type="button"
              onClick={handleResendOTP}
              className="text-sm text-primary hover:underline"
              disabled={otpRequestLoading}
            >
              {otpRequestLoading ? "Sending..." : "Resend OTP"}
            </button>
          )}
        </div>
      </form>

      <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200 w-full">
        <p className="text-xs text-yellow-700 text-center">
          Don't share your OTP with anyone. TutorSchool will never ask for your OTP.
        </p>
      </div>
    </div>
  );
}