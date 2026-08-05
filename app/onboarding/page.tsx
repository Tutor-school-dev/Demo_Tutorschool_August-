import { Suspense } from "react";
import ParentOnboardingContent from "./ParentOnboardingContent";
import TeacherOnboardingContent from "./TeacherOnboardingContent";

interface OnboardingPageProps {
  searchParams: Promise<{ model?: string }>;
}

export default async function OnboardingPage({ searchParams }: OnboardingPageProps) {
  const params = await searchParams;
  const model = params.model || 'parent';
  
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Loading onboarding...</p>
        </div>
      </div>
    }>
      {model === 'teacher' ? <TeacherOnboardingContent /> : <ParentOnboardingContent />}
    </Suspense>
  );
}