"use client";

import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";
import React, { Suspense, useCallback } from "react";
import { useSearchParams } from "next/navigation";
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

function CheckoutContent() {
  const params = useSearchParams();
  const sessionId = params.get("session_id");
  
  const name = localStorage.getItem("name");
  const message = localStorage.getItem("message");

  const description = "Seductive, sensual, and erotic lady";

  let fetchClientSecret = null;

  if (sessionId) {
    fetchClientSecret = useCallback(() => {
      // Retrieve a Checkout Session
      return fetch(`/api/checkout-session?session_id=${sessionId}`)
        .then((res) => res.json())
        .then((data) => data.clientSecret);
    }, []);
  } else if (name && message && description) {
    fetchClientSecret = useCallback(() => {
      // Create a Checkout Session
      return fetch("/api/checkout-session", {
        method: "POST",
        body: JSON.stringify({ name, message, description }),
      })
        .then((res) => res.json())
        .then((data) => data.clientSecret)
        .finally(() => {
          // clear local storage
          localStorage.removeItem("name");
          localStorage.removeItem("message");
        });
    }, []);
  } else {
    return (
      <div className="bg-wood flex min-h-screen flex-col items-center justify-center p-4">
        <div className="w-full max-w-md rounded-lg red-glass p-8 shadow-red">
          <h2 className="mb-4 text-center text-xl font-semibold text-glow">
            Missing Information
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-300">
            Please provide either a session ID or name, message, and description
            to proceed with checkout.
          </p>
        </div>
      </div>
    );
  }

  const options = { fetchClientSecret };

  return (
    <div className="bg-wood flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-7xl bg-[#1f0000] rounded-lg p-6 shadow-red">
        <div id="checkout" className="">
          <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
            <EmbeddedCheckout />
          </EmbeddedCheckoutProvider>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
