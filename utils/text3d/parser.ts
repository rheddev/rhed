export function text3dParser(tokens: Token[]): RootNode {
  let currentTokenIndex = 0;
  let currentColor = 'WHITE';  // Default color
  let currentStyle: StyleType = 'REGULAR';  // Default style
  const styleStack: StyleType[] = [];  // Stack to handle nested styles

  function peek(): Token {
    return tokens[currentTokenIndex];
  }

  function consume(): Token {
    return tokens[currentTokenIndex++];
  }

  function parseText(): TextNode {
    const token = consume();
    return {
      type: 'text',
      value: token.value,
      color: currentColor,
      style: currentStyle
    };
  }

  function parseEmote(): EmoteNode {
    const token = consume();
    return {
      type: 'emote',
      emoteId: token.emoteId!,
      color: currentColor,
      style: currentStyle
    };
  }

  function handleStyle(token: Token) {
    if (!token.style) return;

    // If we encounter the same style that's currently active, it's a closing tag
    if (currentStyle === token.style) {
      currentStyle = styleStack.pop() || 'REGULAR';  // Restore previous style or default to REGULAR
    } else {
      // Push current style to stack and set new style
      styleStack.push(currentStyle);
      currentStyle = token.style;
    }
  }

  function parse(): RootNode {
    const rootNode: RootNode = {
      type: 'root',
      children: []
    };

    while (currentTokenIndex < tokens.length) {
      const currentToken = peek();

      switch (currentToken.type) {
        case 'TEXT':
          rootNode.children.push(parseText());
          break;
          
        case 'COLOR':
          const colorToken = consume();
          currentColor = colorToken.color || 'WHITE';
          break;
          
        case 'STYLE':
          const styleToken = consume();
          handleStyle(styleToken);
          break;
          
        case 'EMOTE':
          rootNode.children.push(parseEmote());
          break;
          
        case 'EOF':
          consume();
          return rootNode;
      }
    }

    return rootNode;
  }

  return parse();
}