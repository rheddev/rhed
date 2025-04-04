"use client"

import React, { useEffect, useState } from 'react';
import { useTwitch } from '@/hooks/use-twitch';
import EmoteMessage from '@/components/EmoteMessage';

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
        const element = document.getElementById(`chat-msg-${index}`);
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

  function isValidHexColor(color: string): boolean {
    const hexColorRegex = /^#[0-9A-Fa-f]{6}$/;
    return hexColorRegex.test(color);
  }

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen space-y-4 cyber-glass p-8">
        <h1 className="text-4xl font-bold text-red-500">Twitch Chat</h1>
        <p className="text-red-300 text-lg">
          Connect to display your channel&apos;s chat
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
    <div className="h-screen w-screen flex items-end justify-start bg-transparent overflow-hidden">
      <div className="cyber-grid absolute inset-0 pointer-events-none"></div>
      {messages.length > 0 && (
        <div className="chat-container mb-4 mx-4 p-4 rounded-lg w-[calc(100vw-2rem)] overflow-y-auto max-h-[80vh] scrollbar-thin scrollbar-thumb-red-500/30 scrollbar-track-transparent">
          {messages.map((message, index) => (
            <div 
              key={message.messageId || index} 
              id={`chat-msg-${index}`} 
              className={`py-2 message-animation ${message.isFirstMsg ? 'border-l-2 border-yellow-500/50 pl-2' : ''}`}
            >
              <div className="chat-line">
                {/* Badge section - uses inline-block */}
                {message.badges && message.badges.length > 0 && (
                  <span className="inline-block mr-1 text-white">
                    {message.isBroadcaster && (
                      <span className="cyber-badge bg-red-500/70 text-[10px] font-bold">HOST</span>
                    )}
                    {message.isMod && (
                      <span className="cyber-badge bg-green-500/70 text-[10px] font-bold">MOD</span>
                    )}
                    {message.isSubscriber && (
                      <span className="cyber-badge bg-purple-500/70 text-[10px] font-bold">SUB</span>
                    )}
                  </span>
                )}
                
                {/* First-time chatter indicator */}
                {message.isFirstMsg && (
                  <span className="cyber-badge bg-yellow-500/70 text-[10px] text-black inline-block mr-1">
                    FIRST
                  </span>
                )}

                {/* Username - also inline-block */}
                <span
                  className={`font-bold inline-block mr-1 ${message.badges && message.badges.length > 0 ? 'badge-user-name' : ''}`}
                  style={{
                    color: !message.isBroadcaster 
                      ? getColorGradient(messagePositions[index] || 0, '#FF2222', isValidHexColor(message.color) ? message.color : "#FF2222") 
                      : "#FF2222"
                  }}
                >
                  {message.displayName}:
                </span>

                {/* Message with emotes - plain text flow */}
                <EmoteMessage message={message} />
              </div>
            </div>
          ))}
        </div>
      )}
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
    className="filter drop-shadow-glow-purple"
  >
    <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z" />
  </svg>
);

export default ChatPage;