"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Check } from "lucide-react";
import Image from "next/image";
import Education from "./Education";
import Location from "./Location";

const steps = [
  "Basic Info",
  "Location",
];

export default function TeacherProfileContent() {
  const [currentStep, setCurrentStep] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const searchParams = useSearchParams();
  
  const currentStepName = searchParams?.get('step') || null;

  const carouselImages = [
    "/teacher-illustration.jpg",
    "/learner-illustration.jpg"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % carouselImages.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [carouselImages.length]);

  useEffect(() => {
    if (currentStepName) {
      for (let index = 0; index < steps.length; index++) {
        const stepName = steps[index].toLowerCase().replace(' ', '_');
        if (stepName === currentStepName.split('_')[0].toLowerCase()) {
          setCurrentStep(index);
          break;
        }
      }
    }
  }, [currentStepName]);

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <Education onNext={nextStep} />;
      case 1:
        return <Location onNext={nextStep} model="teacher" />;
      default:
        return null;
    }
  };

  function nextStep() {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  }

  return (
    <div className="relative flex flex-row w-full h-full">
      {/* Left Image Section */}
      <div className="hidden md:block relative w-full md:w-1/2">
        <div className="relative w-full h-full">
          {carouselImages.map((image, index) => (
            <Image
              key={index}
              src={image}
              alt={`Educational scene ${index + 1}`}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                index === currentImageIndex ? "opacity-100" : "opacity-0"
              }`}
              width={800}
              height={800}
              loading="lazy"
            />
          ))}

          <div className="bottom-6 left-1/2 z-10 absolute flex space-x-2 -translate-x-1/2 transform">
            {carouselImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentImageIndex ? "bg-white shadow-lg" : "bg-white/50 hover:bg-white/75"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#E0F9F4]/20 to-[#E0F9F4]"></div>
      </div>

      {/* Form Section */}
      <div className="flex flex-col justify-start items-center gap-4 bg-[#E0F9F4] p-4 w-full md:w-1/2 md:min-w-[800px] h-full min-h-screen">
        <div className="p-4 md:p-5 w-full">
          <div className="flex justify-evenly w-full">
            {steps.map((step, index) => (
              <div
                key={step}
                className={`flex flex-col items-center ${
                  index === currentStep
                    ? "text-primary"
                    : index < currentStep
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              >
                <div
                  className={`flex h-7 w-7 items-center justify-center rounded-full bg-secondary-900 ${
                    index === currentStep
                      ? "border-2 border-primary-400 font-semibold"
                      : index < currentStep
                      ? "bg-primary text-primary-foreground"
                      : ""
                  }`}
                >
                  {index < currentStep ? (
                    <Check className="w-5 h-5 text-background-100" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>
                <span className="font-semibold text-xs text-center">{step}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full md:w-4/5">{renderStep()}</div>
      </div>
    </div>
  );
}