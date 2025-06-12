import React, { useState } from 'react';

interface BadgeDisplayProps {
  badgeInfo?: TwitchBadgeInfo[];
}

// Known badge IDs to direct image URLs if needed
const BADGE_FALLBACK_URLS: Record<string, string> = {
  broadcaster: 'https://static-cdn.jtvnw.net/badges/v1/5527c58c-fb7d-422d-b71b-f309dcb85cc1/3',
  moderator: 'https://static-cdn.jtvnw.net/badges/v1/3267646d-33f0-4b17-b3df-f923a41db1d0/3',
  subscriber: 'https://static-cdn.jtvnw.net/badges/v1/5d9f2208-5dd8-11e7-8513-2ff4adfae661/3',
  premium: 'https://static-cdn.jtvnw.net/badges/v1/a1dd5073-19c3-4911-8cb4-c464a7bc1510/3',
  turbo: 'https://static-cdn.jtvnw.net/badges/v1/bd444ec6-8f34-4bf9-91f4-af1e3428d80f/3',
  partner: 'https://static-cdn.jtvnw.net/badges/v1/d12a2e27-16f6-41d0-ab77-b780518f00a3/3',
  glhf_pledge: 'https://static-cdn.jtvnw.net/badges/v1/3158e758-3cb4-43c5-94b3-7639810451c5/3',
  bits: 'https://static-cdn.jtvnw.net/badges/v1/73b5c3fb-24f9-4a82-a852-2f475b59411c/3',
  vip: 'https://static-cdn.jtvnw.net/badges/v1/b817aba4-fad8-49e2-b88a-7cc744dfa6ec/3'
};

const BadgeDisplay: React.FC<BadgeDisplayProps> = ({ badgeInfo }) => {
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  if (!badgeInfo || badgeInfo.length === 0) {
    return null;
  }

  const handleImageError = (badge: TwitchBadgeInfo) => {
    console.log(`Badge image failed to load: ${badge.id}/${badge.version}`);
    setFailedImages(prev => ({
      ...prev,
      [`${badge.id}-${badge.version}`]: true
    }));
  };

  // Generate a fallback badge based on the type
  const getFallbackBadge = (badgeId: string) => {
    switch (badgeId) {
      case 'broadcaster':
        return (
          <span className="px-1 py-0.5 bg-red-500/70 text-white text-xs font-bold shadow-[0_0_5px] shadow-red-500/70 rounded">
            HOST
          </span>
        );
      case 'moderator':
        return (
          <span className="px-1 py-0.5 bg-green-500/70 text-white text-xs font-bold shadow-[0_0_5px] shadow-green-500/70 rounded">
            MOD
          </span>
        );
      case 'subscriber':
        return (
          <span className="px-1 py-0.5 bg-purple-500/70 text-white text-xs font-bold shadow-[0_0_5px] shadow-purple-500/70 rounded">
            SUB
          </span>
        );
      default:
        return (
          <span className="px-1 py-0.5 bg-blue-500/70 text-white text-xs font-bold shadow-[0_0_5px] shadow-blue-500/70 rounded">
            {badgeId.slice(0, 3).toUpperCase()}
          </span>
        );
    }
  };

  // Get best image URL for a badge
  const getBadgeImageUrl = (badge: TwitchBadgeInfo) => {
    // If we have a specific fallback URL for this badge type, use it
    if (badge.imageUrl && badge.imageUrl.includes('static-cdn.jtvnw.net')) {
      return badge.imageUrl;
    }
    
    // Try fallback URL if we have one
    if (BADGE_FALLBACK_URLS[badge.id]) {
      return BADGE_FALLBACK_URLS[badge.id];
    }
    
    // Otherwise use the provided URL
    return badge.imageUrl;
  };

  return (
    <span className="inline-flex mr-1 gap-1">
      {badgeInfo.map((badge, index) => {
        const key = `${badge.id}-${badge.version}-${index}`;
        const hasFailed = failedImages[`${badge.id}-${badge.version}`];
        
        if (hasFailed) {
          return (
            <span key={key}>
              {getFallbackBadge(badge.id)}
            </span>
          );
        }
        
        return (
          <img
            key={key}
            src={getBadgeImageUrl(badge)}
            alt={badge.title || `${badge.id} badge`}
            title={badge.title || `${badge.id} badge`}
            className="h-[20px] w-auto inline-block"
            style={{
              verticalAlign: 'middle',
            }}
            onError={() => handleImageError(badge)}
          />
        );
      })}
    </span>
  );
};

export default BadgeDisplay; 