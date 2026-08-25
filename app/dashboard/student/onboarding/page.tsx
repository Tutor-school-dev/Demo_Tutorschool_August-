import { Suspense } from "react";
import StudentOnboarding from "@/components/onboarding/StudentOnboarding";

export default function StudentOnboardingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><p>Loading...</p></div>}>
      <StudentOnboarding />
    </Suspense>
  );
}
