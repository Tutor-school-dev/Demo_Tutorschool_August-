import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingButton } from "@/components/ui/LoadingButton";
import { OTPInput } from "@/components/ui/OTPInput";
import { useTeacherPasswordReset } from "@/hooks/useTeacherPasswordReset";

interface TeacherResetPasswordProps {
  flag: string;
}

export function TeacherResetPassword({ flag }: TeacherResetPasswordProps) {
  const [open, setOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  
  const { sendResetOTP, changePassword, loading } = useTeacherPasswordReset();

  const handleSendOTP = () => {
    if (!phoneNumber || phoneNumber.length !== 10) {
      return;
    }
    sendResetOTP(phoneNumber, setOtpSent);
  };

  const handleChangePassword = () => {
    if (!phoneNumber || !otp || !newPassword) {
      return;
    }
    changePassword(phoneNumber, otp, newPassword, setOpen);
  };

  const resetDialog = () => {
    setPhoneNumber("");
    setOtp("");
    setNewPassword("");
    setOtpSent(false);
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      setOpen(isOpen);
      if (!isOpen) resetDialog();
    }}>
      <DialogTrigger asChild>
        <Button variant="link" className="text-blue-600 hover:text-blue-800 text-sm">
          Forgot Password?
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Reset Password</DialogTitle>
          <DialogDescription>
            {!otpSent 
              ? "Enter your phone number to receive an OTP"
              : "Enter the OTP and your new password"
            }
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="Enter 10-digit number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, "").slice(0, 10))}
              maxLength={10}
              disabled={otpSent}
            />
          </div>
          
          {!otpSent ? (
            <LoadingButton
              isLoading={loading}
              onClick={handleSendOTP}
              disabled={phoneNumber.length !== 10}
              className="w-full"
            >
              Send OTP
            </LoadingButton>
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="otp">Enter OTP</Label>
                <div className="flex justify-center">
                  <OTPInput value={otp} setValue={setOtp} />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              
              <LoadingButton
                isLoading={loading}
                onClick={handleChangePassword}
                disabled={otp.length !== 6 || !newPassword}
                className="w-full"
              >
                Change Password
              </LoadingButton>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}