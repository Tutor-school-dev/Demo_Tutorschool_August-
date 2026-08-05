"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingButton } from "@/components/ui/LoadingButton";
import { GoogleLogin } from "@react-oauth/google";
import { useTeacherLogin } from "@/hooks/useTeacherLogin";
import { useTeacherGoogleLogin } from "@/hooks/useTeacherGoogleLogin";
import { useSendOTP } from "@/hooks/useSendOTP";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

interface JobApplicationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  jobId: string;
  onApplicationSuccess?: () => void;
}

export function JobApplicationDialog({ 
  open, 
  onOpenChange, 
  jobId,
  onApplicationSuccess 
}: JobApplicationDialogProps) {
  const [activeTab, setActiveTab] = useState("login");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Use hooks with job application context
  const { login, loading: loginLoading } = useTeacherLogin("fromJobListing", jobId);
  const { handleGoogleLogin, loading: googleLoading } = useTeacherGoogleLogin("fromJobListing", jobId);
  const { SendOTP, loading: otpLoading } = useSendOTP();

  const handleManualLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber || !password) {
      toast.error("Please enter phone number and password");
      return;
    }
    
    try {
      await login(e, phoneNumber, password);
      // If we reach here, login was successful
      // The login hook will handle job application automatically
      onOpenChange(false);
      onApplicationSuccess?.();
    } catch (error) {
      console.error("Login failed:", error);
      // Error handling is done by the login hook
    }
  };

  const handleGoogleLoginClick = async (response: any) => {
    try {
      await handleGoogleLogin(response);
      // Google login hook will handle job application automatically
      onOpenChange(false);
      onApplicationSuccess?.();
    } catch (error) {
      console.error("Google login error:", error);
    }
  };

  const handleOTPSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber) {
      toast.error("Please enter phone number");
      return;
    }
    
    // For now, just send OTP for teacher model
    // We'll handle the job application redirect in the OTP verification flow
    await SendOTP(phoneNumber, () => {}, "teacher");
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 10);
    setPhoneNumber(value);
  };

  const isLoading = loginLoading || googleLoading || otpLoading;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Apply for this Job</DialogTitle>
          <DialogDescription>
            Login or create an account to apply for this tutoring position.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          {/* Login Tab */}
          <TabsContent value="login" className="space-y-4">
            <form onSubmit={handleManualLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-phone">Phone Number</Label>
                <Input
                  id="login-phone"
                  type="tel"
                  placeholder="Enter 10-digit phone number"
                  value={phoneNumber}
                  onChange={handlePhoneChange}
                  maxLength={10}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="login-password">Password</Label>
                <div className="relative">
                  <Input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <LoadingButton 
                type="submit" 
                className="w-full" 
                isLoading={loginLoading}
                disabled={isLoading}
              >
                Login & Apply
              </LoadingButton>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleLoginClick}
                onError={() => toast.error("Google login failed")}
                text="signin_with"
                size="large"
                width="100%"
              />
            </div>
          </TabsContent>

          {/* Signup Tab */}
          <TabsContent value="signup" className="space-y-4">
            <form onSubmit={handleOTPSignup} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signup-phone">Phone Number</Label>
                <Input
                  id="signup-phone"
                  type="tel"
                  placeholder="Enter 10-digit phone number"
                  value={phoneNumber}
                  onChange={handlePhoneChange}
                  maxLength={10}
                  required
                />
              </div>

              <LoadingButton 
                type="submit" 
                className="w-full" 
                isLoading={otpLoading}
                disabled={isLoading}
              >
                Send OTP & Apply
              </LoadingButton>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleLoginClick}
                onError={() => toast.error("Google signup failed")}
                text="signup_with"
                size="large"
                width="100%"
              />
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}