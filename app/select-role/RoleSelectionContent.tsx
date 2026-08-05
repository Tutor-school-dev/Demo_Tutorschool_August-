"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RoleSelectionContent() {
  const router = useRouter();

  const handleTeacherLogin = () => {
    router.push('/auth?model=teacher');
  };

  const handleLearnerLogin = () => {
    router.push('/auth?model=parent');
  };

  return (
    <div className="flex justify-center items-center bg-[#E0F9F4] w-screen min-h-screen">
      <div className="relative flex flex-col w-full h-full">
        {/* Header */}
        <header className="bg-transparent py-6 w-full">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center">
              <Link href="/" className="flex items-center gap-2 text-primary hover:text-primary/80">
                <ArrowLeft className="h-5 w-5" />
                <span className="font-medium">Back to Home</span>
              </Link>
              
              <div className="flex justify-center items-center space-x-4">
                <Image 
                  className="h-20" 
                  src="/tutorschool-logo.jpg" 
                  alt="Company Logo" 
                  width={80}
                  height={80}
                />
                <div className="text-left">
                  <h1 className="font-bold text-gray-900 text-3xl md:text-4xl">
                    TutorSchool
                  </h1>
                  <p className="mt-1 text-gray-600 text-lg md:text-xl">
                    Your Learning. Your Way.
                  </p>
                </div>
              </div>
              
              <div className="w-[120px]"></div> {/* Spacer for centering */}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="relative flex md:flex-row flex-col gap-10 md:gap-0 bg-[#E0F9F4] w-full h-full">
          {/* Teacher Card */}
          <div className="flex flex-col justify-start items-center p-0 md:p-2 w-full md:w-1/2 md:min-w-[700px]">
            <div className="flex justify-center md:items-center bg-[#E0F9F4] w-full">
              <Card className="bg-white shadow-lg rounded-none sm:rounded-3xl w-full max-w-md overflow-hidden">
                <div className="pt-4 pb-8 text-center">
                  {/* Teacher Illustration */}
                  <div className="mb-8">
                    <Image
                      src="/teacher-illustration.jpg"
                      alt="Teacher illustration"
                      className="mx-auto w-full max-w-xs h-auto"
                      width={300}
                      height={200}
                    />
                  </div>

                  {/* Teacher Title */}
                  <h1 className="mb-12 font-bold text-gray-900 text-4xl md:text-5xl tracking-tight">
                    Teacher
                  </h1>

                  {/* Action Button */}
                  <div className="flex sm:flex-row flex-col justify-center gap-4">
                    <div>
                      <Button
                        onClick={handleTeacherLogin}
                        variant="outline"
                        size="lg"
                        className="flex-1 sm:flex-none bg-white hover:bg-gray-50 px-4 sm:px-8 py-2 sm:py-3 border-2 border-gray-200 rounded-2xl w-40 sm:w-52 md:w-72 font-medium text-gray-700 text-base sm:text-lg"
                      >
                        Login/Sign Up
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Learner Card */}
          <div className="flex flex-col justify-start items-center p-0 md:p-2 w-full md:w-1/2 md:min-w-[700px] h-full">
            <div className="flex justify-center md:items-center bg-[#E0F9F4] w-full">
              <Card className="bg-white shadow-lg rounded-none sm:rounded-3xl w-full max-w-md overflow-hidden">
                <div className="pt-4 pb-8 text-center">
                  {/* Learner Illustration */}
                  <div className="mb-8">
                    <Image
                      src="/learner-illustration.jpg"
                      alt="Learner illustration"
                      className="mx-auto w-full max-w-xs h-auto"
                      width={300}
                      height={200}
                    />
                  </div>

                  {/* Learner Title */}
                  <h1 className="mb-12 font-bold text-gray-900 text-4xl md:text-5xl tracking-tight">
                    Learner
                  </h1>

                  {/* Action Button */}
                  <div className="flex sm:flex-row flex-col justify-center gap-4">
                    <div>
                      <Button
                        onClick={handleLearnerLogin}
                        variant="outline"
                        size="lg"
                        className="flex-1 sm:flex-none bg-white hover:bg-gray-50 px-4 sm:px-8 py-2 sm:py-3 border-2 border-gray-200 rounded-2xl w-40 sm:w-52 md:w-72 font-medium text-gray-700 text-base sm:text-lg"
                      >
                        Login/Sign Up
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}