"use client";

import { useState, useCallback, useEffect } from "react";
import { Event3D } from "@/components/events/Event3D";
import { TwitchEventHandler } from "@/components/events/TwitchEventHandler";

export default function EventsPage() {
  const [queue, setQueue] = useState<TwitchEvent[]>([]);
  const [event, setEvent] = useState<TwitchEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [audioElements, setAudioElements] = useState({
    follow: null as HTMLAudioElement | null,
    sub: null as HTMLAudioElement | null,
    giftSub: null as HTMLAudioElement | null,
  });

  // Initialize audio elements after component mounts
  useEffect(() => {
    if (typeof window !== "undefined") {
      setAudioElements({
        follow: new Audio("/level_up.wav"),
        sub: new Audio("/stage_clear.wav"),
        giftSub: new Audio("/boss_stage_clear.wav"),
      });
    }
  }, []);

  const TRANSITION_DURATION = 500;

  useEffect(() => {
    if (event) {
      setTimeout(() => setIsMounted(true), 100);
    } else {
      setIsMounted(false);
    }
  }, [event]);

  const processNextInQueue = useCallback(() => {
    const SECONDS = 10;

    // if it's empty, don't do anything
    if (queue.length === 0) return;

    // poll and show
    const [nextEvent, ...remainingEvents] = queue;
    setQueue(remainingEvents);
    setIsVisible(true);

    switch (nextEvent.type) {
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

    setTimeout(() => {
      setEvent(nextEvent);
    }, TRANSITION_DURATION);

    // wait 5 seonds, then make invisible
    const hideTimer = setTimeout(() => {
      setIsVisible(false);

      setTimeout(() => {
        setEvent(null);
      }, TRANSITION_DURATION);
    }, SECONDS * 1000);

    return () => clearTimeout(hideTimer);
  }, [audioElements.follow, audioElements.giftSub, audioElements.sub, queue]);

  useEffect(() => {
    const SECONDS = 5;

    let timer: NodeJS.Timeout;
    if (queue.length > 0 && !event) {
      timer = setTimeout(processNextInQueue, SECONDS * 1000);
    }
    return () => clearTimeout(timer);
  }, [event, queue.length, processNextInQueue]);

  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <TwitchEventHandler setQueue={setQueue} />
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
          <Event3D event={event} />
        </div>
      )}
    </div>
  );
}
