// /components/TwitchEventHandler.tsx
import { Dispatch, SetStateAction, useEffect } from "react";

interface TwitchEventHandlerProps {
    setQueue: Dispatch<SetStateAction<TwitchEvent[]>>;
}

export function TwitchEventHandler({ setQueue }: TwitchEventHandlerProps) {
  useEffect(() => {
    const connectToTwitch = async () => {
      try {
        // Create WebSocket connection to Twitch EventSub
        const socket = new WebSocket('wss://eventsub.wss.twitch.tv/ws');
        // const socket = new WebSocket("ws://localhost:8080/ws");

        socket.onopen = () => {
          console.log("Connected to Twitch EventSub");
        };

        socket.onmessage = async (e) => {
          const data = JSON.parse(e.data);

          const message_type = data.metadata?.message_type;
          const event_type = data.payload?.subscription?.type;
          const event_payload = data.payload?.event;

          // Handle the welcome message to get session_id
          if (message_type === "session_welcome") {
            const sessionId = data.payload.session.id;
            console.log("Session ID:", sessionId);

            interface EventTypeCondition {
              broadcaster_user_id: string;
              moderator_user_id?: string;
            }

            interface EventType {
              type:
                | "channel.follow"
                | "channel.subscribe"
                | "channel.subscription.gift"
                | "channel.subscription.message";
              version: string;
              condition: EventTypeCondition;
            }

            // Make subscription requests for each event type
            const event_types: EventType[] = [
              {
                type: "channel.follow",
                version: "2",
                condition: {
                  moderator_user_id: process.env.NEXT_PUBLIC_TWITCH_USER_ID,
                  broadcaster_user_id: process.env.NEXT_PUBLIC_TWITCH_USER_ID!,
                },
              },
              {
                type: "channel.subscribe",
                version: "1",
                condition: {
                  broadcaster_user_id: process.env.NEXT_PUBLIC_TWITCH_USER_ID!,
                },
              },
              {
                type: "channel.subscription.gift",
                version: "1",
                condition: {
                  broadcaster_user_id: process.env.NEXT_PUBLIC_TWITCH_USER_ID!,
                },
              },
              {
                type: "channel.subscription.message",
                version: "1",
                condition: {
                  broadcaster_user_id: process.env.NEXT_PUBLIC_TWITCH_USER_ID!,
                },
              },
            ];

            for (const type of event_types) {
              try {
                const response = await fetch(
                  "https://api.twitch.tv/helix/eventsub/subscriptions",
                  {
                    method: "POST",
                    headers: {
                      Authorization: `Bearer ${process.env.NEXT_PUBLIC_TWITCH_OAUTH_TOKEN}`,
                      "Client-Id": process.env.NEXT_PUBLIC_TWITCH_CLIENT_ID!,
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      type: type.type,
                      version: type.version,
                      condition: type.condition,
                      transport: {
                        method: "websocket",
                        session_id: sessionId,
                      },
                    }),
                  }
                );

                if (!response.ok) {
                  throw new Error(
                    `Failed to subscribe to ${type.type}: ${response.statusText}`
                  );
                }
                console.log(`Subscribed to ${type.type} events`);
              } catch (error) {
                console.error(`Error subscribing to ${type.type}:`, error);
              }
            }
          }

          if (message_type === "notification") {
            if (event_type === "channel.subscribe" && event_payload.is_gift) {
            } else if (
              [
                "channel.follow",
                "channel.subscribe",
                "channel.subscription.gift",
                "channel.subscription.message",
              ].includes(event_type)
            ) {
              const e: TwitchEvent = { type: event_type, event: event_payload };
              setQueue((prev: TwitchEvent[]) => [...prev, e]);
            }
          }
        };

        socket.onerror = (error) => {
          console.error("WebSocket error:", error);
        };

        return () => {
          socket.close();
        };
      } catch (error) {
        console.error("Error connecting to Twitch:", error);
      }
    };

    connectToTwitch();
  }, [setQueue]);

  return null;
}