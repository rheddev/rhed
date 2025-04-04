import React, { JSX } from 'react';

interface EmoteMessageProps {
  message: TwitchChatMessage;
}

const EmoteMessage: React.FC<EmoteMessageProps> = ({ message }) => {
  // Process mentions in text
  const processMentions = (text: string): (string | JSX.Element)[] => {
    const mentionRegex = /@(\w+)/g;
    const parts = [];
    let lastIndex = 0;
    let match;
    
    while ((match = mentionRegex.exec(text)) !== null) {
      // Add text before the mention
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }
      
      // Add the styled mention
      parts.push(
        <span key={`mention-${match.index}`} className="mention">
          {match[0]}
        </span>
      );
      
      lastIndex = match.index + match[0].length;
    }
    
    // Add any remaining text
    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }
    
    return parts;
  };

  // No emotes, just process mentions and return
  if (!message.emotes || message.emotes.length === 0) {
    const mentionedText = processMentions(message.msg);
    return <span className="text-white">{mentionedText}</span>;
  }

  // Process message to replace emotes with images
  const messageParts: JSX.Element[] = [];
  const { msg, emotes } = message;
  
  // Sort emote positions to process in order
  const positions: { start: number; end: number; id: string }[] = [];
  emotes.forEach(emote => {
    emote.positions.forEach(pos => {
      positions.push({
        start: pos.start,
        end: pos.end,
        id: emote.id,
      });
    });
  });
  positions.sort((a, b) => a.start - b.start);
  
  let lastIndex = 0;
  positions.forEach((pos, i) => {
    // Add text before the emote (with mentions processed)
    if (pos.start > lastIndex) {
      const textBeforeEmote = msg.substring(lastIndex, pos.start);
      const mentionedTextParts = processMentions(textBeforeEmote);
      
      mentionedTextParts.forEach((part, j) => {
        if (typeof part === 'string') {
          messageParts.push(<span key={`text-${i}-${j}`}>{part}</span>);
        } else {
          messageParts.push(React.cloneElement(part, { key: `text-${i}-${j}` }));
        }
      });
    }
    
    // Add the emote image
    messageParts.push(
      <img
        key={`emote-${i}`}
        src={`https://static-cdn.jtvnw.net/emoticons/v2/${pos.id}/default/dark/3.0`}
        alt={msg.substring(pos.start, pos.end + 1)}
        className="hover:scale-110"
        style={{ 
          height: '1.5em', 
          verticalAlign: 'middle',
          display: 'inline',
          margin: '0 2px',
          transition: 'transform 0.2s ease',
        }}
      />
    );
    
    lastIndex = pos.end + 1;
  });
  
  // Add any remaining text (with mentions processed)
  if (lastIndex < msg.length) {
    const textAfterEmotes = msg.substring(lastIndex);
    const mentionedTextParts = processMentions(textAfterEmotes);
    
    mentionedTextParts.forEach((part, j) => {
      if (typeof part === 'string') {
        messageParts.push(<span key={`text-last-${j}`}>{part}</span>);
      } else {
        messageParts.push(React.cloneElement(part, { key: `text-last-${j}` }));
      }
    });
  }
  
  return <span className="text-white">{messageParts}</span>;
};

export default EmoteMessage;