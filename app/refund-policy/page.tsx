"use client";

import React from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar, SidebarTrigger } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function RefundPolicyPage() {
  const widgets = [
    { href: "/v2/chat", name: "Chat (v2)" },
    { href: "/v2/events", name: "Events (REAL v2)" },
    { href: "/v2/now-playing", name: "Now Playing (v2)" },
    { href: "/outrun", name: "Outrun" },
    { href: "/pomodoro", name: "24/7 Pomodoro" },
    { href: "/tts", name: "Text to Speech" },
  ];

  return (
    <SidebarProvider>
      <div className="bg-wood min-h-screen w-screen overflow-x-hidden flex flex-col">
        <AppSidebar widgets={widgets} />

        <div className="relative z-10 flex flex-col min-h-screen w-full">
          <SidebarTrigger />
          <Header widgets={widgets} />

          <main className="px-5 sm:px-8 py-8 sm:py-10 flex-grow max-w-7xl mx-auto w-full">
            <div className="red-glass p-8 rounded-3xl border border-red-500/20 shadow-red">
              <h1 className="text-4xl sm:text-5xl font-bold mb-8 text-white flex items-center">
                Refund Policy
                <span className="ml-3 bg-red-500/30 text-base px-3 py-1 rounded-full">
                  Last updated: {new Date().toLocaleDateString()}
                </span>
              </h1>
              
              <section className="mb-10">
                <div className="bg-red-900/10 backdrop-blur-sm p-6 rounded-2xl border border-red-500/10 shadow-lg mb-8">
                  <h2 className="text-2xl font-semibold mb-4 text-white inline-flex items-center">
                    <span className="w-2 h-8 bg-red-500 rounded-full mr-3"></span>
                    Overview
                  </h2>
                  <p className="text-red-100 leading-relaxed">
                    At Rhed, I provide free, open-source software and content, with monetization limited to voluntary donations and interactive stream features. This Refund Policy outlines how refunds are handled for the paid aspects of my services.
                  </p>
                </div>

                <div className="bg-red-900/10 backdrop-blur-sm p-6 rounded-2xl border border-red-500/10 shadow-lg mb-8">
                  <h2 className="text-2xl font-semibold mb-4 text-white inline-flex items-center">
                    <span className="w-2 h-8 bg-red-500 rounded-full mr-3"></span>
                    Donation Policy
                  </h2>
                  <p className="text-red-100 leading-relaxed mb-4">
                    Direct donations made through this website are considered voluntary contributions to support my content creation efforts. As such:
                  </p>
                  <ul className="list-disc pl-8 mb-4 space-y-2 text-red-100">
                    <li>Donations are generally non-refundable</li>
                    <li>I appreciate your support, but do not offer goods or services in exchange for donations</li>
                    <li>Donations are strictly voluntary with no obligation or expectation</li>
                  </ul>
                  <p className="text-red-100 leading-relaxed">
                    In cases of demonstrable error (such as accidental donation amount or unauthorized transactions), I will consider refund requests on a case-by-case basis. Please contact me within 7 days of the donation.
                  </p>
                </div>

                <div className="bg-red-900/10 backdrop-blur-sm p-6 rounded-2xl border border-red-500/10 shadow-lg mb-8">
                  <h2 className="text-2xl font-semibold mb-4 text-white inline-flex items-center">
                    <span className="w-2 h-8 bg-red-500 rounded-full mr-3"></span>
                    Text-to-Speech (TTS) Donations
                  </h2>
                  <p className="text-red-100 leading-relaxed mb-4">
                    Text-to-Speech donations allow messages to be read aloud during my livestreams for a minimum of $1. Please note:
                  </p>
                  <ul className="list-disc pl-8 mb-4 space-y-2 text-red-100">
                    <li>TTS donations are generally non-refundable once the message has been processed and read on stream</li>
                    <li>If your message was not read due to technical issues on my end, you may request a refund</li>
                    <li>If your message contain inappropriate content or hate speech and is not read for that reason, no refund will be issued</li>
                    <li>Messages that do not appear due to stream delay or timing issues are not eligible for refunds</li>
                  </ul>
                  <p className="text-red-100 leading-relaxed">
                    I reserve the right to decline reading messages that contain inappropriate content or hate speech without providing a refund.
                  </p>
                </div>

                <div className="bg-red-900/10 backdrop-blur-sm p-6 rounded-2xl border border-red-500/10 shadow-lg mb-8">
                  <h2 className="text-2xl font-semibold mb-4 text-white inline-flex items-center">
                    <span className="w-2 h-8 bg-red-500 rounded-full mr-3"></span>
                    Stream Interaction Events
                  </h2>
                  <p className="text-red-100 leading-relaxed mb-4">
                    Future stream interaction events that can be triggered by payments will follow these refund guidelines:
                  </p>
                  <ul className="list-disc pl-8 mb-4 space-y-2 text-red-100">
                    <li>Once an interaction event has been triggered and executed on stream, no refund will be issued</li>
                    <li>If a paid interaction fails to trigger due to technical issues on my end, you may request a refund</li>
                    <li>Refund requests must be submitted within 24 hours of the failed interaction</li>
                  </ul>
                </div>

                <div className="bg-red-900/10 backdrop-blur-sm p-6 rounded-2xl border border-red-500/10 shadow-lg mb-8">
                  <h2 className="text-2xl font-semibold mb-4 text-white inline-flex items-center">
                    <span className="w-2 h-8 bg-red-500 rounded-full mr-3"></span>
                    Free Content & Open-Source Software
                  </h2>
                  <p className="text-red-100 leading-relaxed">
                    All educational content, tutorials, software, and widgets I create are provided free of charge under open-source MIT licensing. Since these items are free, no refund policy applies to them. Technical support is provided on a best-effort basis through GitHub issues or direct contact.
                  </p>
                </div>

                <div className="bg-red-900/10 backdrop-blur-sm p-6 rounded-2xl border border-red-500/10 shadow-lg">
                  <h2 className="text-2xl font-semibold mb-4 text-white inline-flex items-center">
                    <span className="w-2 h-8 bg-red-500 rounded-full mr-3"></span>
                    Requesting a Refund
                  </h2>
                  <p className="text-red-100 leading-relaxed mb-4">
                    To request a refund for eligible circumstances, please contact me with the following information:
                  </p>
                  <ul className="list-disc pl-8 mb-4 space-y-2 text-red-100">
                    <li>Date and time of the transaction</li>
                    <li>Amount paid</li>
                    <li>Type of donation (regular or TTS)</li>
                    <li>Your Twitch username</li>
                    <li>Reason for the refund request</li>
                    <li>Any relevant screenshots or documentation</li>
                  </ul>
                  <p className="text-red-100 leading-relaxed mb-4">
                    Please email refund requests to: <a href="mailto:rheddev@gmail.com" className="text-red-400 hover:underline">rheddev@gmail.com</a>
                  </p>
                  <p className="text-red-100 leading-relaxed">
                    Approved refunds will typically be processed within 5-7 business days, though the actual time for the funds to appear in your account may vary depending on your payment method and financial institution.
                  </p>
                </div>
              </section>
            </div>
          </main>

          <Footer widgets={widgets} />
        </div>
      </div>
    </SidebarProvider>
  );
} 