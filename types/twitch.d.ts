interface TwitchEventUser {
  user_id: string;
  user_login: string;
  user_name: string;
}

interface TwitchFollow extends TwitchEventUser {
  followed_at: string;
}

interface TwitchSub extends TwitchEventUser {
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

interface TwitchResub extends TwitchEventUser {
  cumulative_months: number;
  duration_months: number;
  message: TwitchMessage;
  streak_months: number;
  tier: string;
}

interface TwitchGiftSub extends TwitchEventUser {
  cumulative_total: number;
  is_anonymous: boolean;
  tier: string;
  total: number;
}

type TwitchEvent =
  | { type: "channel.follow"; event: TwitchFollow }
  | { type: "channel.subscribe"; event: TwitchSub }
  | { type: "channel.subscription.gift"; event: TwitchGiftSub }
  | { type: "channel.subscription.message"; event: TwitchResub };

interface TwitchVideo {
  id: string;
  title: string;
  thumbnail_url: string;
  duration: string;
  url: string;
  created_at: string;
  view_count: number;
}

interface TwitchTokenResponse {
  access_token: string;
  token_type: string;
  scope?: string[];
  expires_in: number;
  refresh_token?: string;
}

interface TwitchChatMessage {
  color: string;
  displayName: string;
  msg: string;
  badges: string[];
  emotes: {
    id: string;
    positions: { start: number; end: number }[];
  }[];
  userId: string;
  messageId: string;
  isMod: boolean;
  isBroadcaster: boolean;
  isSubscriber: boolean;
  isTurbo: boolean;
  isFirstMsg: boolean;
  timestamp: number;
}

interface TwitchUser {
  id: string;
  login: string;
  displayName: string;
  profileImageUrl: string;
}