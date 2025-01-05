"use client"

import React, { useEffect, useState } from 'react';
import { useTwitch } from '@/hooks/use-twitch';

const ChatPage: React.FC = () => {
  const { messages, isAuthenticated, error, login, startChatConnection, closeChatConnection } = useTwitch();
  const [messagePositions, setMessagePositions] = useState<{ [key: number]: number }>({});
  const [pageHeight, setPageHeight] = useState(0);

  const getColorGradient = (yPosition: number, startColor: string, endColor: string) => {
    const ratio = Math.min(Math.max(yPosition / pageHeight, 0), 1);

    // Convert hex to RGB
    const start = parseInt(startColor.slice(1), 16);
    const end = parseInt(endColor.slice(1), 16);

    const r1 = (start >> 16) & 255;
    const g1 = (start >> 8) & 255;
    const b1 = start & 255;

    const r2 = (end >> 16) & 255;
    const g2 = (end >> 8) & 255;
    const b2 = end & 255;

    const r = Math.round(r1 + (r2 - r1) * ratio);
    const g = Math.round(g1 + (g2 - g1) * ratio);
    const b = Math.round(b1 + (b2 - b1) * ratio);

    return `rgb(${r}, ${g}, ${b})`;
  };

  useEffect(() => {
    startChatConnection();
    return () => closeChatConnection()
  }, [closeChatConnection, startChatConnection]);

  useEffect(() => {
    const updatePositions = () => {
      setPageHeight(window.innerHeight);
      messages.forEach((_, index) => {
        const element = document.getElementById(index.toString());
        if (element) {
          const rect = element.getBoundingClientRect();
          setMessagePositions(prev => ({ ...prev, [index]: rect.y }));
        }
      });
    };

    updatePositions();
    window.addEventListener('resize', updatePositions);
    return () => window.removeEventListener('resize', updatePositions);
  }, [messages]);

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-white">Twitch Chat Viewer</h1>
          <p className="text-gray-400 text-lg">
            Connect to view your Twitch chat
          </p>
        </div>
        <button
          onClick={login}
          className="flex items-center gap-2 px-6 py-3 bg-purple-500 text-white rounded-full font-semibold 
              hover:bg-purple-400 transform hover:scale-105 transition-all duration-300 shadow-lg"
        >
          <TwitchLogo />
          Connect to Twitch
        </button>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6 max-w-md w-full">
          <div className="flex items-center gap-3 mb-4">
            <svg
              className="w-6 h-6 text-red-500"
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
            <h2 className="text-xl font-semibold text-red-500">
              Error Occurred
            </h2>
          </div>
          <p className="text-gray-400">{error}</p>
          <button
            onClick={login}
            className="mt-6 w-full px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-400 
                transition-colors duration-300 font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen flex items-end justify-start">
      <div>
        {messages.map((message, index) => (
          <div key={index} id={index.toString()} className="break-words text-shadow text-2xl message-animation">
            <span
              style={{
                color: getColorGradient(messagePositions[index] || 0, '#AA0000', message.color) // Top to bottom
              }}
              className="font-bold"
            >
              {message.displayName}:
            </span>{' '}
            <span className="text-white">{message.msg}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const TwitchLogo = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z"/>
  </svg>
);

export default ChatPage;