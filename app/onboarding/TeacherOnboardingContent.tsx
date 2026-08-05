"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import Cookies from "js-cookie";
import axios from "axios";
import DynamicMapComponent from "@/components/DynamicMapComponent";
import { getAppUrl } from "@/lib/utils";

export default function TeacherOnboardingContent() {
  const router = useRouter();
  
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    teacherName: "",
    teacherEmail: "",
    teacherAge: "",
    teacherGender: "",
    teacherQualification: "",
    teachingExperience: "",
    subjects: [] as string[],
    grades: [] as string[],
    bio: "",
    area: "",
    state: "",
    pincode: "",
    position: null as { lat: number; lng: number } | null,
  });

  const subjectOptions = ["Maths", "English", "History", "Science", "Physics", "Chemistry", "Biology", "Geography", "Hindi", "Sanskrit"];
  const gradeOptions = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      
      const accessHash = Cookies.get("access_hash");
      if (!accessHash) {
        toast.error("Session expired. Please start again.");
        router.push("/auth?model=teacher");
        return;
      }

      // Validate required fields
      if (!formData.teacherName || !formData.teacherEmail || !formData.teacherAge) {
        toast.error("Please fill in all required fields.");
        return;
      }

      // Validate location fields if location access was denied
      const hasLocationAccess = formData.position && 
        (formData.position.lat !== 20.5937 || Math.abs(formData.position.lat - 20.5937) > 5);
      
      if (!hasLocationAccess && (!formData.area || !formData.state || !formData.pincode)) {
        toast.error("Please fill in your address details (Area, State, and Pincode).");
        setCurrentStep(5); // Go to location step
        return;
      }

      // Ensure position is set (either from geolocation or random fallback)
      if (!formData.position) {
        const randomLat = 20.5937 + (Math.random() - 0.5) * 10;
        const randomLng = 78.9629 + (Math.random() - 0.5) * 10;
        formData.position = { lat: randomLat, lng: randomLng };
      }

      const phoneNumber = localStorage.getItem("Phone");
      const apiUrl = getAppUrl();

      // 1. Create teacher account
      const response = await axios.post(`${apiUrl}/auth/teacher/createAcc`, {
        access_hash: accessHash,
        data: formData
      });

      // Store JWT token
      const jwtToken = response.data.jwt_token;
      Cookies.set("jwt_Token", jwtToken, { 
        expires: 7,
        path: '/',
        sameSite: 'lax'
      });
      
      // Store user data in localStorage (matching React repo)
      if (typeof window !== 'undefined') {
        localStorage.setItem("model", "Teacher");
        localStorage.setItem("name", formData.teacherName);
        if (formData.teacherEmail) {
          localStorage.setItem("email", formData.teacherEmail);
        }
      }
      
      // 2. Upload location data
      try {
        await axios.post(`${apiUrl}/onboarding/TEACHER/location`, {
          latitude: formData.position.lat,
          longitude: formData.position.lng,
          area: formData.area,
          state: formData.state,
          pincode: formData.pincode
        }, { 
          headers: { authorization: `bearer ${jwtToken}` } 
        });
      } catch (locationError) {
        console.warn("Location upload failed:", locationError);
        // Continue even if location upload fails
      }
      
      toast.success("Teacher onboarded successfully!");
      router.push("/dashboard/teacher");
      
    } catch (error: any) {
      console.error("Onboarding error:", error);
      toast.error(error.response?.data?.message || "Failed to complete onboarding");
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Personal Information</h3>
            <div className="space-y-3">
              <div>
                <Label htmlFor="teacherName">Full Name *</Label>
                <Input
                  id="teacherName"
                  value={formData.teacherName}
                  onChange={(e) => handleInputChange("teacherName", e.target.value)}
                  placeholder="Enter your full name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="teacherEmail">Email Address *</Label>
                <Input
                  id="teacherEmail"
                  type="email"
                  value={formData.teacherEmail}
                  onChange={(e) => handleInputChange("teacherEmail", e.target.value)}
                  placeholder="Enter your email address"
                  required
                />
              </div>
              <div>
                <Label htmlFor="teacherAge">Age *</Label>
                <Input
                  id="teacherAge"
                  type="number"
                  value={formData.teacherAge}
                  onChange={(e) => handleInputChange("teacherAge", e.target.value)}
                  placeholder="Enter your age"
                  min="18"
                  max="80"
                  required
                />
              </div>
              <div>
                <Label htmlFor="teacherGender">Gender</Label>
                <Select value={formData.teacherGender} onValueChange={(value) => handleInputChange("teacherGender", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Educational Background</h3>
            <div className="space-y-3">
              <div>
                <Label htmlFor="teacherQualification">Highest Qualification *</Label>
                <Input
                  id="teacherQualification"
                  value={formData.teacherQualification}
                  onChange={(e) => handleInputChange("teacherQualification", e.target.value)}
                  placeholder="e.g., B.Tech, M.Sc, B.Ed"
                  required
                />
              </div>
              <div>
                <Label htmlFor="teachingExperience">Teaching Experience (years)</Label>
                <Input
                  id="teachingExperience"
                  type="number"
                  value={formData.teachingExperience}
                  onChange={(e) => handleInputChange("teachingExperience", e.target.value)}
                  placeholder="Years of teaching experience"
                  min="0"
                  max="50"
                />
              </div>
              <div>
                <Label htmlFor="bio">About Yourself</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => handleInputChange("bio", e.target.value)}
                  placeholder="Tell us about your teaching style, interests, and what makes you a great tutor..."
                  rows={4}
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Subjects You Teach</h3>
            <p className="text-gray-600">Select all subjects you can teach:</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {subjectOptions.map((subject) => (
                <div key={subject} className="flex items-center space-x-2">
                  <Checkbox
                    id={subject}
                    checked={formData.subjects.includes(subject)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        handleInputChange("subjects", [...formData.subjects, subject]);
                      } else {
                        handleInputChange("subjects", formData.subjects.filter(s => s !== subject));
                      }
                    }}
                  />
                  <Label htmlFor={subject} className="text-sm font-normal">
                    {subject}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Grades You Teach</h3>
            <p className="text-gray-600">Select all grade levels you can teach:</p>
            <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
              {gradeOptions.map((grade) => (
                <div key={grade} className="flex items-center space-x-2">
                  <Checkbox
                    id={`grade-${grade}`}
                    checked={formData.grades.includes(grade)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        handleInputChange("grades", [...formData.grades, grade]);
                      } else {
                        handleInputChange("grades", formData.grades.filter(g => g !== grade));
                      }
                    }}
                  />
                  <Label htmlFor={`grade-${grade}`} className="text-sm font-normal">
                    Class {grade}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Your Location</h3>
            <DynamicMapComponent formData={formData} setFormData={setFormData} />
          </div>
        );

      default:
        return null;
    }
  };

  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-center">Teacher Onboarding</CardTitle>
            <CardDescription className="text-center">
              Step {currentStep} of {totalSteps}
            </CardDescription>
            <Progress value={progress} className="w-full" />
          </CardHeader>
          <CardContent>
            {renderStep()}

            <div className="flex justify-between mt-8">
              <Button
                onClick={prevStep}
                disabled={currentStep === 1}
                variant="outline"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
              {currentStep === totalSteps ? (
                <Button onClick={handleSubmit} disabled={loading}>
                  {loading ? "Submitting..." : "Complete Onboarding"}
                </Button>
              ) : (
                <Button onClick={nextStep}>
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}