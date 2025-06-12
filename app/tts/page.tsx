"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Filter } from 'bad-words'

const filter = new Filter();

interface Message {
  name: string;
  amount: number;
  message: string;
  description: string;
  audio?: string;
}

export default function TTSListenPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState<Message | undefined>();
  const [isVisible, setIsVisible] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  // These are in milliseconds
  const TRANSITION_DURATION = 500;

  // These are in seconds
  const HIDE_DURATION = 5;
  const SHOW_DURATION = 10;

  const connectWebSocket = () => {

    const ws = new WebSocket("wss://tts.rhamzthev.com/ws/listen");

    ws.onopen = () => {
      console.log("WebSocket Connected");
      setIsConnected(true);
    };

    ws.onmessage = async (event) => {
      try {
        console.log("Received message:", event.data);
        const message: Message = JSON.parse(event.data);
        // [name] donated [amount]. [message]
        message.message = filter.clean(message.message);
        const fullMessage = `${message.name} donated $${message.amount.toFixed(2)}. ${message.message}`;
        const audio = await fetch("/api/tts/audio", {
          method: "POST",
          body: JSON.stringify({ message: fullMessage, description: message.description }),
        });
        const audioData = await audio.json();
        message.audio = audioData.audio;
        console.log("Received message:", message);
        setMessages((prevMessages) => [...prevMessages, message]);
      } catch (err) {
        console.error("Error parsing WebSocket message:", err);
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      setIsConnected(false);
    };

    ws.onclose = () => {
      console.log("WebSocket Disconnected");
      setIsConnected(false);
    };
  };

  const pollMessage = useCallback(async () => {
    if (messages.length === 0) return;
    const [nextMessage, ...remainingMessages] = messages;
    setMessages(remainingMessages);
    setMessage(nextMessage);

    // Play audio from base64 audio string
    const ringAudio = new Audio("/sounds/ring.wav");
    ringAudio.volume = 0.5;
    const audio = new Audio(`data:audio/wav;base64,${nextMessage.audio}`);

    await ringAudio.play();
    await audio.play();

  }, [messages]);

  const removeMessage = useCallback(() => {
    setMessage(undefined);
  }, []);

  // SHOW MESSAGE
  const processNextInQueue = useCallback(async () => {
    if (messages.length === 0) return;

    await pollMessage();
    setIsVisible(true);

    const hideTimer = setTimeout(() => {
      setIsVisible(false);

      setTimeout(() => {
        removeMessage();
      }, TRANSITION_DURATION);
    }, SHOW_DURATION * 1000);

    return () => clearTimeout(hideTimer);
  }, [pollMessage, messages.length, removeMessage]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (messages.length > 0 && !message) {
      timer = setTimeout(processNextInQueue, HIDE_DURATION * 1000);
    }
    return () => clearTimeout(timer);
  }, [message, processNextInQueue, messages.length]);

  return (
    <div className="fixed inset-0 pointer-events-none flex items-center justify-center z-50 widget">
      <div className="cyber-grid absolute inset-0 pointer-events-none"></div>

      <div className="absolute top-5 right-5 z-[1001] pointer-events-auto">
        {!isConnected && (
          <button
            onClick={connectWebSocket}
            className="rhed-button px-4 py-2 rounded text-sm font-medium flex items-center space-x-1"
          >
            <span className="w-2 h-2 rounded-full bg-red-500/50 animate-pulse mr-2"></span>
            Connect TTS
          </button>
        )}
      </div>

      <div className="w-full max-w-[500px] absolute" style={{ top: '50%', transform: 'translateY(-20%)' }}>
        {message && (
          <div 
            className={`chat-container px-5 py-4 mx-auto relative overflow-hidden transition-all duration-500 ease-in-out message-animation
              ${isVisible 
                ? "opacity-100 translate-y-0" 
                : "opacity-0 translate-y-5"
              }`}
          >            
            {/* Content */}
            <div className="relative z-10">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center space-x-2">
                  <div className="w-1 h-5 bg-red-500"></div>
                  <span className="font-mono text-red-500 text-lg font-semibold tracking-wide uppercase text-glow">
                    {message.name}
                  </span>
                </div>
                <div className="cyber-glass bg-red-500/10 border border-red-500/30 px-2 py-1 rounded-sm shadow-neon-red">
                  <span className="font-mono text-red-500 text-sm tracking-wider">
                    ${message.amount.toFixed(2)}
                  </span>
                </div>
              </div>
              
              <div className="text-white/90 text-lg leading-relaxed font-light pl-3 border-l-[1px] border-red-500/30 chat-text">
                {message.message}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
