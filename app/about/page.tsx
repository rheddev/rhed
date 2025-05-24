"use client";

import React from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar, SidebarTrigger } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function AboutPage() {
  const widgets = [
    { href: "/chat", name: "Chat" },
    { href: "/events", name: "Events (v2)" },
    { href: "/now-playing", name: "Now Playing" },
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
            <div className="red-glass p-6 sm:p-8 rounded-3xl border border-red-500/20 shadow-red">
              <h1 className="text-4xl font-bold text-white mb-8 flex items-center">
                About{" "}
                <span className="text-glow font-playwrite font-black ml-2 flex items-center">
                  <span className="text-white mr-1">{"<"}</span>
                  Rhed
                  <span className="text-white ml-1">{"/>"}</span>
                </span>
              </h1>

              {/* About Me with Personal Info Combined */}
              <section className="mb-12">
                <div className="bg-red-900/10 backdrop-blur-sm p-6 rounded-2xl border border-red-500/10 shadow-lg shadow-red-900/10 flex flex-col md:flex-row items-center gap-6 mb-6 transform transition-all hover:shadow-red-800/20 hover:border-red-500/20">
                  <div className="w-48 h-48 rounded-full overflow-hidden mb-4 md:mb-0 ring-4 ring-red-500/20 shadow-lg">
                    <img
                      src="/portrait.jpg"
                      alt="Rhamsez Thevenin"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold mb-2 text-white">
                      Rhamsez Thevenin
                    </h3>
                    <p className="text-lg mb-3 text-red-200">
                      Founder & Software Engineer
                    </p>
                    <a
                      href="https://linkedin.com/in/rhamzthev"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-all text-white hover:text-red-200"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                      </svg>
                      LinkedIn Profile
                    </a>
                  </div>
                </div>

                <p className="text-lg text-red-100 leading-relaxed">
                  Rhed is my content creation channel, focused on delivering
                  high-quality digital content and creative services to our
                  audience. Founded in December 2024, I&apos;ve amassed a small
                  following of curious programmers across the globe. Currently
                  streaming on Twitch, I create content for software engineers
                  and anyone looking to learn more about programming,
                  development, and all of that good stuff.
                </p>
              </section>

              {/* Monetization Section - specifically for Stripe */}
              <section className="mb-12">
                <div className="bg-red-500/20 backdrop-blur-sm p-6 rounded-2xl border border-red-500/30 shadow-lg">
                  <h2 className="text-3xl font-semibold mb-4 text-white flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8 mr-3 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    Monetized Services
                  </h2>

                  <div className="flex items-start">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 mr-3 text-red-200 flex-shrink-0 mt-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <p className="text-lg">
                      <span className="font-semibold">Direct Donations:</span>{" "}
                      Viewers can make one-time donations through this website
                      to support my content creation. These are voluntary
                      contributions with no obligation.
                    </p>
                  </div>

                  <div className="mt-6 space-y-4 text-white">
                    <div className="flex items-start">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 mr-3 text-red-200 flex-shrink-0 mt-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <p className="text-lg">
                        <span className="font-semibold">
                          Text-to-Speech Donations:
                        </span>{" "}
                        Viewers can pay a minimum of $1 to have their messages
                        read aloud on my live stream through a Text-to-Speech
                        system I&apos;ve developed.
                      </p>
                    </div>

                    <div className="flex items-start">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 mr-3 text-red-200 flex-shrink-0 mt-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <p className="text-lg">
                        <span className="font-semibold">
                          Stream Interaction Events:
                        </span>{" "}
                        (Future feature) Viewers will be able to pay to trigger
                        specific events during livestreams that can either help
                        or challenge me during programming.
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-red-900/30 rounded-xl">
                    <div className="flex items-start">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 mr-3 text-red-200 flex-shrink-0 mt-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <p className="text-lg">
                        All software, widgets, tutorials, and educational
                        content are completely{" "}
                        <span className="font-bold">free and open-source</span>{" "}
                        under MIT licensing. Monetization is strictly limited to
                        the interactive features and direct support options
                        listed above.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* My Services Section */}
              <section className="mb-12">
                <h2 className="text-3xl font-semibold mb-6 text-white inline-flex items-center">
                  <span className="w-2 h-8 bg-red-500 rounded-full mr-3"></span>
                  What I Offer
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-red-900/10 backdrop-blur-sm p-6 rounded-2xl border border-red-500/10 shadow-lg shadow-red-900/10 transform transition-all hover:shadow-red-800/20 hover:border-red-500/20">
                    <div className="flex items-center mb-4">
                      <div className="bg-red-500/20 p-3 rounded-lg mr-4">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 text-red-200"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                      </div>
                      <h3 className="text-xl font-medium text-white">
                        Content Creation
                      </h3>
                    </div>
                    <p className="text-red-100 mb-3">
                      I build software projects on stream, demonstrating
                      real-world software engineering practices that are
                      typically difficult to learn outside of professional
                      settings.
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-red-100 mb-3">
                      <li>
                        Show end-to-end project development from planning to
                        deployment
                      </li>
                      <li>
                        Demonstrate best practices in software architecture and
                        design
                      </li>
                      <li>
                        Provide practical examples of solving complex
                        engineering challenges
                      </li>
                    </ul>
                    <p className="text-red-100 border-t border-red-500/20 pt-3 text-sm">
                      All educational content is provided free of charge, with
                      core educational content remaining free and open source.
                    </p>
                  </div>

                  <div className="bg-red-900/10 backdrop-blur-sm p-6 rounded-2xl border border-red-500/10 shadow-lg shadow-red-900/10 transform transition-all hover:shadow-red-800/20 hover:border-red-500/20">
                    <div className="flex items-center mb-4">
                      <div className="bg-red-500/20 p-3 rounded-lg mr-4">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 text-red-200"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      <h3 className="text-xl font-medium text-white">
                        Live Streaming
                      </h3>
                    </div>
                    <p className="text-red-100 mb-3">
                      I stream software development and programming topics on
                      Twitch with a spontaneous schedule, aiming to broadcast
                      daily.
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-red-100 mb-3">
                      <li>
                        Live coding sessions with real-time problem solving
                      </li>
                      <li>Interactive Q&A and community discussions</li>
                      <li>
                        Text-to-Speech donations where viewers can have messages
                        read aloud
                      </li>
                      <li>
                        Interactive stream events through donations (future
                        feature)
                      </li>
                    </ul>
                    <p className="text-red-100 border-t border-red-500/20 pt-3 text-sm">
                      Monetization via Twitch subscriptions and direct
                      donations, with paid features including TTS message
                      reading.
                    </p>
                  </div>

                  <div className="bg-red-900/10 backdrop-blur-sm p-6 rounded-2xl border border-red-500/10 shadow-lg shadow-red-900/10 transform transition-all hover:shadow-red-800/20 hover:border-red-500/20">
                    <div className="flex items-center mb-4">
                      <div className="bg-red-500/20 p-3 rounded-lg mr-4">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 text-red-200"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                      </div>
                      <h3 className="text-xl font-medium text-white">
                        Digital Tools & Widgets
                      </h3>
                    </div>
                    <p className="text-red-100 mb-3">
                      I develop and maintain several open-source tools for
                      streamers and content creators:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-red-100 mb-3">
                      <li>
                        Twitch Chat Widget - Displays chat messages with badges
                        and emotes
                      </li>
                      <li>
                        Twitch Events Widget - Shows follows, subscriptions, and
                        gifted subs
                      </li>
                      <li>
                        Spotify Now-Playing Widget - Displays currently playing
                        music
                      </li>
                      <li>
                        Text-to-Speech System - Processes and reads aloud
                        donation messages
                      </li>
                    </ul>
                    <p className="text-red-100 border-t border-red-500/20 pt-3 text-sm">
                      All tools are free and open-source under MIT license with
                      support via GitHub or email.
                    </p>
                  </div>

                  <div className="bg-red-900/10 backdrop-blur-sm p-6 rounded-2xl border border-red-500/10 shadow-lg shadow-red-900/10 transform transition-all hover:shadow-red-800/20 hover:border-red-500/20">
                    <div className="flex items-center mb-4">
                      <div className="bg-red-500/20 p-3 rounded-lg mr-4">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 text-red-200"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                          />
                        </svg>
                      </div>
                      <h3 className="text-xl font-medium text-white">
                        Discussion & Exploration
                      </h3>
                    </div>
                    <p className="text-red-100 mb-3">
                      During streams, I facilitate open discussions on software
                      engineering and related topics:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-red-100 mb-3">
                      <li>
                        Impromptu discussions on software design philosophies
                        and approaches
                      </li>
                      <li>
                        Q&A sessions addressing viewer questions about
                        technology
                      </li>
                      <li>
                        Exploration of emerging technologies and industry trends
                      </li>
                    </ul>
                    <p className="text-red-100 border-t border-red-500/20 pt-3 text-sm">
                      These discussions are free and integrated into regular
                      streams as educational content.
                    </p>
                  </div>
                </div>
              </section>

              {/* My Story Section */}
              <section className="mb-12">
                <h2 className="text-3xl font-semibold mb-6 text-white inline-flex items-center">
                  <span className="w-2 h-8 bg-red-500 rounded-full mr-3"></span>
                  My Journey
                </h2>
                <div className="bg-red-900/10 backdrop-blur-sm p-6 rounded-2xl border border-red-500/10 shadow-lg shadow-red-900/10 transform transition-all hover:shadow-red-800/20 hover:border-red-500/20">
                  <div className="space-y-4">
                    <div className="flex">
                      <div className="flex-shrink-0 mt-1">
                        <div className="w-3 h-3 bg-red-500 rounded-full mr-4"></div>
                      </div>
                      <p className="text-red-100 flex-grow leading-relaxed">
                        What started with my Twitch Chat widget has evolved into
                        a comprehensive platform for digital innovation. This
                        first widget communicates with Twitch&apos;s Chat
                        Websocket and displays all the info regarding chat
                        messages, badges, Twitch emoticons, and more!
                      </p>
                    </div>

                    <div className="flex">
                      <div className="flex-shrink-0 mt-1">
                        <div className="w-3 h-3 bg-red-500 rounded-full mr-4"></div>
                      </div>
                      <p className="text-red-100 flex-grow leading-relaxed">
                        I was juggling school and the job search while streaming
                        consistently, before taking a break to focus on those
                        priorities. Now that I&apos;ve graduated, I&apos;m
                        putting more effort into this livestream.
                      </p>
                    </div>

                    <div className="flex">
                      <div className="flex-shrink-0 mt-1">
                        <div className="w-3 h-3 bg-red-500 rounded-full mr-4"></div>
                      </div>
                      <p className="text-red-100 flex-grow leading-relaxed">
                        One of my proudest moments was participating in a
                        hackathon where I recorded the ENTIRE process from start
                        to finish - my first ever 24-hour livestream!
                      </p>
                    </div>

                    <div className="flex">
                      <div className="flex-shrink-0 mt-1">
                        <div className="w-3 h-3 bg-red-500 rounded-full mr-4"></div>
                      </div>
                      <p className="text-red-100 flex-grow leading-relaxed">
                        I&apos;ve also been expanding my programming horizons,
                        exploring languages like Rust and Go, driven by both
                        personal interest and suggestions from my community.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* My Mission Section */}
              <section className="mb-12">
                <h2 className="text-3xl font-semibold mb-6 text-white inline-flex items-center">
                  <span className="w-2 h-8 bg-red-500 rounded-full mr-3"></span>
                  My Mission
                </h2>
                <div className="bg-red-900/10 backdrop-blur-sm p-6 rounded-2xl border border-red-500/10 shadow-lg shadow-red-900/10 transform transition-all hover:shadow-red-800/20 hover:border-red-500/20">
                  <div className="space-y-6">
                    <p className="text-red-100 leading-relaxed">
                      At Rhed, I&apos;m committed to exposing the entire journey
                      of creating software - from design to deployment. I
                      believe in not just showing the process, but giving people
                      opportunities to contribute and create something
                      themselves.
                    </p>
                    <p className="text-white text-lg font-medium px-4 py-3 bg-red-500/20 border border-red-500/30 rounded-lg">
                      Everything made within this stream is free and open
                      source, accessible to all.
                    </p>
                    <p className="text-red-100 leading-relaxed">
                      Beyond education, I aim to entertain through game
                      modifications, interactive games where my chat can
                      participate, and creating an engaging environment for both
                      experienced developers and those just starting their
                      programming journey. My goal is to build a supportive
                      community where learning and creating go hand in hand.
                    </p>
                  </div>
                </div>
              </section>

              {/* Connect and Get Started Combined */}
              <section className="mb-12">
                <h2 className="text-3xl font-semibold mb-6 text-white inline-flex items-center">
                  <span className="w-2 h-8 bg-red-500 rounded-full mr-3"></span>
                  Get Involved
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-red-900/10 backdrop-blur-sm p-6 rounded-2xl border border-red-500/10 shadow-lg shadow-red-900/10 transform transition-all hover:shadow-red-800/20 hover:border-red-500/20">
                    <h3 className="text-xl font-medium mb-4 text-white">
                      Connect With Me
                    </h3>
                    <p className="text-red-100 mb-5">
                      You can find me on these platforms:
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <a
                        href="https://twitch.tv/rhedthedev"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center px-4 py-2 bg-purple-700/30 hover:bg-purple-700/50 rounded-lg transition-all text-white"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-2"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M2.149 0l-1.612 4.119v16.836h5.731v3.045h3.224l3.045-3.045h4.657l6.269-6.269v-14.686h-21.314zm19.164 13.612l-3.582 3.582h-5.731l-3.045 3.045v-3.045h-4.836v-15.045h17.194v11.463zm-3.582-7.731v6.508h-2.239v-6.508h2.239zm-5.731 0v6.508h-2.239v-6.508h2.239z" />
                        </svg>
                        Twitch
                      </a>
                      <a
                        href="https://github.com/rhedthedev"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center px-4 py-2 bg-gray-700/30 hover:bg-gray-700/50 rounded-lg transition-all text-white"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-2"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                        </svg>
                        GitHub
                      </a>
                      <a
                        href="mailto:rheddev@gmail.com"
                        className="flex items-center px-4 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-all text-white"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                        Email
                      </a>
                    </div>
                  </div>

                  <div className="bg-red-900/10 backdrop-blur-sm p-6 rounded-2xl border border-red-500/10 shadow-lg shadow-red-900/10 transform transition-all hover:shadow-red-800/20 hover:border-red-500/20">
                    <h3 className="text-xl font-medium mb-4 text-white">
                      Try My Widgets
                    </h3>
                    <p className="text-red-100 mb-5">
                      Explore these interactive tools and features:
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      {widgets.map((widget) => (
                        <a
                          key={widget.href}
                          href={widget.href}
                          className="flex items-center justify-center px-4 py-3 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-all text-white hover:shadow-lg hover:shadow-red-900/20"
                        >
                          {widget.name}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              {/* Contact Section */}
              <section>
                <h2 className="text-3xl font-semibold mb-6 text-white inline-flex items-center">
                  <span className="w-2 h-8 bg-red-500 rounded-full mr-3"></span>
                  Contact
                </h2>
                <div className="bg-red-900/10 backdrop-blur-sm p-6 rounded-2xl border border-red-500/10 shadow-lg shadow-red-900/10 transform transition-all hover:shadow-red-800/20 hover:border-red-500/20">
                  <p className="text-red-100 mb-6 leading-relaxed">
                    Have questions or want to collaborate? I&apos;d love to hear
                    from you. You can reach me at{" "}
                    <a
                      href="mailto:rheddev@gmail.com"
                      className="text-red-400 hover:underline"
                    >
                      rheddev@gmail.com
                    </a>{" "}
                    or through any of my social platforms.
                  </p>
                  <a
                    href="/contact"
                    className="inline-flex items-center px-6 py-3 bg-red-500/30 hover:bg-red-500/40 rounded-lg transition-all text-white shadow-lg shadow-red-900/10 hover:shadow-red-900/20"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                    Get in Touch
                  </a>
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
