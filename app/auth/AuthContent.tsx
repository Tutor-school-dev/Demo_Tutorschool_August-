"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import SignUpTabs from "@/components/auth/SignUpTabs";

export default function AuthContent() {
  const searchParams = useSearchParams();
  const mode = searchParams.get('mode');
  const model = searchParams.get('model') || searchParams.get('flag') || searchParams.get('type');
  
  // Store model in localStorage (matching React app pattern)
  useEffect(() => {
    if (model && typeof window !== 'undefined') {
      // Use title case to match React repo pattern (Parent/Teacher)
      const titleCaseModel = model.charAt(0).toUpperCase() + model.slice(1).toLowerCase();
      localStorage.setItem("model", titleCaseModel);
    }
  }, [model]);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

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

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % tutorImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + tutorImages.length) % tutorImages.length);
  };

  // Determine if this is parent/learner flow
  const isParent = model?.toLowerCase() === 'parent' || model?.toLowerCase() === 'learner';
  const isStudent = model?.toLowerCase() === 'student';

  // Dynamic content based on user type
  const headerText = isStudent
    ? "Track Your Learning\nFind Your Tutor"
    : isParent
    ? "Find Expert Tutors\nfor your child"
    : "Expert Tutor for\nyour needs";

  const specializedText = isStudent ? "Learn better with:" : isParent ? "Find tutors for:" : "Specialized in:";

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
            <SignUpTabs mode={mode || undefined} />
          </div>
        </div>
      </div>

      {/* Right side - Image Carousel */}
      <div className="hidden xl:flex justify-center items-center bg-[#E0F9F4] w-1/2 overflow-hidden">
        {/* Card container with gradient background */}
        <div className="bg-gradient-to-b from-purple-100 to-purple-200 shadow-lg p-6 rounded-3xl h-fit">
          {/* Header text */}
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

              {/* Carousel navigation buttons */}
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

              {/* Carousel indicators */}
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

          {/* Skills display */}
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