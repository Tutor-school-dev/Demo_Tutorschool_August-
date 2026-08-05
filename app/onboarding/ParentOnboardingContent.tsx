"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import Cookies from "js-cookie";
import axios from "axios";
import { getAppUrl, getApiUrl } from "@/lib/utils";
import DynamicMapComponent from "@/components/DynamicMapComponent";

export default function ParentOnboardingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const model = searchParams.get('model') || 'parent';
  
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    studentName: "",
    studentBoard: "",
    parentName: "",
    parentEmail: "",
    grade: "",
    subjects: [] as string[],
    budget: "1000",
    preferredMode: "",
    area: "",
    state: "",
    pincode: "",
    position: null as { lat: number; lng: number } | null,
  });

  const subjectOptions = ["Maths", "English", "History", "Science", "Physics", "Chemistry", "Biology"];

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubjectChange = (subject: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      subjects: checked 
        ? [...prev.subjects, subject]
        : prev.subjects.filter(s => s !== subject)
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
        router.push("/auth?model=parent");
        return;
      }

      // Validate required fields
      if (!formData.studentName || !formData.parentName || !formData.grade) {
        toast.error("Please fill in all required fields.");
        return;
      }

      // Validate location fields if location access was denied
      const hasLocationAccess = formData.position && 
        (formData.position.lat !== 20.5937 || Math.abs(formData.position.lat - 20.5937) > 5);
      
      if (!hasLocationAccess && (!formData.area || !formData.state || !formData.pincode)) {
        toast.error("Please fill in your address details (Area, State, and Pincode).");
        setCurrentStep(4); // Go to location step
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

      // 1. Create parent account (matching React repo)
      const response = await axios.post(`${apiUrl}/auth/parent/createAcc`, {
        access_hash: accessHash,
        data: formData
      });

      // Store JWT token
      const jwtToken = response.data.jwt_token;
      Cookies.set("jwt_Token", jwtToken, { expires: 7 });
      
      // Store user data in localStorage (matching React repo)
      if (typeof window !== 'undefined') {
        localStorage.setItem("model", "Parent");
        localStorage.setItem("name", formData.parentName);
        if (formData.parentEmail) {
          localStorage.setItem("email", formData.parentEmail);
        }
      }
      
      // 2. Upload location data (matching React repo)
      try {
        await axios.post(`${apiUrl}/onboarding/PARENT/location`, {
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

      // 3. Create job listing (matching React repo)
      try {
        const goApiUrl = getApiUrl();
        await axios.post(`${goApiUrl}/admin/pub/jobs`, {
          j_title: `Class ${formData.grade}, ${formData.studentBoard} board`,
          j_desc: `Need Tutor for Class ${formData.grade}`,
          j_preview: `Class ${formData.grade}, ${formData.studentBoard} board`,
          j_posted_by: formData.studentName,
          j_posted_by_number: phoneNumber,
          j_location: `${formData.state}, ${formData.area}, ${formData.pincode}`,
          j_active: true
        });
      } catch (jobError) {
        console.warn("Job creation failed:", jobError);
        // Continue even if job creation fails
      }
      
      toast.success("Parent onboarded successfully!");
      router.push("/dashboard/parent");
      
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
            <h3 className="text-xl font-semibold">Student Information</h3>
            <div className="space-y-3">
              <div>
                <Label htmlFor="studentName">Student Name</Label>
                <Input
                  id="studentName"
                  value={formData.studentName}
                  onChange={(e) => handleInputChange("studentName", e.target.value)}
                  placeholder="Enter student's name"
                />
              </div>
              <div>
                <Label htmlFor="grade">Grade/Class</Label>
                <Input
                  id="grade"
                  value={formData.grade}
                  onChange={(e) => handleInputChange("grade", e.target.value)}
                  placeholder="e.g., 10th, 12th"
                />
              </div>
              <div>
                <Label htmlFor="studentBoard">Board</Label>
                <Input
                  id="studentBoard"
                  value={formData.studentBoard}
                  onChange={(e) => handleInputChange("studentBoard", e.target.value)}
                  placeholder="e.g., CBSE, ICSE, State Board"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Parent Information</h3>
            <div className="space-y-3">
              <div>
                <Label htmlFor="parentName">Parent Name</Label>
                <Input
                  id="parentName"
                  value={formData.parentName}
                  onChange={(e) => handleInputChange("parentName", e.target.value)}
                  placeholder="Enter parent's name"
                />
              </div>
              <div>
                <Label htmlFor="parentEmail">Parent Email</Label>
                <Input
                  id="parentEmail"
                  type="email"
                  value={formData.parentEmail}
                  onChange={(e) => handleInputChange("parentEmail", e.target.value)}
                  placeholder="Enter email address"
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Subject Preferences</h3>
            <div className="space-y-3">
              <div>
                <Label>Subjects needed</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {subjectOptions.map((subject) => (
                    <div key={subject} className="flex items-center space-x-2">
                      <Checkbox
                        id={subject}
                        checked={formData.subjects.includes(subject)}
                        onCheckedChange={(checked) => 
                          handleSubjectChange(subject, checked as boolean)
                        }
                      />
                      <Label htmlFor={subject}>{subject}</Label>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <Label>Budget (₹ per month)</Label>
                <Slider
                  value={[parseInt(formData.budget)]}
                  onValueChange={(value) => handleInputChange("budget", value[0].toString())}
                  max={5000}
                  min={500}
                  step={100}
                  className="mt-2"
                />
                <div className="text-center mt-1">₹{formData.budget}/month</div>
              </div>
              <div>
                <Label htmlFor="preferredMode">Preferred Mode</Label>
                <select
                  id="preferredMode"
                  value={formData.preferredMode}
                  onChange={(e) => handleInputChange("preferredMode", e.target.value)}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">Select mode</option>
                  <option value="Online">Online</option>
                  <option value="Offline">Offline</option>
                  <option value="Both">Both</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Location Information</h3>
            <DynamicMapComponent formData={formData} setFormData={setFormData} />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className={`w-full ${currentStep === 4 ? 'max-w-4xl' : 'max-w-md'}`}>
        <CardHeader>
          <CardTitle>Parent Onboarding</CardTitle>
          <CardDescription>
            Step {currentStep} of {totalSteps}
          </CardDescription>
          <Progress value={(currentStep / totalSteps) * 100} className="mt-2" />
        </CardHeader>
        <CardContent className="space-y-6">
          {renderStep()}
          
          <div className="flex justify-between">
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
  );
}