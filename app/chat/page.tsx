"use client"

import { useEffect, useState } from 'react';

interface ChatMessage {
  user: string;
  chatMessage: string;
}

const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);

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
      console.log(event)
      const message = event.data as string;
      
      if (message.startsWith('PING')) {
        socket.send('PONG');
        console.log("PONG");
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

  return (
    <div className="h-screen w-screen flex items-end justify-start">
      <div>
        {messages.map((msg, index) => (
          <div key={index} className="break-words text-shadow text-xl">
            <span className="font-bold text-[#a00]">{msg.user}:</span>{' '}
            <span className="text-white">{msg.chatMessage}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatPage;
