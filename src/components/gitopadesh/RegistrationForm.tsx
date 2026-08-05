"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronRight, ChevronLeft, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { VideoUpload } from "./VideoUpload";
import { useFormSubmit, FormData } from "@/hooks/useFormSubmit";
import { LoadingButton } from "@/components/ui/LoadingButton";

// TypeScript declarations for analytics
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

const RegistrationForm = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
  const [formData, setFormData] = useState<FormData>({
    parentName: "",
    parentEmail: "",
    parentPhone: "",
    childName: "",
    childAge: "",
    theme: "",
    video: null,
    slokaRecited: ""
  });
  const { toast } = useToast();
  const { submitForm, loading, progress } = useFormSubmit();

  const totalSteps = 4;

  const progressPercentage = (currentStep / totalSteps) * 100;

  // Track form start on component mount
  useEffect(() => {
    // Only track form started
    if (typeof window !== 'undefined' && window.dataLayer) {
      console.log('Pushing to dataLayer:', { event: 'gsc_step_reached', step_number: 1 }); // Debug log
      window.dataLayer.push({
        event: 'gsc_step_reached',
        step_number: 1
      });
    }
  }, []);

  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleVideoSelect = (file: File | null) => {
    setSelectedVideo(file);
    setFormData(prev => ({ ...prev, video: file }));
  };

  const getThemesByAge = (age: string) => {
    const ageNum = parseInt(age);
    if (ageNum >= 6 && ageNum <= 8) {
      return [
        "Theme 1: Exploring Inner Potential",
        "Theme 2: Mastering Your Faculties",
        "Theme 3: Habit Formation",
        "Theme 4: Trigunas",
        "Theme 5: Freedom from bondage"
      ];
    } else if (ageNum >= 9 && ageNum <= 11) {
      return [
        "Theme 6: Exploring True Self (Nature of Soul)",
        "Theme 7: Gita in Day-to-Day Life",
        "Theme 8: Leading Life according to Varna Ashrama",
        "Theme 9: Unity in Diversity",
        "Theme 10: Personality Development"
      ];
    } else if (ageNum >= 12 && ageNum <= 14) {
      return [
        "Theme 11: Relationships",
        "Theme 12: Service to Society & Environment",
        "Theme 13: Shradha & Bhakti",
        "Theme 14: Sacrifice and Sense Control",
        "Theme 15: Spirituality and Wisdom"
      ];
    } else if (ageNum >= 15 && ageNum <= 17) {
      return [
        "Theme 16: Time Management",
        "Theme 17: Yoga",
        "Theme 18: Leadership and Society",
        "Theme 19: Contemplative Life",
        "Theme 20: Surrender"
      ];
    }
    return [];
  };

  const validateStep = (step: number) => {
    switch (step) {
      case 1: {
        if (!formData.parentName || !formData.parentEmail || !formData.parentPhone) {
          return false;
        }
        
        // Email validation - must have gmail.com domain
        const emailRegex = /^[^\s@]+@gmail\.com$/;
        if (!emailRegex.test(formData.parentEmail)) {
          return false;
        }
        
        // Phone validation - must be exactly 10 digits
        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(formData.parentPhone.replace(/\s+/g, ''))) {
          return false;
        }
        
        return true;
      }
      case 2:
        return formData.childName && formData.childAge;
      case 3:
        return formData.theme && formData.slokaRecited;
      case 4:
        return formData.video !== null;
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      const nextStepNumber = Math.min(currentStep + 1, totalSteps);
      
      setCurrentStep(nextStepNumber);

      // Only track when user reaches next step
      if (nextStepNumber <= totalSteps && typeof window !== 'undefined' && window.dataLayer) {
        console.log('Pushing to dataLayer:', { event: 'gsc_step_reached', step_number: nextStepNumber }); // Debug log
        window.dataLayer.push({
          event: 'gsc_step_reached',
          step_number: nextStepNumber
        });
      }
    } else {
      // Provide specific validation messages for Step 1
      if (currentStep === 1) {
        if (!formData.parentName || !formData.parentEmail || !formData.parentPhone) {
          toast({
            title: "Please fill all required fields",
            description: "Make sure to complete all fields before proceeding.",
            variant: "destructive"
          });
        } else {
          // Check email validation
          const emailRegex = /^[^\s@]+@gmail\.com$/;
          if (!emailRegex.test(formData.parentEmail)) {
            toast({
              title: "Invalid Email Address",
              description: "Please use a Gmail address (e.g., example@gmail.com)",
              variant: "destructive"
            });
            return;
          }
          
          // Check phone validation
          const phoneRegex = /^\d{10}$/;
          if (!phoneRegex.test(formData.parentPhone.replace(/\s+/g, ''))) {
            toast({
              title: "Invalid Phone Number",
              description: "Please enter a valid 10-digit phone number",
              variant: "destructive"
            });
            return;
          }
        }
      } else {
        toast({
          title: "Please fill all required fields",
          description: "Make sure to complete all fields before proceeding.",
          variant: "destructive"
        });
      }
    }
  };

  const prevStep = () => {
    const prevStepNumber = Math.max(currentStep - 1, 1);
    setCurrentStep(prevStepNumber);
  };

  const handleSubmit = async () => {
    // Validate all steps before submission
    let allStepsValid = true;
    let errorMessage = "";

    // Check Step 1 validation
    if (!formData.parentName || !formData.parentEmail || !formData.parentPhone) {
      allStepsValid = false;
      errorMessage = "Please complete all parent/guardian information.";
    } else {
      const emailRegex = /^[^\s@]+@gmail\.com$/;
      if (!emailRegex.test(formData.parentEmail)) {
        allStepsValid = false;
        errorMessage = "Please use a Gmail address (e.g., example@gmail.com)";
      }
      
      const phoneRegex = /^\d{10}$/;
      if (!phoneRegex.test(formData.parentPhone.replace(/\s+/g, ''))) {
        allStepsValid = false;
        errorMessage = "Please enter a valid 10-digit phone number";
      }
    }

    // Check other steps
    if (allStepsValid && (!formData.childName || !formData.childAge)) {
      allStepsValid = false;
      errorMessage = "Please complete all participant information.";
    }

    if (allStepsValid && (!formData.theme || !formData.slokaRecited)) {
      allStepsValid = false;
      errorMessage = "Please complete theme selection and sloka information.";
    }

    if (allStepsValid && !formData.video) {
      allStepsValid = false;
      errorMessage = "Please upload a video file.";
    }

    if (allStepsValid) {
      const success = await submitForm(formData);
      if (success) {
        // Only track form completion
        if (typeof window !== 'undefined' && window.dataLayer) {
          window.dataLayer.push({
            event: 'gsc_form_completed'
          });
        }

        toast({
          title: "Registration Successful! 🎉",
          description: "Your Gitopadesh submission has been received. You'll hear from us soon!",
        });
        
        // Reset form
        setFormData({
          parentName: "",
          parentEmail: "",
          parentPhone: "",
          childName: "",
          childAge: "",
          theme: "",
          video: null,
          slokaRecited: ""
        });
        setSelectedVideo(null);
        setCurrentStep(1);
        
        // Redirect to homepage after a short delay to allow user to see the success message
        setTimeout(() => {
          router.push('/');
        }, 2000);
      }
    } else {
      toast({
        title: "Validation Error",
        description: errorMessage,
        variant: "destructive"
      });
    }
  };

  return (
    <section id="registration-form" className="py-20 bg-gradient-to-b from-white to-secondary/20">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 text-foreground">
            Register Now
          </h2>
          <p className="text-center text-muted-foreground text-lg mb-12">
            Join the global competition and showcase your knowledge of the Bhagavad Gita
          </p>

          {/* Progress Bar */}
          <Card className="p-6 mb-8">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-medium text-muted-foreground">Step {currentStep} of {totalSteps}</span>
              <span className="text-sm font-medium text-primary">{Math.round(progressPercentage)}%</span>
            </div>
            <div className="w-full bg-secondary/30 rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300" 
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </Card>

          <Card className="p-8">
            {/* Step 1: Parent Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-foreground mb-6">Parent/Guardian Information</h3>
                
                <div>
                  <Label htmlFor="parentName" className="text-base font-medium">Parent/Guardian Name *</Label>
                  <Input
                    id="parentName"
                    value={formData.parentName}
                    onChange={(e) => updateFormData('parentName', e.target.value)}
                    placeholder="Enter full name"
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="parentEmail" className="text-base font-medium">Email Address (Gmail only) *</Label>
                  <Input
                    id="parentEmail"
                    type="email"
                    value={formData.parentEmail}
                    onChange={(e) => updateFormData('parentEmail', e.target.value)}
                    placeholder="example@gmail.com"
                    className="mt-2"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Only Gmail addresses are accepted</p>
                </div>

                <div>
                  <Label htmlFor="parentPhone" className="text-base font-medium">Phone Number (10 digits) *</Label>
                  <Input
                    id="parentPhone"
                    type="tel"
                    value={formData.parentPhone}
                    onChange={(e) => updateFormData('parentPhone', e.target.value)}
                    placeholder="9876543210"
                    className="mt-2"
                    maxLength={10}
                  />
                  <p className="text-xs text-muted-foreground mt-1">Enter 10-digit mobile number without spaces or special characters</p>
                </div>
              </div>
            )}

            {/* Step 2: Child Information */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-foreground mb-6">Participant Information</h3>
                
                <div>
                  <Label htmlFor="childName" className="text-base font-medium">Participant Name *</Label>
                  <Input
                    id="childName"
                    value={formData.childName}
                    onChange={(e) => updateFormData('childName', e.target.value)}
                    placeholder="Enter participant's full name"
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="childAge" className="text-base font-medium">Age *</Label>
                  <Select onValueChange={(value) => updateFormData('childAge', value)}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select age" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 12 }, (_, i) => i + 6).map(age => (
                        <SelectItem key={age} value={age.toString()}>{age} years</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* Step 3: Theme Selection */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-foreground mb-6">Theme & Sloka</h3>
                
                <div>
                  <Label className="text-base font-medium">Select Theme *</Label>
                  <Select onValueChange={(value) => updateFormData('theme', value)}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder={formData.childAge ? "Select a theme" : "Please select age first"} />
                    </SelectTrigger>
                    <SelectContent>
                      {formData.childAge && getThemesByAge(formData.childAge).map(theme => (
                        <SelectItem key={theme} value={theme}>{theme}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="slokaRecited" className="text-base font-medium">Sloka to be Recited *</Label>
                  <Textarea
                    id="slokaRecited"
                    value={formData.slokaRecited}
                    onChange={(e) => updateFormData('slokaRecited', e.target.value)}
                    placeholder="e.g., Chapter 2, Verse 47 and Chapter 3, Verse 14"
                    className="mt-2 h-32"
                    required
                  />
                </div>
              </div>
            )}

            {/* Step 4: Video Submission */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-foreground mb-6">Video Submission</h3>
                
                <div>
                  <Label className="text-base font-medium">Upload Video *</Label>
                  <div className="mt-2">
                    <VideoUpload 
                      onFileSelect={handleVideoSelect}
                      selectedFile={selectedVideo}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Upload your MP4 video file directly. Maximum file size: 50MB.
                  </p>
                </div>

                <div className="bg-secondary/10 p-4 rounded-lg">
                  <h4 className="font-semibold text-foreground mb-2">Video Guidelines:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Maximum duration: 3 minutes</li>
                    <li>• Clear audio and video quality</li>
                    <li>• Include sloka recitation and explanation</li>
                    <li>• Ensure good lighting and minimal background noise</li>
                    <li>• MP4 format only, max 50MB file size</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center mt-8 pt-6 border-t border-border">
              <Button 
                variant="outline" 
                onClick={prevStep}
                disabled={currentStep === 1}
                className="flex items-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>

              {currentStep < totalSteps ? (
                <Button 
                  onClick={nextStep}
                  className="flex items-center gap-2"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              ) : (
                <LoadingButton 
                  onClick={handleSubmit}
                  isLoading={loading}
                  loadingText={`Submitting... ${progress}%`}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                  disabled={loading}
                >
                  <Check className="w-4 h-4" />
                  Submit Registration
                </LoadingButton>
              )}
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default RegistrationForm;