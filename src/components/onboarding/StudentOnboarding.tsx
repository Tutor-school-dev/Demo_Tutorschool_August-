"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { LoadingButton } from "@/components/ui/LoadingButton";
import { Checkbox } from "@/components/ui/checkbox";

interface OnboardingData {
  studentName: string;
  educationLevel: string;
  board: string;
  parentName: string;
  parentEmail: string;
  subjects: string[];
  preferredMode: string;
  state: string;
  city: string;
  area: string;
  pincode: string;
}

const SUBJECTS = [
  "Mathematics",
  "Science",
  "English",
  "Hindi",
  "Social Studies",
  "Computer Science",
  "Sanskrit",
  "EVS",
];

const EDUCATION_LEVELS = ["Grade 4-5", "Grade 6-8", "Grade 9-10"];
const BOARDS = ["CBSE", "ICSE", "State Board", "Other"];
const MODES = ["Online", "Offline", "Both"];

const STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi", "Other",
];

export default function StudentOnboarding() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<OnboardingData>({
    studentName: "",
    educationLevel: "Grade 4-5",
    board: "CBSE",
    parentName: "",
    parentEmail: "",
    subjects: [],
    preferredMode: "Online",
    state: "",
    city: "",
    area: "",
    pincode: "",
  });


  const updateField = <K extends keyof OnboardingData>(key: K, value: OnboardingData[K]) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const toggleSubject = (subject: string) => {
    setData((prev) => ({
      ...prev,
      subjects: prev.subjects.includes(subject)
        ? prev.subjects.filter((s) => s !== subject)
        : [...prev.subjects, subject],
    }));
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return data.studentName.trim().length > 0;
      case 2:
        return data.parentName.trim().length > 0;
      case 3:
        return data.subjects.length > 0;
      case 4:
        return data.state.length > 0 && data.city.trim().length > 0;
      default:
        return true;
    }
  };

  const handleComplete = async () => {
    setLoading(true);
    try {
      localStorage.setItem("onboarding_data", JSON.stringify(data));
      localStorage.setItem("student_grade", data.educationLevel);
      router.push("/dashboard/student/test/assessment");
    } catch {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
    else handleComplete();
  };

  const progressWidth = `${(step / 4) * 100}%`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-bold text-gray-800">Student Onboarding</h2>
            <span className="text-sm text-gray-500">Step {step} of 4</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-300"
              style={{ width: progressWidth }}
            />
          </div>
        </div>

        {step === 1 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700">Student Information</h3>
            <div>
              <label className="text-sm font-medium text-gray-600 mb-1 block">Student Name</label>
              <Input
                value={data.studentName}
                onChange={(e) => updateField("studentName", e.target.value)}
                placeholder="Enter student's full name"
                className="bg-green-50 border-2 border-gray-200 rounded-lg h-11"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600 mb-1 block">Education Level</label>
              <select
                value={data.educationLevel}
                onChange={(e) => updateField("educationLevel", e.target.value)}
                className="w-full h-11 px-3 bg-green-50 border-2 border-gray-200 rounded-lg text-sm"
              >
                {EDUCATION_LEVELS.map((level) => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600 mb-1 block">Board</label>
              <select
                value={data.board}
                onChange={(e) => updateField("board", e.target.value)}
                className="w-full h-11 px-3 bg-green-50 border-2 border-gray-200 rounded-lg text-sm"
              >
                {BOARDS.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700">Parent Information</h3>
            <div>
              <label className="text-sm font-medium text-gray-600 mb-1 block">Parent/Guardian Name</label>
              <Input
                value={data.parentName}
                onChange={(e) => updateField("parentName", e.target.value)}
                placeholder="Enter parent's name"
                className="bg-green-50 border-2 border-gray-200 rounded-lg h-11"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600 mb-1 block">Parent Email (optional)</label>
              <Input
                value={data.parentEmail}
                onChange={(e) => updateField("parentEmail", e.target.value)}
                type="email"
                placeholder="parent@email.com"
                className="bg-green-50 border-2 border-gray-200 rounded-lg h-11"
              />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700">Subject Preferences</h3>
            <p className="text-sm text-gray-500">Select subjects you need help with</p>
            <div className="grid grid-cols-2 gap-3">
              {SUBJECTS.map((subject) => (
                <label
                  key={subject}
                  className={`flex items-center gap-2 p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                    data.subjects.includes(subject)
                      ? "border-emerald-500 bg-emerald-50"
                      : "border-gray-200 hover:border-emerald-200"
                  }`}
                >
                  <Checkbox
                    checked={data.subjects.includes(subject)}
                    onCheckedChange={() => toggleSubject(subject)}
                  />
                  <span className="text-sm font-medium text-gray-700">{subject}</span>
                </label>
              ))}
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600 mb-1 block">Preferred Mode</label>
              <select
                value={data.preferredMode}
                onChange={(e) => updateField("preferredMode", e.target.value)}
                className="w-full h-11 px-3 bg-green-50 border-2 border-gray-200 rounded-lg text-sm"
              >
                {MODES.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700">Location</h3>
            <div>
              <label className="text-sm font-medium text-gray-600 mb-1 block">State</label>
              <select
                value={data.state}
                onChange={(e) => updateField("state", e.target.value)}
                className="w-full h-11 px-3 bg-green-50 border-2 border-gray-200 rounded-lg text-sm"
              >
                <option value="">Select State</option>
                {STATES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600 mb-1 block">City</label>
              <Input
                value={data.city}
                onChange={(e) => updateField("city", e.target.value)}
                placeholder="Enter city"
                className="bg-green-50 border-2 border-gray-200 rounded-lg h-11"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600 mb-1 block">Area/Locality</label>
              <Input
                value={data.area}
                onChange={(e) => updateField("area", e.target.value)}
                placeholder="Enter area or locality"
                className="bg-green-50 border-2 border-gray-200 rounded-lg h-11"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600 mb-1 block">Pincode</label>
              <Input
                value={data.pincode}
                onChange={(e) => updateField("pincode", e.target.value)}
                placeholder="6-digit pincode"
                maxLength={6}
                className="bg-green-50 border-2 border-gray-200 rounded-lg h-11"
              />
            </div>
          </div>
        )}

        <div className="flex gap-3 mt-8">
          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              className="px-6 py-2.5 border-2 border-gray-200 rounded-lg text-gray-600 font-medium hover:bg-gray-50 transition-colors"
            >
              Back
            </button>
          )}
          <LoadingButton
            isLoading={loading}
            onClick={handleNext}
            disabled={!canProceed()}
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 rounded-lg h-11 text-white font-medium transition-colors"
          >
            {step === 4 ? "Start Assessment" : "Continue"}
          </LoadingButton>
        </div>
      </div>
    </div>
  );
}
