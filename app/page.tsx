"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar, SidebarTrigger } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useTwitch } from "@/hooks/use-twitch";

export default function Home() {
  const { videos, fetchVideos } = useTwitch();
  const [, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    fetchVideos();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [fetchVideos]);

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
      {/* Main container - takes at least full viewport height */}
      <div className="bg-wood min-h-screen w-screen overflow-x-hidden flex flex-col">
        <AppSidebar widgets={widgets} />

        {/* Content wrapper - takes remaining height as a flex column */}
        <div className="relative z-10 flex flex-col min-h-screen w-full">
          <SidebarTrigger />
          <Header widgets={widgets} />

          {/* Main content - with better mobile padding */}
          <main className="px-5 sm:px-8 py-8 sm:py-10 flex-grow max-w-7xl mx-auto w-full">
            {/* Hero Section */}
            <section className="py-8 md:py-16 md:flex md:items-center md:justify-between gap-10 flex-grow">
              <div className="md:w-1/2 pb-8 md:pb-0">
                <h1 className="text-5xl sm:text-6xl md:text-7xl mb-5">
                  &lt;
                  <span className="font-black font-playwrite text-primary-800 text-glow">
                    Rhed
                  </span>{" "}
                  /&gt;
                </h1>
                <p className="text-xl sm:text-2xl md:text-3xl font-medium text-glow">
                  Rhamsez Thevenin&apos;s Content Creator Arc
                </p>
                <div className="mt-8 flex flex-wrap gap-4">
                  <Link href="/donate">
                    <Button
                      className="rhed-button h-11 px-5 py-2.5 text-base sm:text-lg bg-red-600/40 hover:bg-red-600/50 border border-red-400/50 shadow-[0_0_15px_rgba(239,68,68,0.5)] hover:shadow-[0_0_20px_rgba(239,68,68,0.7)] transition-all duration-300 relative animate-pulse-subtle"
                      size="lg"
                    >
                      Donate
                    </Button>
                  </Link>
                  {widgets.slice(0, 3).map((widget) => (
                    <Link key={widget.href} href={widget.href}>
                      <Button
                        className="rhed-button h-11 px-5 py-2.5 text-base sm:text-lg shadow-red"
                        size="lg"
                      >
                        {widget.name}
                      </Button>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Video section with better mobile spacing */}
              <div className="md:w-1/2 mt-8 md:mt-0">
                <div className="red-glass rounded-2xl overflow-hidden video-glow">
                  <div
                    className="relative w-full"
                    style={{ paddingBottom: "56.25%" }}
                  >
                    <iframe
                      src="https://player.twitch.tv/?channel=RhedDev&parent=rhed.rhamzthev.com&parent=localhost"
                      className="absolute top-0 left-0 w-full h-full"
                      allowFullScreen
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Recent Streams Section */}
            <section className="pt-10 sm:pt-16 relative z-20">
              <h2 className="text-3xl sm:text-4xl font-bold text-center mb-8 sm:mb-10">
                <span className="text-gradient-primary text-glow">
                  Recent Streams
                </span>
              </h2>

              <div
                className="grid grid-cols-1 gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3"
                style={{ minHeight: videos.length ? "auto" : "300px" }}
              >
                {videos.length ? (
                  videos.map((video: TwitchVideo) => (
                    <div
                      key={video.id}
                      className="red-glass p-3 sm:p-4 rounded-2xl sm:rounded-3xl transition-all hover:scale-[1.03] border-[1px] border-red-500/10 flex flex-col shadow-red"
                    >
                      {/* Proper 16:9 container for videos */}
                      <div
                        className="relative w-full overflow-hidden rounded-xl"
                        style={{ paddingBottom: "56.25%" }}
                      >
                        <iframe
                          src={`https://player.twitch.tv/?video=${video.id}&parent=rhed.rhamzthev.com&parent=localhost&autoplay=false`}
                          className="absolute top-0 left-0 w-full h-full"
                          allowFullScreen
                        />
                      </div>
                      <div className="p-3 sm:p-4">
                        <h3 className="text-lg sm:text-xl font-semibold line-clamp-2 text-glow">
                          {video.title}
                        </h3>
                        <p className="text-sm text-red-300 mt-2">
                          {video.duration}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full flex items-center justify-center py-16 text-xl text-red-300/70">
                    <div className="flex flex-col items-center gap-4">
                      <svg
                        className="animate-spin h-8 w-8"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Loading recent streams...
                    </div>
                  </div>
                )}
              </div>
            </section>
          </main>

          <Footer widgets={widgets} />
        </div>
      </div>
    </SidebarProvider>
  );
}
