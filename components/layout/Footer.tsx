"use client";

import React from "react";
import Link from "next/link";

interface FooterProps {
  widgets: { href: string; name: string }[];
}

export function Footer({ widgets }: FooterProps) {
  return (
    <footer className="red-glass border-t border-red-500/20 px-5 sm:px-8 py-8 sm:py-10 relative z-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 sm:gap-10">
        <div>
          <h3 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">
            &lt;
            <span className="font-black font-playwrite text-primary-800 text-glow">
              Rhed
            </span>{" "}
            /&gt;
          </h3>
          <p className="text-base sm:text-lg">#WAGMI</p>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-3 sm:mb-4">Quick Links</h3>
          <ul className="grid grid-cols-2 gap-3 sm:gap-4">
            {widgets.map((widget) => (
              <li key={widget.href}>
                <Link
                  href={widget.href}
                  className="text-base hover:text-red-300 transition-colors hover:underline"
                >
                  {widget.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="sm:col-span-2 md:col-span-1 mt-6 sm:mt-0">
          <h3 className="text-xl font-semibold mb-3 sm:mb-4">Connect</h3>
          <div className="flex space-x-5">
            <Link
              href="https://github.com/rhamzthev/rhed"
              target="_blank"
              rel="noopener noreferrer"
              className="rhed-button p-3 rounded-full h-12 w-12 flex items-center justify-center shadow-red"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                <path d="M9 18c-4.51 2-5-2-7-2" />
              </svg>
            </Link>
            <Link
              href="https://twitch.tv/RhedDev"
              target="_blank"
              rel="noopener noreferrer"
              className="rhed-button p-3 rounded-full h-12 w-12 flex items-center justify-center shadow-red"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 2H3v16h5v4l4-4h5l4-4V2zM11 11V7M16 11V7" />
              </svg>
            </Link>
          </div>
        </div>
        
        {/* Legal/Stripe Compliance Links */}
        <div className="col-span-1 sm:col-span-3 mt-6 border-t border-red-500/10 pt-6">
          <h3 className="text-xl font-semibold mb-3 sm:mb-4">Legal</h3>
          <ul className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <li>
              <Link
                href="/about"
                className="text-base hover:text-red-300 transition-colors hover:underline"
              >
                About
              </Link>
            </li>
            <li>
              <Link
                href="/refund-policy"
                className="text-base hover:text-red-300 transition-colors hover:underline"
              >
                Refund Policy
              </Link>
            </li>
            <li>
              <Link
                href="/terms-of-service"
                className="text-base hover:text-red-300 transition-colors hover:underline"
              >
                Terms of Service
              </Link>
            </li>                  
            <li>
              <Link
                href="/privacy-policy"
                className="text-base hover:text-red-300 transition-colors hover:underline"
              >
                Privacy Policy
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="text-center mt-6 pt-4 sm:mt-8 sm:pt-6 border-t border-red-500/10">
        <p className="text-base sm:text-lg">
          &copy; 2025 Rhamsez Thevenin
        </p>
      </div>
    </footer>
  );
} 