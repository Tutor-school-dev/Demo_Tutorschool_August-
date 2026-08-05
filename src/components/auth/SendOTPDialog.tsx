import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { LoadingButton } from "@/components/ui/LoadingButton";
import { OTPInput } from "@/components/ui/OTPInput";
import { useVerifyOTP } from "@/hooks/useVerifyOTP";
import { useState } from "react";

interface SendOTPDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  phoneNumber: string;
  model: string;
}

export default function SendOTPDialog({ open, setOpen, phoneNumber, model }: SendOTPDialogProps) {
  const [value, setValue] = useState("");
  const { VerifyOTP, VerifyOTPLoading } = useVerifyOTP();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="bg-white p-1 md:p-4 w-full md:max-w-[420px]">
        <DialogHeader>
          <DialogTitle>Enter OTP</DialogTitle>
          <DialogDescription>
            Please enter your OTP here
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center">
          <div className="">
            <Label htmlFor="otp" className="text-right">
              OTP
            </Label>
            <OTPInput value={value} setValue={setValue} />
          </div>
        </div>
        <DialogFooter>
          <LoadingButton 
            isLoading={VerifyOTPLoading} 
            onClick={() => VerifyOTP(setOpen, phoneNumber, value, model)}
            disabled={value.length !== 6}
          >
            Submit
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}