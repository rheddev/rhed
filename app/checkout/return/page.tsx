"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface Metadata {
  name: string;
  message: string;
}

export default function CheckoutReturnPage() {
  // get session id from search params
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const [sessionStatus, setSessionStatus] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [customerEmail, setCustomerEmail] = useState("");
  const [metadata, setMetadata] = useState<Metadata | null>(null);
  const [amount, setAmount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [ttsSent, setTtsSent] = useState(false);

  // get session status
  useEffect(() => {
    if (sessionId) {
      setIsLoading(true);
      fetch(`/api/session-status?session_id=${sessionId}`)
        .then((res) => {
          if (!res.ok) {
            throw new Error(`Error: ${res.status}`);
          }
          return res.json();
        })
        .then((data) => {
          setSessionStatus(data.status);
          setPaymentStatus(data.payment_status);
          if (data.customer_email) {
            setCustomerEmail(data.customer_email);
          }
          if (data.metadata) {
            setMetadata(data.metadata);
          }
          if (data.amount) {
            setAmount(data.amount);
          }
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching session status:", error);
          setError("Unable to retrieve payment information. Please contact support.");
          setIsLoading(false);
        });
    }
  }, [sessionId]);

  // Handle TTS update when payment status is paid
  useEffect(() => {
    const handlePaidStatus = async () => {
      if (paymentStatus === "paid" && !ttsSent) {
        try {
          await updateTTS();
          setTtsSent(true);
        } catch (error) {
          console.error("Failed to update TTS:", error);
          // Continue with payment success flow even if TTS update fails
        }
      }
    };

    handlePaidStatus();
  }, [paymentStatus, ttsSent]);

  const updateTTS = async () => {
    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          session_id: sessionId,
          name: metadata?.name,
          amount: amount / 100,
          message: metadata?.message
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('TTS update failed:', errorData.error);
        // We don't need to show this error to the user as it's a background process
      }

      const data = await response.json();
      console.log("TTS update successful:", data);
    } catch (error) {
      console.error("Error updating TTS:", error);
      // Continue with the payment success flow even if TTS fails
    }
  }

  /**
   * complete: The checkout session is complete. Payment processing may still be in progress
   * expired: The checkout session has expired. No further processing will occur
   * open: The checkout session is still in progress. Payment processing has not started
   */

  /**
   * no_payment_required: The payment is delayed to a future date, or the Checkout Session is in setup mode and doesn't require a payment at this time.
   * paid: The payment funds are available in your account.
   * unpaid: The payment funds are not yet available in your account.
   */

  if (isLoading) {
    return (
      <div className="bg-wood flex min-h-screen flex-col items-center justify-center p-4">
        <div className="w-full max-w-md rounded-lg red-glass p-8 shadow-red">
          <h2 className="mb-4 text-center text-xl font-semibold text-glow">Processing your payment...</h2>
          <div className="flex justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-red-300 border-t-red-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-wood flex min-h-screen flex-col items-center justify-center p-4">
        <div className="w-full max-w-md rounded-lg red-glass p-8 shadow-red">
          <div className="mb-6 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
              <svg
                className="h-8 w-8 text-red-600 dark:text-red-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </div>
          </div>
          <h2 className="mb-2 text-center text-2xl font-bold text-glow">
            Something went wrong
          </h2>
          <p className="mb-6 text-center text-gray-600 dark:text-gray-300">
            {error}
          </p>
          <div className="flex justify-center">
            <Button asChild className="rhed-button">
              <Link href="/">Return to Home</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (sessionStatus === "open") {
    
    const href = `/checkout?session_id=${sessionId}`;

    return (
      <div className="bg-wood flex min-h-screen flex-col items-center justify-center p-4">
        <div className="w-full max-w-md rounded-lg red-glass p-8 shadow-red">
          <h2 className="mb-4 text-center text-xl font-semibold text-glow">Your checkout session is still open</h2>
          <p className="mb-6 text-center text-gray-600 dark:text-gray-300">
            Please complete your payment to continue.
          </p>
          <div className="flex justify-center">
            <Button asChild className="rhed-button">
              <Link href={href}>Return to Checkout</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  } else if (sessionStatus === "complete") {
    if (paymentStatus === "unpaid") {
      return (
        <div className="bg-wood flex min-h-screen flex-col items-center justify-center p-4">
          <div className="w-full max-w-md rounded-lg red-glass p-8 shadow-red">
            <div className="mb-6 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100/50 dark:bg-blue-900/30">
                <svg
                  className="h-8 w-8 text-blue-600 dark:text-blue-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
              </div>
            </div>
            <h2 className="mb-2 text-center text-2xl font-bold text-glow">
              Payment Processing
            </h2>
            <p className="mb-6 text-center text-gray-600 dark:text-gray-300">
              Your payment is being processed. We&apos;ll send you a confirmation email once completed.
              {customerEmail && ` A notification has been sent to ${customerEmail}.`}
            </p>
            <div className="flex justify-center">
              <Button asChild className="rhed-button">
                <Link href="/">Return to Home</Link>
              </Button>
            </div>
          </div>
        </div>
      );
    } else if (paymentStatus === "no_payment_required") {
      return (
        <div className="bg-wood flex min-h-screen flex-col items-center justify-center p-4">
          <div className="w-full max-w-md rounded-lg red-glass p-8 shadow-red">
            <div className="mb-6 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100/50 dark:bg-green-900/30">
                <svg
                  className="h-8 w-8 text-green-600 dark:text-green-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
              </div>
            </div>
            <h2 className="mb-2 text-center text-2xl font-bold text-glow">
              Setup Complete!
            </h2>
            <p className="mb-6 text-center text-gray-600 dark:text-gray-300">
              Your setup has been completed successfully. No payment was required at this time.
              {customerEmail && ` A confirmation email has been sent to ${customerEmail}.`}
            </p>
            <div className="flex justify-center">
              <Button asChild className="rhed-button">
                <Link href="/">Return to Home</Link>
              </Button>
            </div>
          </div>
        </div>
      );
    } else if (paymentStatus === "paid") {
      return (
        <div className="bg-wood flex min-h-screen flex-col items-center justify-center p-4">
          <div className="w-full max-w-md rounded-lg red-glass p-8 shadow-red">
            <div className="mb-6 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100/50 dark:bg-green-900/30">
                <svg
                  className="h-8 w-8 text-green-600 dark:text-green-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
              </div>
            </div>
            <h2 className="mb-2 text-center text-2xl font-bold text-glow">
              Payment Successful!
            </h2>
            <p className="mb-6 text-center text-gray-600 dark:text-gray-300">
              Thank you for your support. {customerEmail && `A confirmation email has been sent to ${customerEmail}.`}
            </p>
            <div className="flex flex-col gap-3">
              <Button asChild className="rhed-button">
                <Link href="/">Return to Home</Link>
              </Button>
            </div>
          </div>
        </div>
      );
    }
  } else if (sessionStatus === "expired") {
    return (
      <div className="bg-wood flex min-h-screen flex-col items-center justify-center p-4">
        <div className="w-full max-w-md rounded-lg red-glass p-8 shadow-red">
          <div className="mb-6 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100/50 dark:bg-yellow-900/30">
              <svg
                className="h-8 w-8 text-yellow-600 dark:text-yellow-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                ></path>
              </svg>
            </div>
          </div>
          <h2 className="mb-2 text-center text-2xl font-bold text-glow">
            Session Expired
          </h2>
          <p className="mb-6 text-center text-gray-600 dark:text-gray-300">
            Your checkout session has expired. Please try again.
          </p>
          <div className="flex justify-center">
            <Button asChild className="rhed-button">
              <Link href="/donate">Try Again</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Default state if none of the conditions match
  return (
    <div className="bg-wood flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md rounded-lg red-glass p-8 shadow-red">
        <h2 className="mb-4 text-center text-xl font-semibold text-glow">Checkout Status</h2>
        <p className="mb-6 text-center text-gray-600 dark:text-gray-300">
          We couldn&apos;t determine the status of your checkout session. Please contact support if you need assistance.
        </p>
        <div className="flex justify-center">
          <Button asChild className="rhed-button">
            <Link href="/">Return to Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
