import { Suspense } from "react";
import RoleSelectionContent from "./RoleSelectionContent";
import AuthGuard from "@/components/AuthGuard";

export default function SelectRolePage() {
  return (
    <AuthGuard redirectAuthenticatedUsers={true}>
      <Suspense fallback={<div>Loading...</div>}>
        <RoleSelectionContent />
      </Suspense>
    </AuthGuard>
  );
}