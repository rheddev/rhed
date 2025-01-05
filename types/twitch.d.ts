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
