// lexer.ts

import { ANSI_COLOR_VALUES } from "./ansi";

export function text3dLexer(text: string): Token[] {
  const tokens: Token[] = [];
  let current = 0;

  while (current < text.length) {
    // Look for ANSI escape sequence
    if (text.slice(current).startsWith('\x1b[')) {
      const end = text.indexOf('m', current);
      if (end !== -1) {
        const sequence = text.slice(current, end + 1);
        
        if (sequence in ANSI_COLOR_VALUES) {
          tokens.push({
            type: 'COLOR',
            value: sequence,
            position: current,
            color: ANSI_COLOR_VALUES[sequence]
          });
          current = end + 1;
          continue;
        }
      }
    }

    // Look for Twitch emotes (:id:)
    if (text[current] === ':') {
      const potentialEmoteStart = current + 1;
      const nextColon = text.indexOf(':', potentialEmoteStart);
      
      if (nextColon !== -1) {
        const potentialId = text.slice(potentialEmoteStart, nextColon);
        // Check if the content between colons is a valid emote ID (numbers only)
        if (/^\d+$/.test(potentialId)) {
          tokens.push({
            type: 'EMOTE',
            value: `:${potentialId}:`,
            position: current,
            emoteId: potentialId,
            style: 'REGULAR'  // Maintain style consistency
          });
          current = nextColon + 1;
          continue;
        }
      }
    }

    // Handle style markers
    if (text[current] === '*') {
      let count = 1;
      while (text[current + count] === '*' && count < 3) {
        count++;
      }

      if (count > 0) {
        let style: StyleType;
        switch (count) {
          case 1:
            style = 'ITALIC';
            break;
          case 2:
            style = 'BOLD';
            break;
          case 3:
            style = 'BOLD_ITALIC';
            break;
          default:
            style = 'REGULAR';
        }

        tokens.push({
          type: 'STYLE',
          value: '*'.repeat(count),
          position: current,
          style
        });
        
        current += count;
        continue;
      }
    }

    // Handle regular text
    let value = '';
    while (
      current < text.length &&
      !text.slice(current).startsWith('\x1b[') &&
      text[current] !== '*' &&
      text[current] !== ':'
    ) {
      value += text[current];
      current++;
    }

    if (value) {
      tokens.push({
        type: 'TEXT',
        value,
        position: current - value.length,
        style: 'REGULAR'
      });
    }
  }

  tokens.push({
    type: 'EOF',
    value: '',
    position: text.length,
    style: 'REGULAR'
  });

  return tokens;
}