// /api/twitch/chat/route.ts
import { NextRequest } from 'next/server';

export function GET(request: NextRequest) {
  if (!request.headers.get('upgrade')?.includes('websocket')) {
    return new Response('Expected WebSocket connection', { status: 426 });
  }

  try {
    // @ts-expect-error - NextJS doesn't have proper WebSocket types yet
    const { socket, response } = new WebSocket(request);

    socket.onopen = () => {
      // Initial connection setup
      socket.send(`PASS oauth:${process.env.TWITCH_OAUTH_TOKEN}`);
      socket.send(`NICK ${process.env.TWITCH_USERNAME}`);
      socket.send(`JOIN #${process.env.TWITCH_CHANNEL}`);
    };

    socket.onmessage = (event: { data: string; }) => {
      const message = event.data as string;

      if (message.startsWith('PING')) {
        socket.send('PONG');
        return;
      }

      const regex = /:(\w+)!\w+@\w+\.tmi\.twitch\.tv PRIVMSG #\w+ :(.*)/;
      const match = message.match(regex);
      if (match) {
        const [, user, chatMessage] = match;
        socket.send(JSON.stringify({ user, chatMessage }));
      }
    };

    return response;
  } catch (error) {
    console.error(error)
    return new Response('WebSocket connection failed', { status: 500 });
  }
}