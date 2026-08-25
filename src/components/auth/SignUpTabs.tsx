"use client";

import { useSearchParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TeacherLogin from "./TeacherLogin";
import TeacherSignup from "./TeacherSignup";
import ParentLogin from "./ParentLogin";
import ParentSignup from "./ParentSignup";
import StudentAuth from "./StudentAuth";
import TeacherAuth from "./TeacherAuth";

interface SignUpTabsProps {
  mode?: string;
}

export default function SignUpTabs({ mode }: SignUpTabsProps) {
  const searchParams = useSearchParams();
  const userType = searchParams.get('model') || searchParams.get('flag') || searchParams.get('type') || 'teacher';

  const isParent = userType.toLowerCase() === 'parent' || userType.toLowerCase() === 'learner';
  const isStudent = userType.toLowerCase() === 'student';
  const isTeacher = !isParent && !isStudent;

  if (isStudent) {
    return <StudentAuth />;
  }

  if (isTeacher) {
    return <TeacherAuth />;
  }

  return (
    <Tabs defaultValue={mode ? mode : "SIGNIN"} className="flex flex-col justify-between items-center mb-10 w-full">
      {/* Tabs Header */}
      <TabsList className="grid grid-cols-2 bg-white border-2 border-black rounded-full w-4/5 h-10">
        <TabsTrigger
          value="SIGNIN"
          className="flex-1 data-[state=active]:bg-blue-950 rounded-l-full h-7 data-[state=active]:text-white"
        >
          Sign In
        </TabsTrigger>
        <TabsTrigger
          value="SIGNUP"
          className="flex-1 data-[state=active]:bg-blue-950 rounded-r-full h-7 data-[state=active]:text-white"
        >
          Sign Up
        </TabsTrigger>
      </TabsList>

      {/* Sign In Content */}
      <TabsContent value="SIGNIN" className="w-full">
        {isParent ? <ParentLogin /> : <TeacherLogin />}
      </TabsContent>

      {/* Sign Up Content */}
      <TabsContent value="SIGNUP" className="w-full">
        {isParent ? <ParentSignup /> : <TeacherSignup />}
      </TabsContent>
    </Tabs>
  );
}
