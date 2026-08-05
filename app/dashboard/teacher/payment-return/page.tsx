import { Suspense } from "react";
import { redirect } from "next/navigation";

interface PaymentReturnPageProps {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

export default async function PaymentReturnPage({ searchParams }: PaymentReturnPageProps) {
  const params = await searchParams;
  
  // Check if this is a payment return with order ID
  const orderId = params.orderId || params.order_id;
  
  if (orderId) {
    // Store the order ID and redirect to payment status page
    // Note: We can't directly set localStorage in a server component,
    // so we'll pass it as a query parameter
    redirect(`/dashboard/teacher/payment-status?orderId=${orderId}`);
  }
  
  // If no order ID, redirect to subscription page
  redirect('/dashboard/teacher/subscription');
}