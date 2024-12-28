/* eslint-disable @next/next/no-img-element */
'use client';

import { useEffect, useState, useCallback, ReactElement } from 'react';

interface TwitchEvent {
  user_id: string;
  user_login: string;
  user_name: string;
}

interface TwitchFollow extends TwitchEvent {
  followed_at: string;
}

interface TwitchSub extends TwitchEvent {
  tier: string;
  is_gift: boolean;
}

interface TwitchEmote {
  begin: number;
  end: number;
  id: string;
}

interface TwitchMessage {
  emotes: TwitchEmote[];
  text: string;
}

interface TwitchResub extends TwitchEvent {
  cumulative_months: number;
  duration_months: number;
  message: TwitchMessage;
  streak_months: number;
  tier: string;
}

interface TwitchGiftSub {
  cumulative_total: number;
  is_anonymous: boolean;
  tier: string;
  total: number;
  user_id: string;
  user_login: string;
  user_name: string;
}

type Event =
  | { type: 'channel.follow'; event: TwitchFollow }
  | { type: 'channel.subscribe'; event: TwitchSub }
  | { type: 'channel.subscription.gift'; event: TwitchGiftSub }
  | { type: 'channel.subscription.message'; event: TwitchResub };

export default function TwitchFollowsPage() {
  const [queue, setQueue] = useState<Event[]>([]);
  const [event, setEvent] = useState<Event | null>(null);

  const [isVisible, setIsVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const [audioElements, setAudioElements] = useState<{
    follow: HTMLAudioElement | null;
    sub: HTMLAudioElement | null;
    giftSub: HTMLAudioElement | null;
  }>({
    follow: null,
    sub: null,
    giftSub: null
  });

  // Initialize audio elements after component mounts
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setAudioElements({
        follow: new Audio('/level_up.wav'),
        sub: new Audio('/stage_clear.wav'),
        giftSub: new Audio('/boss_stage_clear.wav')
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
      case 'channel.follow':
        audioElements.follow?.play().catch(console.error);
        break;
      case 'channel.subscribe':
      case 'channel.subscription.message':
        audioElements.sub?.play().catch(console.error);
        break;
      case 'channel.subscription.gift':
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
    const SECONDS = 2;

    let timer: NodeJS.Timeout;
    if (queue.length > 0 && !event) {
      timer = setTimeout(processNextInQueue, SECONDS * 1000);
    }
    return () => clearTimeout(timer);
  }, [queue.length, event, processNextInQueue]);

  useEffect(() => {
    const connectToTwitch = async () => {
      try {
        // Create WebSocket connection to Twitch EventSub
        const socket = new WebSocket('wss://eventsub.wss.twitch.tv/ws');
        // const socket = new WebSocket('ws://localhost:8080/ws');

        socket.onopen = () => {
          console.log('Connected to Twitch EventSub');
        };

        socket.onmessage = async (event) => {
          console.log(event);
          const data = JSON.parse(event.data);
      
          const message_type = data.metadata?.message_type;
          const event_type = data.payload?.subscription?.type;
          const event_payload = data.payload?.event;
      
          // Handle the welcome message to get session_id
          if (message_type === 'session_welcome') {
            const sessionId = data.payload.session.id;
            console.log('Session ID:', sessionId);

            interface EventTypeCondition {
              broadcaster_user_id: string;
              moderator_user_id?: string;
            }
            
            interface EventType {
              type: 'channel.follow' | 'channel.subscribe' | 'channel.subscription.gift' | 'channel.subscription.message';
              version: string;
              condition: EventTypeCondition;
            }

            // Make subscription requests for each event type
            const event_types: EventType[] = [
              {
                type: 'channel.follow', 
                version: '2', 
                condition: {
                  moderator_user_id: process.env.NEXT_PUBLIC_TWITCH_USER_ID, 
                  broadcaster_user_id: process.env.NEXT_PUBLIC_TWITCH_USER_ID!
                }
              },
              {
                type: 'channel.subscribe', 
                version: '1',
                condition: {
                  broadcaster_user_id: process.env.NEXT_PUBLIC_TWITCH_USER_ID!,
                },
              },
              {
                type: 'channel.subscription.gift', 
                version: '1',
                condition: {
                  broadcaster_user_id: process.env.NEXT_PUBLIC_TWITCH_USER_ID!,
                },
              },
              {
                type: 'channel.subscription.message', 
                version: '1',
                condition: {
                  broadcaster_user_id: process.env.NEXT_PUBLIC_TWITCH_USER_ID!,
                },
              },
            ];

            for (const type of event_types) {
              try {
                const response = await fetch('https://api.twitch.tv/helix/eventsub/subscriptions', {
                  method: 'POST',
                  headers: {
                    'Authorization': `Bearer ${process.env.NEXT_PUBLIC_TWITCH_OAUTH_TOKEN}`,
                    'Client-Id': process.env.NEXT_PUBLIC_TWITCH_CLIENT_ID!,
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    type: type.type,
                    version: type.version,
                    condition: type.condition,
                    transport: {
                      method: 'websocket',
                      session_id: sessionId
                    }
                  })
                });

                if (!response.ok) {
                  throw new Error(`Failed to subscribe to ${type.type}: ${response.statusText}`);
                }
                console.log(`Subscribed to ${type.type} events`);
              } catch (error) {
                console.error(`Error subscribing to ${type.type}:`, error);
              }
            }
          }

          if (message_type === 'notification'){
            if (event_type === "channel.subscribe" && event_payload.is_gift) {} 
            else if ([
            "channel.follow", 
            "channel.subscribe", 
            "channel.subscription.gift", 
            "channel.subscription.message",
          ].includes(event_type)){
            const e: Event = { type: event_type, event: event_payload }
            setQueue(prev => [...prev, e])}
          }
        };

        socket.onerror = (error) => {
          console.error('WebSocket error:', error);
        };

        return () => {
          socket.close();
        };
      } catch (error) {
        console.error('Error connecting to Twitch:', error);
      }
    };

    connectToTwitch();
  }, []);

  // Helper functions
  const formatEmoteMessage = (message: TwitchMessage): ReactElement[] => {
    const result: ReactElement[] = [];
    let lastIndex = 0;
    
    const sortedEmotes = [...message.emotes].sort((a, b) => a.begin - b.begin);
    
    sortedEmotes.forEach((emote) => {
      // Add text before the emote (up to begin index)
      if (lastIndex < emote.begin) {
        result.push(
          <span key={`text-${lastIndex}`}>
            {message.text.substring(lastIndex, emote.begin)}
          </span>
        );
      }
      
      // Add the emote (inclusive indices, so add 1 to end)
      const emoteUrl = `https://static-cdn.jtvnw.net/emoticons/v1/${emote.id}/1.0`;
      result.push(
        <img 
          key={`emote-${emote.begin}`}
          src={emoteUrl}
          alt={message.text.substring(emote.begin, emote.end + 1)}
          className="inline-block h-6"
        />
      );
      
      lastIndex = emote.end + 1;
    });
    
    // Add remaining text after the last emote
    if (lastIndex < message.text.length) {
      result.push(
        <span key={`text-${lastIndex}`}>
          {message.text.substring(lastIndex)}
        </span>
      );
    }
    
    return result;
  };

  const formatTier = (tier: string): number => parseInt(tier) / 1000;

  const formatSubDuration = (months: number): string => {
    if (months === 1) return "first month";
    return `${months} months`;
  };

  // Helper function for pluralization
  const formatGiftCount = (count: number): string => {
    return count === 1 ? "subscription" : "subscriptions";
  };

  const CurrentEvent = () => {
    switch(event?.type) {
      case "channel.follow":
        const follow: TwitchFollow = event.event;
        return (
          <div className='text-center p-4'>
            <p className="text-8xl font-playwrite font-extralight text-glow p-3">{follow.user_name}</p>
            <p className="text-white text-3xl text-shadow">just followed!</p>
          </div>
        );
        case "channel.subscribe":
          const subscribe: TwitchSub = event.event;
          return (
            <div className='text-center p-4'>
              <p className="text-8xl font-playwrite font-extralight text-glow p-3">
                {subscribe.user_name}
              </p>
              <p className="text-white text-3xl text-shadow">
                is now a <strong>Tier {formatTier(subscribe.tier)} sub!</strong>
              </p>
            </div>
          );
        case "channel.subscription.message":
          const resub: TwitchResub = event.event;
          return (
            <div className='text-center p-4'>
              <p className="text-8xl font-playwrite font-extralight text-glow p-3">
                {resub.user_name}
              </p>
              <p className="text-white text-3xl text-shadow">
                resubscribed for <strong>{formatSubDuration(resub.cumulative_months)}</strong> at{' '}
                <strong>Tier {formatTier(resub.tier)}</strong>!
              </p>
              {resub.message.text && (
                <p className="text-white text-5xl mt-2 text-shadow">
                  &quot;{formatEmoteMessage(resub.message)}&quot;
                </p>
              )}
              {resub.streak_months > 1 && (
                <p className="text-glow-rotate text-2xl mt-1">
                  🔥 {resub.streak_months} month streak!
                </p>
              )}
            </div>
          );
          case "channel.subscription.gift":
            const giftSub: TwitchGiftSub = event.event;
            const gifterName = giftSub.is_anonymous ? "Anonymous" : giftSub.user_name;
            
            return (
              <div className='text-center p-4'>
                <p className="text-8xl font-playwrite font-extralight text-glow p-3">
                  {gifterName}
                </p>
                <p className="text-white text-3xl text-shadow">
                  gifted <strong>{giftSub.total} {formatGiftCount(giftSub.total)}</strong> at{' '}
                  <strong>Tier {formatTier(giftSub.tier)}</strong>!
                </p>
                {giftSub.cumulative_total > giftSub.total && (
                  <p className="text-white text-xl mt-1 text-shadow">
                    They&apos;ve gifted <strong>{giftSub.cumulative_total} subs</strong> in total!
                  </p>
                )}
              </div>
            );
      default:
        return null;
    }
  }

  return (
    <div className='w-screen h-screen flex items-center justify-center'>
      {event && (
        <div className={`
          transform transition-all duration-500 ease-in-out
          ${isVisible && isMounted ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-90'}
        `}>
          <CurrentEvent />
        </div>
      )}
    </div>
  );
}