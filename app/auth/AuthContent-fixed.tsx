"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Users, GraduationCap, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import TeacherAuth from "@/components/auth/TeacherAuth";
import StudentAuth from "@/components/auth/StudentAuth";

export default function AuthContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(searchParams.get('type') || 'student');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const tutorImages = ["/teacher-illustration.jpg", "/learner-illustration.jpg"];
  const skills = ["Grammar", "Vocabulary", "Pronunciations", "Business English"];

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set('type', value);
    router.push(`/auth?${newParams.toString()}`);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % tutorImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + tutorImages.length) % tutorImages.length);
  };

  useEffect(() => {
    if (!isPaused) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % tutorImages.length);
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [isPaused, tutorImages.length]);

  return (
    <div className="flex flex-row bg-indigo-50 w-full min-h-screen">
      {/* Left side - Auth Form */}
      <div className="flex flex-col items-center gap-4 bg-indigo-50 p-0 md:p-4 w-full md:w-1/2 md:min-w-[800px] h-full min-h-screen">
        <div className="flex justify-center items-center bg-white md:bg-indigo-50 w-full h-full">
          <div className="bg-white shadow-lg rounded-none md:rounded-3xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <Link href="/select-role" className="flex items-center gap-2 text-primary hover:text-primary/80">
                <ArrowLeft className="h-5 w-5" />
                <span className="font-medium text-sm">Back</span>
              </Link>
              <div className="text-lg font-bold text-primary">TutorSchool</div>
            </div>

            <Card className="border-gray-300">
              <CardHeader className="pb-4">
                <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-4">
                    <TabsTrigger value="student" className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Student/Parent
                    </TabsTrigger>
                    <TabsTrigger value="teacher" className="flex items-center gap-2">
                      <GraduationCap className="h-4 w-4" />
                      Teacher
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
                <CardTitle>
                  {activeTab === 'student' ? 'Student/Parent Login' : 'Teacher Login'}
                </CardTitle>
              </CardHeader>

              <CardContent className="pt-0">
                <Tabs value={activeTab} className="w-full">
                  <TabsContent value="student" className="mt-0">
                    <StudentAuth />
                  </TabsContent>
                  <TabsContent value="teacher" className="mt-0">
                    <TeacherAuth />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Right side - Illustration & Skills */}
      <div className="hidden xl:flex justify-center items-center bg-indigo-100 w-1/2 overflow-hidden">
        <div className="bg-gradient-to-b from-purple-100 to-purple-200 shadow-lg p-6 rounded-3xl h-fit">
          <div className="mb-6 text-center">
            <h2 className="font-semibold text-gray-800 text-xl leading-tight">
              Expert Tutor for
              <br />
              your needs
            </h2>
          </div>

          <div className="flex justify-center mb-6">
            <div
              className="relative bg-gray-200 rounded-2xl w-64 h-64 overflow-hidden"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              <Image
                src={tutorImages[currentImageIndex] || "/placeholder.svg"}
                alt="Tutor illustration"
                className="object-cover transition-all duration-500 ease-in-out w-full h-full"
                width={256}
                height={256}
              />

              <button
                onClick={prevImage}
                className="top-1/2 left-2 absolute bg-white/80 hover:bg-white/90 shadow-md backdrop-blur-sm p-1.5 rounded-full transition-colors -translate-y-1/2"
                aria-label="Previous tutor"
              >
                <ChevronLeft className="w-4 h-4 text-gray-700" />
              </button>

              <button
                onClick={nextImage}
                className="top-1/2 right-2 absolute bg-white/80 hover:bg-white/90 shadow-md backdrop-blur-sm p-1.5 rounded-full transition-colors -translate-y-1/2"
                aria-label="Next tutor"
              >
                <ChevronRight className="w-4 h-4 text-gray-700" />
              </button>

              <div className="bottom-2 left-1/2 absolute flex gap-1 -translate-x-1/2">
                {tutorImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentImageIndex ? "bg-white scale-110" : "bg-white/50"
                    }`}
                    aria-label={`Go to tutor ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-3 mb-6">
            <div className="flex flex-wrap justify-center gap-2">
              {skills.slice(0, 3).map((skill) => (
                <span
                  key={skill}
                  className="bg-white/80 backdrop-blur-sm px-4 py-2 border border-gray-200 rounded-full font-medium text-gray-700 text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap justify-center gap-2">
              {skills.slice(3).map((skill) => (
                <span
                  key={skill}
                  className="bg-white/80 backdrop-blur-sm px-4 py-2 border border-gray-200 rounded-full font-medium text-gray-700 text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="flex justify-center">
            <div className="bg-purple-600 rounded-full w-3 h-3"></div>
          </div>
        </div>
      </div>
    </div>
  );
}