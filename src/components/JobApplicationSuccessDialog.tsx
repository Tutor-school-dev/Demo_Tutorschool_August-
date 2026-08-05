"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle, Mail, Clock } from "lucide-react";

interface JobApplicationSuccessDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  jobTitle?: string;
}

export function JobApplicationSuccessDialog({ 
  open, 
  onOpenChange, 
  jobTitle 
}: JobApplicationSuccessDialogProps) {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (open) {
      setShowConfetti(true);
      // Remove confetti effect after animation
      const timer = setTimeout(() => setShowConfetti(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md text-center">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <DialogTitle className="text-xl font-semibold text-green-700">
            Application Submitted Successfully!
          </DialogTitle>
          <DialogDescription className="text-base text-gray-600 mt-2">
            You have successfully applied for this job.
            {jobTitle && (
              <span className="block mt-1 font-medium text-gray-800">
                "{jobTitle}"
              </span>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex items-center justify-center space-x-3 text-sm text-gray-600">
            <Mail className="h-4 w-4" />
            <span>You'll receive a response from us soon</span>
          </div>
          
          <div className="flex items-center justify-center space-x-3 text-sm text-gray-600">
            <Clock className="h-4 w-4" />
            <span>We typically respond within 24-48 hours</span>
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-800">
            <strong>What's next?</strong><br />
            Our team will review your application and contact you if your profile matches the requirements.
          </p>
        </div>

        <div className="flex flex-col gap-2 pt-4">
          <Button 
            onClick={() => onOpenChange(false)}
            className="w-full"
          >
            Continue Browsing Jobs
          </Button>
          <Button 
            variant="outline" 
            onClick={() => {
              onOpenChange(false);
              window.open('/dashboard/teacher', '_blank');
            }}
            className="w-full"
          >
            Go to Dashboard
          </Button>
        </div>

        {/* Simple confetti effect */}
        {showConfetti && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="confetti-container">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="confetti"
                  style={{
                    left: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 3}s`,
                    backgroundColor: ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6'][Math.floor(Math.random() * 5)],
                  }}
                />
              ))}
            </div>
          </div>
        )}

        <style jsx>{`
          .confetti-container {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            overflow: hidden;
            pointer-events: none;
          }
          
          .confetti {
            position: absolute;
            width: 8px;
            height: 8px;
            opacity: 0.8;
            animation: confetti-fall 3s linear infinite;
          }
          
          @keyframes confetti-fall {
            0% {
              transform: translateY(-100px) rotate(0deg);
              opacity: 1;
            }
            100% {
              transform: translateY(400px) rotate(720deg);
              opacity: 0;
            }
          }
        `}</style>
      </DialogContent>
    </Dialog>
  );
}