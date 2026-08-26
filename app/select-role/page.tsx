"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import Cookies from "js-cookie";

export default function SelectRolePage() {
  const router = useRouter();

  const selectRole = (role: "Student" | "Teacher") => {
    Cookies.set("jwt_Token", "demo_token", { expires: 1 });
    localStorage.setItem("model", role);
    localStorage.setItem("demo_mode", "true");
    localStorage.setItem("name", role === "Student" ? "Demo Student" : "Demo Teacher");
    localStorage.setItem("email", role === "Student" ? "student@demo.tutorschool.in" : "teacher@demo.tutorschool.in");

    if (role === "Student") {
      router.push("/dashboard/student/onboarding");
    } else {
      router.push("/dashboard/teacher/test/assessment");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 text-center">
        <Image
          src="/logo.png"
          alt="TutorSchool"
          width={60}
          height={60}
          className="mx-auto mb-4"
        />
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Welcome to TutorSchool</h1>
        <p className="text-gray-500 mb-8">Select your role to continue</p>

        <div className="space-y-4">
          <button
            onClick={() => selectRole("Student")}
            className="w-full p-5 rounded-xl border-2 border-gray-200 hover:border-emerald-500 hover:bg-emerald-50 transition-all group"
          >
            <div className="text-3xl mb-2">🎓</div>
            <div className="text-lg font-semibold text-gray-800 group-hover:text-emerald-700">Student</div>
            <p className="text-sm text-gray-500">Take the cognitive assessment</p>
          </button>

          <button
            onClick={() => selectRole("Teacher")}
            className="w-full p-5 rounded-xl border-2 border-gray-200 hover:border-emerald-500 hover:bg-emerald-50 transition-all group"
          >
            <div className="text-3xl mb-2">👩‍🏫</div>
            <div className="text-lg font-semibold text-gray-800 group-hover:text-emerald-700">Teacher</div>
            <p className="text-sm text-gray-500">Complete your teaching profile</p>
          </button>
        </div>
      </div>
    </div>
  );
}