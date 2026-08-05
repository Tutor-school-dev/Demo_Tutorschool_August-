"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle, XCircle, RefreshCw, ArrowRight } from "lucide-react";
import { Button } from "../../../../src/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../src/components/ui/card";
import { usePaymentStatus } from "../../../../src/hooks/usePaymentStatus";
import TeacherNavbar from "../../../../src/components/TeacherNavbar";

export default function PaymentStatusContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { checkPaymentStatus, paymentStatus, orderId, amount, clearPolling } = usePaymentStatus();

  useEffect(() => {
    // Check if order ID is in URL parameters
    const orderIdFromUrl = searchParams?.get('orderId');
    
    let orderIdFromStorage = typeof window !== 'undefined' 
      ? localStorage.getItem('order_id') 
      : null;
    
    // If order ID is in URL but not in storage, store it
    if (orderIdFromUrl && !orderIdFromStorage && typeof window !== 'undefined') {
      localStorage.setItem('order_id', orderIdFromUrl);
      orderIdFromStorage = orderIdFromUrl;
    }
    
    if (!orderIdFromStorage) {
      // No order ID found, redirect to dashboard
      router.push('/dashboard/teacher');
      return;
    }

    const controller = new AbortController();
    const signal = controller.signal;

    const startPolling = async () => {
      try {
        await checkPaymentStatus(signal);
      } catch (error: any) {
        if (error.name === "AbortError") {
          console.log("Payment status request aborted");
        } else {
          console.error("Error in payment status check:", error);
        }
      }
    };

    startPolling();

    return () => {
      controller.abort();
      clearPolling();
    };
  }, []);

  const handleGoToDashboard = () => {
    clearPolling();
    router.push('/dashboard/teacher');
  };

  const handleRetry = () => {
    router.push('/dashboard/teacher/subscription');
  };

  const renderStatusContent = () => {
    switch (paymentStatus) {
      case 'LOADING':
        return (
          <Card className="w-full max-w-md mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center space-x-2">
                <RefreshCw className="w-6 h-6 animate-spin text-blue-500" />
                <span>Processing Payment</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 mb-4">
                Please wait while we verify your payment...
              </p>
              <div className="animate-pulse text-sm text-gray-500">
                This may take a few moments
              </div>
            </CardContent>
          </Card>
        );

      case 'SUCCESS':
        return (
          <Card className="w-full max-w-md mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center space-x-2 text-green-600">
                <CheckCircle className="w-6 h-6" />
                <span>Payment Successful!</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-gray-600">
                Your subscription has been activated successfully.
              </p>
              {amount && (
                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="text-sm font-medium">Amount Paid: ₹{amount}</p>
                  {orderId && (
                    <p className="text-xs text-gray-500 mt-1">Order ID: {orderId}</p>
                  )}
                </div>
              )}
              <Button 
                onClick={handleGoToDashboard}
                className="w-full bg-green-500 hover:bg-green-600"
              >
                Go to Dashboard <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        );

      case 'FAILED':
        return (
          <Card className="w-full max-w-md mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center space-x-2 text-red-600">
                <XCircle className="w-6 h-6" />
                <span>Payment Failed</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-gray-600">
                We couldn't process your payment. Please try again.
              </p>
              <div className="space-y-2">
                <Button 
                  onClick={handleRetry}
                  className="w-full bg-blue-500 hover:bg-blue-600"
                >
                  Try Again
                </Button>
                <Button 
                  onClick={handleGoToDashboard}
                  variant="outline"
                  className="w-full"
                >
                  Back to Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      case 'WAITING':
        return (
          <Card className="w-full max-w-md mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center space-x-2 text-yellow-600">
                <RefreshCw className="w-6 h-6" />
                <span>Payment Pending</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-gray-600">
                Your payment is still being processed. Please check back later.
              </p>
              <div className="space-y-2">
                <Button 
                  onClick={() => window.location.reload()}
                  className="w-full bg-yellow-500 hover:bg-yellow-600"
                >
                  Check Again
                </Button>
                <Button 
                  onClick={handleGoToDashboard}
                  variant="outline"
                  className="w-full"
                >
                  Back to Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      default:
        return (
          <Card className="w-full max-w-md mx-auto">
            <CardContent className="text-center py-8">
              <p className="text-gray-600">Checking payment status...</p>
            </CardContent>
          </Card>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <TeacherNavbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[60vh]">
          {renderStatusContent()}
        </div>
      </div>
    </div>
  );
}