import { useState, useCallback, useEffect } from "react";

export function useTwitch() {
  const [messages, setMessages] = useState<TwitchChatMessage[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<TwitchUser | null>(null);
  const [chatSocket, setChatSocket] = useState<WebSocket | null>(null);

  const [queue, setQueue] = useState<TwitchEvent[]>([]);
  const [event, setEvent] = useState<TwitchEvent | null>(null);
  const [eventSocket, setEventSocket] = useState<WebSocket | null>(null);

  const [videos, setVideos] = useState([]);
  const [globalBadges, setGlobalBadges] = useState<TwitchBadgeSet[]>([]);
  const [channelBadges, setChannelBadges] = useState<TwitchBadgeSet[]>([]);

  const fetchVideos = useCallback(async () => {
    try {
      const response = await fetch("/api/twitch/videos");
      if (!response.ok) {
        throw new Error("Failed to fetch videos");
      }
      const data = await response.json();
      setVideos(data);
    } catch (error) {
      console.error("Error fetching videos:", error);
      setError(
        error instanceof Error ? error.message : "Failed to fetch videos"
      );
    }
  }, []);

  const checkAuthStatus = useCallback(async () => {
    try {
      const response = await fetch("/api/twitch/current-user");
      const data = await response.json();

      if (data.error) {
        setError(data.error);
        setIsAuthenticated(false);
        return false;
      }

      setIsAuthenticated(data.authenticated);
      if (data.user) {
        setUser(data.user);
      }
      return data.authenticated;
    } catch (error) {
      console.error(error);
      setError("Failed to check authentication status");
      setIsAuthenticated(false);
      return false;
    }
  }, []);

  const login = useCallback(() => {
    window.location.href = "/api/twitch/authorize";
  }, []);

  const getGlobalChatBadges = useCallback(async () => {
    try {
      const tokenResponse = await fetch("/api/twitch/token");
      const { access_token } = await tokenResponse.json();

      if (!access_token) {
        setError("Failed to get access token");
        return [];
      }

      const response = await fetch("https://api.twitch.tv/helix/chat/badges/global", {
        headers: {
          "Authorization": `Bearer ${access_token}`,
          "Client-Id": process.env.NEXT_PUBLIC_TWITCH_CLIENT_ID!
        }
      });

      if (!response.ok) {
        throw new Error("Failed to fetch global chat badges");
      }

      const data = await response.json();
      setGlobalBadges(data.data);
      return data.data;
    } catch (error) {
      console.error("Error fetching global chat badges:", error);
      return [];
    }
  }, []);

  const getChannelChatBadges = useCallback(async (broadcasterId: string) => {
    if (!broadcasterId) return [];
    
    try {
      const tokenResponse = await fetch("/api/twitch/token");
      const { access_token } = await tokenResponse.json();

      if (!access_token) {
        setError("Failed to get access token");
        return [];
      }

      const response = await fetch(`https://api.twitch.tv/helix/chat/badges?broadcaster_id=${broadcasterId}`, {
        headers: {
          "Authorization": `Bearer ${access_token}`,
          "Client-Id": process.env.NEXT_PUBLIC_TWITCH_CLIENT_ID!
        }
      });

      if (!response.ok) {
        throw new Error("Failed to fetch channel chat badges");
      }

      const data = await response.json();
      setChannelBadges(data.data);
      return data.data;
    } catch (error) {
      console.error("Error fetching channel chat badges:", error);
      return [];
    }
  }, []);

  // CHAT
  const startChatConnection = useCallback(async () => {
    if (!isAuthenticated || chatSocket) return;

    try {
      const tokenResponse = await fetch("/api/twitch/token");
      const { access_token } = await tokenResponse.json();

      if (!access_token) {
        setError("Failed to get access token");
        return;
      }

      // Fetch badges first
      let gBadges: TwitchBadgeSet[] = [];
      let cBadges: TwitchBadgeSet[] = [];
      
      try {
        gBadges = await getGlobalChatBadges();
        console.log("Retrieved global badges:", gBadges);
      } catch (error) {
        console.error("Error fetching global badges:", error);
      }
      
      if (user) {
        try {
          cBadges = await getChannelChatBadges(user.id);
          console.log("Retrieved channel badges:", cBadges);
        } catch (error) {
          console.error("Error fetching channel badges:", error);
        }
      }

      // Hardcoded fallback for critical badges if API fails
      const ensureBadgeExists = (badgeId: string, badgeSet: TwitchBadgeSet[]) => {
        if (!badgeSet.some(set => set.set_id === badgeId)) {
          console.log(`Adding fallback for missing badge: ${badgeId}`);
          
          // Add a minimal badge set
          const fallbackSet: TwitchBadgeSet = {
            set_id: badgeId,
            versions: [
              {
                id: "1",
                image_url_1x: `https://static-cdn.jtvnw.net/badges/v1/${badgeId}/1`,
                image_url_2x: `https://static-cdn.jtvnw.net/badges/v1/${badgeId}/2`,
                image_url_4x: `https://static-cdn.jtvnw.net/badges/v1/${badgeId}/3`,
                title: badgeId.charAt(0).toUpperCase() + badgeId.slice(1),
                description: "",
                click_action: null,
                click_url: null
              }
            ]
          };
          
          badgeSet.push(fallbackSet);
        }
      };
      
      // Ensure critical badges exist
      ensureBadgeExists("broadcaster", gBadges);
      ensureBadgeExists("moderator", gBadges);
      ensureBadgeExists("subscriber", gBadges);
      
      const newSocket = new WebSocket("wss://irc-ws.chat.twitch.tv:443");

      newSocket.onopen = () => {
        newSocket.send(`CAP REQ :twitch.tv/commands twitch.tv/tags`);
        newSocket.send(`PASS oauth:${access_token}`);
        newSocket.send(`NICK ${process.env.NEXT_PUBLIC_TWITCH_NICKNAME}`);
        if (user) {
          newSocket.send(`JOIN #${user.login.toLowerCase()}`);
        }
      };

      newSocket.onmessage = (event) => {
        const message = event.data as string;

        if (message.startsWith("PING")) {
          newSocket.send("PONG");
          return;
        }

        console.log(message);

        // Skip non-PRIVMSG messages
        if (!message.includes("PRIVMSG")) {
          return;
        }

        try {
          console.log(message)
          // Parse tags
          const tagsPart = message.split(' :')[0];
          if (!tagsPart.startsWith('@')) return;
          
          const tags: Record<string, string> = {};
          tagsPart.substring(1).split(';').forEach(tag => {
            const [key, value] = tag.split('=');
            tags[key] = value;
          });
          
          // Extract message content
          const msgParts = message.split(' PRIVMSG #');
          if (msgParts.length < 2) return;
          
          const channelMsgParts = msgParts[1].split(' :');
          if (channelMsgParts.length < 2) return;
          
          const msg = channelMsgParts[1];
          
          // Process badges
          const badges: string[] = tags.badges ? tags.badges.split(',') : [];
          
          // More robust broadcaster detection
          const isBroadcaster = badges.some(badge => badge.startsWith('broadcaster')) && 
                               (user && tags['user-id'] === user.id) // || 
                               // (user && tags['room-id'] === user.id);
          
          console.log('Is broadcaster check:', {
            badgeCheck: badges.some(badge => badge.startsWith('broadcaster')),
            userIdMatch: user && tags['user-id'] === user.id,
            // roomIdMatch: user && tags['room-id'] === user.id,
            result: isBroadcaster
          });
          
          const isMod = tags.mod === '1' || badges.some(badge => badge.startsWith('moderator'));
          const isSubscriber = tags.subscriber === '1' || badges.some(badge => badge.startsWith('subscriber'));
          const isTurbo = tags.turbo === '1';
          const isFirstMsg = tags['first-msg'] === '1';
          
          // Process badges to get images
          const badgeInfo: TwitchBadgeInfo[] = [];
          
          console.log('Processing badges:', badges);
          console.log('Channel badges sets:', cBadges);
          console.log('Global badges sets:', gBadges);
          
          // If user is broadcaster but no broadcaster badge is found, add it manually
          if (isBroadcaster && !badges.some(badge => badge.startsWith('broadcaster/'))) {
            console.log('Adding missing broadcaster badge');
            badges.push('broadcaster/1');
          }
          
          if (badges.length > 0) {
            badges.forEach(badge => {
              const [badgeId, badgeVersion] = badge.split('/');
              console.log(`Processing badge: ${badgeId}/${badgeVersion}`);
              
              // First check channel badges
              let badgeFound = false;
              const channelBadgeSet = cBadges.find((set: TwitchBadgeSet) => set.set_id === badgeId);
              
              if (channelBadgeSet) {
                console.log(`Found channel badge set for ${badgeId}`, channelBadgeSet);
                
                const versionObj = channelBadgeSet.versions.find(v => v.id === badgeVersion);
                if (versionObj) {
                  console.log(`Found channel badge version ${badgeVersion}`, versionObj);
                  
                  badgeInfo.push({
                    id: badgeId,
                    version: badgeVersion,
                    imageUrl: versionObj.image_url_4x,
                    title: versionObj.title
                  });
                  badgeFound = true;
                }
              }
              
              // If not found in channel badges, check global badges
              if (!badgeFound) {
                const globalBadgeSet = gBadges.find((set: TwitchBadgeSet) => set.set_id === badgeId);
                
                if (globalBadgeSet) {
                  console.log(`Found global badge set for ${badgeId}`, globalBadgeSet);
                  
                  const versionObj = globalBadgeSet.versions.find(v => v.id === badgeVersion);
                  if (versionObj) {
                    console.log(`Found global badge version ${badgeVersion}`, versionObj);
                    
                    badgeInfo.push({
                      id: badgeId,
                      version: badgeVersion,
                      imageUrl: versionObj.image_url_4x,
                      title: versionObj.title
                    });
                  } else {
                    console.log(`Version ${badgeVersion} not found in global badge set ${badgeId}`, globalBadgeSet.versions);
                  }
                } else {
                  console.log(`Global badge set not found for ${badgeId}`);
                }
              }
            });
          }
          
          console.log('Final badgeInfo:', badgeInfo);
          
          // Process emotes
          const emotes: {
            id: string;
            positions: { start: number; end: number }[];
          }[] = [];
          
          if (tags.emotes && tags.emotes !== '') {
            const emoteGroups = tags.emotes.split('/');
            emoteGroups.forEach(group => {
              if (!group) return;
              
              const [emoteId, positionsList] = group.split(':');
              const positions = positionsList.split(',').map(position => {
                const [start, end] = position.split('-').map(Number);
                return { start, end };
              });
              
              emotes.push({ id: emoteId, positions });
            });
          }
         
          console.log(isBroadcaster);

          // Create message object
          const chatMessage: TwitchChatMessage = {
            color: tags.color || '#FFFFFF',
            displayName: tags['display-name'] || 'Anonymous',
            msg,
            badges,
            badgeInfo,
            emotes,
            userId: tags['user-id'] || '',
            messageId: tags.id || '',
            isMod,
            isBroadcaster: !!isBroadcaster,
            isSubscriber,
            isTurbo,
            isFirstMsg,
            timestamp: tags['tmi-sent-ts'] ? parseInt(tags['tmi-sent-ts'], 10) : Date.now(),
          };
          
          setMessages((prev) => [...prev, chatMessage]);
        } catch (error) {
          console.error("Error parsing Twitch message:", error);
        }
      };

      newSocket.onerror = (error) => {
        console.error("WebSocket error:", error);
        setError("WebSocket connection error");
      };

      newSocket.onclose = () => {
        setChatSocket(null);
      };

      setChatSocket(newSocket);
    } catch (error) {
      console.error(error);
      setError("Failed to start chat connection");
    }
  }, [isAuthenticated, chatSocket, user, getGlobalChatBadges, getChannelChatBadges]);

  const closeChatConnection = useCallback(() => {
    if (chatSocket) {
      chatSocket.close();
      setChatSocket(null);
    }
  }, [chatSocket]);

  // EVENTS
  const startEventsConnection = useCallback(async () => {
    if (!isAuthenticated || eventSocket) return;

    try {
      const newSocket = new WebSocket("wss://eventsub.wss.twitch.tv/ws");
      // const newSocket = new WebSocket("ws://127.0.0.1:8080/ws");

      newSocket.onopen = () => {
        console.log("Connected to Twitch EventSub");
      };

      newSocket.onmessage = async (e) => {
        const data = JSON.parse(e.data);
        const message_type = data.metadata?.message_type;
        const event_type = data.payload?.subscription?.type;
        const event_payload = data.payload?.event;

        if (message_type === "session_welcome") {
          const sessionId = data.payload.session.id;

          const event_types = [
            {
              type: "channel.follow",
              version: "2",
              condition: {
                moderator_user_id: user?.id,
                broadcaster_user_id: user?.id,
              },
            },
            {
              type: "channel.subscribe",
              version: "1",
              condition: {
                broadcaster_user_id: user?.id,
              },
            },
            {
              type: "channel.subscription.gift",
              version: "1",
              condition: {
                broadcaster_user_id: user?.id,
              },
            },
            {
              type: "channel.subscription.message",
              version: "1",
              condition: {
                broadcaster_user_id: user?.id,
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
                    Authorization: `Bearer ${await fetch("/api/twitch/token")
                      .then((r) => r.json())
                      .then((d) => d.access_token)}`,
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
                throw new Error(`Failed to subscribe to ${type.type}`);
              }
            } catch (error) {
              console.error(`Error subscribing to ${type.type}:`, error);
            }
          }
        }

        if (message_type === "notification") {
          if (event_type === "channel.subscribe" && event_payload.is_gift) {
            return;
          }

          if (
            [
              "channel.follow",
              "channel.subscribe",
              "channel.subscription.gift",
              "channel.subscription.message",
            ].includes(event_type)
          ) {
            const newEvent: TwitchEvent = {
              type: event_type,
              event: event_payload,
            };
            setQueue((prev) => [...prev, newEvent]);
          }
        }
      };

      newSocket.onerror = (error) => {
        console.error("WebSocket error:", error);
        setError("EventSub WebSocket connection error");
      };

      newSocket.onclose = () => {
        setEventSocket(null);
      };

      setEventSocket(newSocket);
    } catch (error) {
      console.error(error);
      setError("Failed to start events connection");
    }
  }, [isAuthenticated, eventSocket, user]);

  const closeEventsConnection = useCallback(() => {
    if (eventSocket) {
      eventSocket.close();
      setEventSocket(null);
    }
  }, [eventSocket]);

  const pollEvent = useCallback(() => {
    if (queue.length === 0) return;
    const [nextEvent, ...remainingEvents] = queue;
    setQueue(remainingEvents);
    setEvent(nextEvent);
  }, [queue]);

  const removeEvent = useCallback(() => {
    setEvent(null);
  }, []);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  // Load badges when user is authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      getGlobalChatBadges();
      getChannelChatBadges(user.id);
    }
  }, [isAuthenticated, user, getGlobalChatBadges, getChannelChatBadges]);

  return {
    videos,
    messages,
    isAuthenticated,
    error,
    user,
    event,
    queue,
    globalBadges,
    channelBadges,
    fetchVideos,
    checkAuthStatus,
    login,
    startChatConnection,
    closeChatConnection,
    startEventsConnection,
    closeEventsConnection,
    pollEvent,
    removeEvent,
    getGlobalChatBadges,
    getChannelChatBadges,
  };
}
