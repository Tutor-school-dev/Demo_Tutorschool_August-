"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight, GraduationCap, BookOpen } from "lucide-react";
import Image from "next/image";
import StudentAuth from "@/components/auth/StudentAuth";
import TeacherAuth from "@/components/auth/TeacherAuth";

export default function AuthContent() {
  const searchParams = useSearchParams();
  const model = searchParams.get('model') || searchParams.get('flag') || searchParams.get('type');

  const [selectedRole, setSelectedRole] = useState<"student" | "teacher" | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (model) {
      const m = model.toLowerCase();
      if (m === "student") setSelectedRole("student");
      else if (m === "teacher") setSelectedRole("teacher");
      const titleCaseModel = model.charAt(0).toUpperCase() + model.slice(1).toLowerCase();
      localStorage.setItem("model", titleCaseModel);
    }
  }, [model]);

  const tutorImages = ["/teacher-illustration.jpg", "/learner-illustration.jpg"];
  const skills = ["Grammar", "Vocabulary", "Pronunciations", "Business English"];

  useEffect(() => {
    if (!isPaused) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % tutorImages.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isPaused, tutorImages.length]);

  const nextImage = () => setCurrentImageIndex((prev) => (prev + 1) % tutorImages.length);
  const prevImage = () => setCurrentImageIndex((prev) => (prev - 1 + tutorImages.length) % tutorImages.length);

  const headerText = selectedRole === "student"
    ? "Track Your Learning\nFind Your Tutor"
    : selectedRole === "teacher"
    ? "Expert Tutor for\nyour needs"
    : "Personalized Learning\nfor Everyone";

  const specializedText = selectedRole === "student" ? "Learn better with:" : "Specialized in:";

  const renderAuthForm = () => {
    if (!selectedRole) {
      return (
        <div className="space-y-6 w-full">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-800 mb-1">Welcome to TutorSchool</h2>
            <p className="text-sm text-gray-500">Choose your role to continue</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setSelectedRole("student")}
              className="flex flex-col items-center gap-3 p-6 rounded-xl border-2 border-gray-200 hover:border-emerald-500 hover:bg-emerald-50 transition-all group"
            >
              <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
                <GraduationCap className="w-7 h-7 text-emerald-600" />
              </div>
              <span className="font-medium text-gray-800">Student</span>
              <span className="text-xs text-gray-500 text-center">Take assessments &amp; find tutors</span>
            </button>

            <button
              onClick={() => setSelectedRole("teacher")}
              className="flex flex-col items-center gap-3 p-6 rounded-xl border-2 border-gray-200 hover:border-emerald-500 hover:bg-emerald-50 transition-all group"
            >
              <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
                <BookOpen className="w-7 h-7 text-emerald-600" />
              </div>
              <span className="font-medium text-gray-800">Teacher</span>
              <span className="text-xs text-gray-500 text-center">Assess your style &amp; find students</span>
            </button>
          </div>

          <p className="text-xs text-center text-gray-400">
            Create your account to get started
          </p>
        </div>
      );
    }

    return (
      <div className="w-full">
        <button
          onClick={() => setSelectedRole(null)}
          className="flex items-center gap-1 text-sm text-emerald-600 hover:text-emerald-700 mb-4 font-medium"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to role selection
        </button>
        {selectedRole === "student" ? <StudentAuth /> : <TeacherAuth />}
      </div>
    );
  };

  return (
    <div className="relative flex flex-row bg-[#E0F9F4] w-full h-screen">
      {/* Left side - Auth Form */}
      <div className="flex flex-col items-center gap-4 bg-[#E0F9F4] p-0 md:p-4 w-full md:w-1/2 md:min-w-[800px] h-full min-h-screen">
        <div className="flex justify-center items-center bg-white md:bg-[#E0F9F4] w-full h-full">
          <div className="flex flex-col justify-between items-center bg-white p-7 rounded-none md:rounded-xl w-full md:w-4/5">
            <Image
              className="mb-5 h-20"
              src="/tutorschool-logo.jpg"
              alt="TutorSchool Logo"
              width={80}
              height={80}
            />
            {renderAuthForm()}
          </div>
        </div>
      </div>

      {/* Right side - Image Carousel */}
      <div className="hidden xl:flex justify-center items-center bg-[#E0F9F4] w-1/2 overflow-hidden">
        <div className="bg-gradient-to-b from-purple-100 to-purple-200 shadow-lg p-6 rounded-3xl h-fit">
          <div className="mb-6 text-center">
            <h2 className="font-semibold text-gray-800 text-xl leading-tight whitespace-pre-line">
              {headerText}
            </h2>
          </div>

          <div className="flex justify-center mb-6">
            <div
              className="relative bg-gray-200 rounded-2xl w-64 h-64 overflow-hidden"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              <Image
                src={tutorImages[currentImageIndex]}
                alt={`Educational scene ${currentImageIndex + 1}`}
                className="object-cover transition-all duration-500 ease-in-out w-full h-full"
                width={256}
                height={256}
                loading="lazy"
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

              <div className="bottom-2 left-1/2 absolute flex space-x-1 -translate-x-1/2">
                {tutorImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentImageIndex ? "bg-white" : "bg-white/50"
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="text-center text-gray-600 text-sm">
              {specializedText}
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
              {skills.map((skill, index) => (
                <span
                  key={index}
                  className="bg-white/70 hover:bg-white/90 px-3 py-1 rounded-full text-gray-700 text-sm transition-colors cursor-default"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
