"use client"

import { useEffect, useState, useRef } from 'react';

interface ChatMessage {
  user: string;
  chatMessage: string;
}

const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [messagePositions, setMessagePositions] = useState<{ [key: number]: number }>({});
  const [pageHeight, setPageHeight] = useState(0);

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

  useEffect(() => {
    const socket = new WebSocket('wss://irc-ws.chat.twitch.tv:443');

    socket.onopen = () => {
      console.log('Connected to Twitch Chat');
      // Authenticate with your Twitch channel credentials
      socket.send(`PASS oauth:${process.env.NEXT_PUBLIC_TWITCH_OAUTH_TOKEN}`); // Replace with your OAuth token
      socket.send(`NICK RhedDev`); // Replace with your Twitch username
      socket.send(`JOIN #RhedDev`); // Replace with your channel name
    };

    socket.onmessage = (event) => {
      const message = event.data as string;

      if (message.startsWith('PING')) {
        socket.send('PONG');
        return;
      }

      const regex = /:(\w+)!\w+@\w+\.tmi\.twitch\.tv PRIVMSG #\w+ :(.*)/;
      const match = message.match(regex);
      if (match) {
        const [, user, chatMessage] = match;
        setMessages((prev) => [...prev, { user, chatMessage }]);
      }
    };

    return () => {
      socket.close();
    };
  }, []);


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

  return (
    <div className="h-screen w-screen flex items-end justify-start">
      <div>
        {messages.map((msg, index) => (
          <div key={index} id={index.toString()} className="break-words text-shadow text-xl message-animation">
            <span
              style={{
                color: getColorGradient(messagePositions[index] || 0, '#000000', '#aa0000') // top to bottom
              }}
              className="font-bold">{msg.user}:</span>{' '}
            <span className="text-white">{msg.chatMessage}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatPage;
