import { Suspense } from "react";
import TeacherSubscriptionContent from "./TeacherSubscriptionContent";

export default function TeacherSubscriptionPage() {
  return (
    <Suspense fallback={<div>Loading subscription plans...</div>}>
      <TeacherSubscriptionContent />
    </Suspense>
  );
}