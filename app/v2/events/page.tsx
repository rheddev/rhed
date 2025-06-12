"use client";

import React, { useState, useCallback, useEffect } from "react";
import { EventV2 } from "@/components/events/EventV2";
import { useTwitch } from "@/hooks/use-twitch";

export default function EventsPage() {
  const {
    queue,
    event,
    login,
    pollEvent,
    removeEvent,
    isAuthenticated,
    error,
    startEventsConnection,
    closeEventsConnection
  } = useTwitch();

  const [isVisible, setIsVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [audioElements, setAudioElements] = useState({
    follow: null as HTMLAudioElement | null,
    sub: null as HTMLAudioElement | null,
    giftSub: null as HTMLAudioElement | null,
  });

  // Initialize audio elements after component mounts
  const TRANSITION_DURATION = 500;
  const SHOW_DURATION = 10;
  const HIDE_DURATION = 5;

  // SET THE AUDIO ELEMENTS
  useEffect(() => {
    if (typeof window !== "undefined") {
      setAudioElements({
        follow: new Audio("/level_up.wav"),
        sub: new Audio("/stage_clear.wav"),
        giftSub: new Audio("/boss_stage_clear.wav"),
      });
    }
  }, []);

  // START THE SOCKET
  useEffect(() => {
    startEventsConnection();
    return () => closeEventsConnection()
  }, [closeEventsConnection, startEventsConnection]);

  // MOUNT EVENT
  useEffect(() => {
    if (event) {
      setTimeout(() => {
        setIsMounted(true);
        switch (event.type) {
          case "channel.follow":
            audioElements.follow?.play().catch(console.error);
            break;
          case "channel.subscribe":
          case "channel.subscription.message":
            audioElements.sub?.play().catch(console.error);
            break;
          case "channel.subscription.gift":
            audioElements.giftSub?.play().catch(console.error);
            break;
        }  
      }, 1000);
    } else {
      setIsMounted(false);
    }
  }, [audioElements.follow, audioElements.giftSub, audioElements.sub, event]);

  // SHOW EVENT
  const processNextInQueue = useCallback(() => {
    if (queue.length === 0) return;

    setIsVisible(true);
    pollEvent();

    const hideTimer = setTimeout(() => {
      setIsVisible(false);

      setTimeout(() => {
        removeEvent();
      }, TRANSITION_DURATION);
    }, SHOW_DURATION * 1000);

    return () => clearTimeout(hideTimer);
  }, [pollEvent, queue.length, removeEvent]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (queue.length > 0 && !event) {
      timer = setTimeout(processNextInQueue, HIDE_DURATION * 1000);
    }
    return () => clearTimeout(timer);
  }, [event, processNextInQueue, queue.length]);

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen space-y-4 cyber-glass p-8">
        <h1 className="text-4xl font-bold text-red-500">
          Twitch Events Viewer
        </h1>
        <p className="text-red-300 text-lg">
          Connect to view your Twitch Events
        </p>
        <button
          onClick={login}
          className="flex items-center gap-2 px-6 py-3 bg-purple-500/80 text-white rounded-md font-semibold 
              hover:bg-purple-400 transform hover:scale-105 transition-all duration-300"
        >
          <TwitchLogo />
          <span>CONNECT</span>
        </button>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="cyber-glass border border-red-500/30 rounded-lg p-6 max-w-md w-full shadow-neon-red">
          <div className="flex items-center gap-3 mb-4">
            <svg
              className="w-6 h-6 text-red-500 animate-pulse"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h2 className="text-xl font-semibold text-red-500 cyber-text">
              SYSTEM ERROR
            </h2>
          </div>
          <p className="text-gray-400 font-mono">{error}</p>
          <button
            onClick={login}
            className="mt-6 w-full px-4 py-2 bg-red-500/80 text-white rounded-md hover:bg-red-400 
                transition-colors duration-300 font-medium cyber-button shadow-neon-red"
          >
            RECONNECT
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen flex items-center justify-center">
      {event && (
        <div
          className={`
          transform transition-all duration-500 ease-in-out
          ${
            isVisible && isMounted
              ? "opacity-100 translate-y-0 scale-100"
              : "opacity-0 translate-y-8 scale-90"
          }
        `}
        >
          <EventV2 event={event} />
        </div>
      )}
    </div>
  );
}

const TwitchLogo = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="filter drop-shadow-glow-purple"
  >
    <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z" />
  </svg>
);
