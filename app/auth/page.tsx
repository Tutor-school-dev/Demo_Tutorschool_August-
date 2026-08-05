import { Suspense } from "react";
import AuthContent from "./AuthContent";
import AuthGuard from "@/components/AuthGuard";

export default function AuthPage() {
  return (
    <AuthGuard redirectAuthenticatedUsers={true}>
      <Suspense fallback={<div>Loading...</div>}>
        <AuthContent />
      </Suspense>
    </AuthGuard>
  );
}