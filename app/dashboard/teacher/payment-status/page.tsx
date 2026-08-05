import { Suspense } from "react";
import PaymentStatusContent from "./PaymentStatusContent";

export default function PaymentStatusPage() {
  return (
    <Suspense fallback={<div>Checking payment status...</div>}>
      <PaymentStatusContent />
    </Suspense>
  );
}