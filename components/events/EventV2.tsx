// /components/EventV2.tsx
import React from "react";
import {
  formatTier,
  formatGiftCount,
} from "@/utils/twitch";

interface EventV2Props {
  event: TwitchEvent | null;
}

// Component to render message text with emotes
const TwitchMessageDisplay: React.FC<{ message: TwitchMessage }> = ({ message }) => {
  if (!message.emotes || message.emotes.length === 0) {
    return <>{message.text}</>;
  }

  // Process message to replace emotes with images
  const messageParts: React.ReactNode[] = [];
  const { text, emotes } = message;
  
  // Sort emote positions by start position to process in order
  const sortedEmotes = [...emotes].sort((a, b) => a.begin - b.begin);
  
  let lastIndex = 0;
  sortedEmotes.forEach((emote, i) => {
    // Add text before the emote
    if (emote.begin > lastIndex) {
      messageParts.push(
        <span key={`text-${i}`}>
          {text.substring(lastIndex, emote.begin)}
        </span>
      );
    }
    
    // Add the emote image
    messageParts.push(
      <img
        key={`emote-${i}`}
        src={`https://static-cdn.jtvnw.net/emoticons/v2/${emote.id}/default/dark/3.0`}
        alt={text.substring(emote.begin, emote.end + 1)}
        className="inline-block"
        style={{ 
          height: '1em', 
          verticalAlign: 'middle',
          margin: '0 2px',
        }}
      />
    );
    
    lastIndex = emote.end + 1;
  });
  
  // Add any remaining text
  if (lastIndex < text.length) {
    messageParts.push(
      <span key="text-last">{text.substring(lastIndex)}</span>
    );
  }
  
  return <>{messageParts}</>;
};

export function EventV2({ event }: EventV2Props) {
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Handle different event messages
  const renderEventContent = () => {
    if (!event) return null;

    const username = 
      event.type === "channel.subscription.gift" && event.event.is_anonymous
        ? "Anonymous"
        : event.event.user_name;

    switch (event.type) {
      case "channel.follow":
        return (
          <div className="relative flex flex-col items-center">
            <h1 className="font-ethnocentric text-red-600 text-glow-red text-[64px] z--10">{username}</h1>
            <h2 className="font-king-rimba text-white text-glow-white text-[56px] mt-[-68px]">just followed!</h2>
          </div>
        );

      case "channel.subscribe": {
        const subscribe: TwitchSub = event.event;
        return (
          <div className="relative flex flex-col items-center">
            <h1 className="font-ethnocentric text-red-600 text-glow-red text-[64px] z--10">{username}</h1>
            <h2 className="font-king-rimba text-white text-glow-white text-[56px] mt-[-68px]">
              is now a <span className="font-bold">Tier {formatTier(subscribe.tier)} sub!</span>
            </h2>
          </div>
        );
      }

      case "channel.subscription.message": {
        const resub: TwitchResub = event.event;
        return (
          <div className="relative flex flex-col items-center">
            <h1 className="font-ethnocentric text-red-600 text-glow-red text-[64px] z--10">{username}</h1>
            <h2 className="font-king-rimba text-white text-glow-white text-[56px] mt-[-68px]">
              resubscribed for <span className="font-bold">{resub.cumulative_months}</span> {resub.cumulative_months === 1 ? 'month' : 'months'} at <span className="font-bold">Tier {formatTier(resub.tier)}!</span>
            </h2>
            
            {resub.message.text && (
              <p className="text-white text-glow-white text-[24px] italic mt-[-32px]">
                &ldquo;<TwitchMessageDisplay message={resub.message} />&rdquo;
              </p>
            )}
            
            {resub.streak_months > 1 && (
              <p className="text-white text-glow-white text-[16px] mt-[-8px]">
                <span role="img" aria-label="fire">🔥</span> <span className="font-bold">{resub.streak_months} month streak!</span>
              </p>
            )}
          </div>
        );
      }

      case "channel.subscription.gift": {
        const giftSub: TwitchGiftSub = event.event;
        return (
          <div className="relative flex flex-col items-center">
            <h1 className="font-ethnocentric text-red-600 text-glow-red text-[64px] z--10">{username}</h1>
            <h2 className="font-king-rimba text-white text-glow-white text-[56px] mt-[-68px]">
              gifted <span className="font-bold">{giftSub.total} Tier {formatTier(giftSub.tier)} {formatGiftCount(giftSub.total)}!</span>
            </h2>
            
            {giftSub.cumulative_total > giftSub.total && (
              <p className="text-white text-glow-white text-[48px] mt-[-48px]">
                They&apos;ve now gifted <span className="font-bold">{giftSub.cumulative_total} subs</span> in total!
              </p>
            )}
          </div>
        );
      }

      default:
        return null;
    }
  };

  return (
    <main className="w-screen h-screen overflow-hidden flex items-center justify-center">
      <div 
        ref={containerRef} 
        className="p-8 flex flex-col items-center justify-center text-center"
      >
        {renderEventContent()}
      </div>
    </main>
  );
}
