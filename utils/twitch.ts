import { ANSI_COLORS } from "./text3d/ansi";

export function formatTwitchMessage(message: TwitchMessage): string {
  let result = message.text;
  
  // Sort emotes by end position in descending order
  const sortedEmotes = [...message.emotes].sort((a, b) => b.end - a.end);
  
  // Replace each emote text with its ID format
  for (const emote of sortedEmotes) {
      const originalText = message.text.substring(emote.begin, emote.end + 1);
      // Check if there's leading/trailing whitespace in the original text
      const match = originalText.match(/^(\s*)(.*?)(\s*)$/);
      if (match) {
          const [, leadingSpace, , trailingSpace] = match;
          result = result.substring(0, emote.begin) + 
                   leadingSpace + `:${emote.id}:` + trailingSpace + 
                   result.substring(emote.end + 1);
      }
  }
  
  return result;
}

export function formatSubDuration(months: number, color: string): string {
  if (months === 1) return "first month";
  return `${color}${months}${ANSI_COLORS.WHITE} months`;
}

export function formatTier(tier: string): number {
  return parseInt(tier) / 1000;
}

export function formatGiftCount(count: number): string {
  return count === 1 ? "subscription" : "subscriptions";
}
