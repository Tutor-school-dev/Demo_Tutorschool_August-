"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";

export default function SelectRolePage() {
  const router = useRouter();

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
            onClick={() => router.push("/dashboard/student/onboarding")}
            className="w-full p-5 rounded-xl border-2 border-gray-200 hover:border-emerald-500 hover:bg-emerald-50 transition-all group"
          >
            <div className="text-3xl mb-2">🎓</div>
            <div className="text-lg font-semibold text-gray-800 group-hover:text-emerald-700">Student</div>
            <p className="text-sm text-gray-500">Take the cognitive assessment</p>
          </button>

          <button
            onClick={() => router.push("/dashboard/teacher/test/assessment")}
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