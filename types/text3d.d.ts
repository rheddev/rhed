// types.d.ts

type TokenType = "TEXT" | "COLOR" | "STYLE" | "EMOTE" | "EOF";
type StyleType = "REGULAR" | "ITALIC" | "BOLD" | "BOLD_ITALIC";

interface Token {
  type: TokenType;
  value: string;
  position: number;
  color?: string;    // For COLOR tokens
  style?: StyleType; // For STYLE tokens
  emoteId?: string; // For EMOTE tokens
}

interface BaseNode {
  type: string;
}

interface TextNode extends BaseNode {
  type: "text";
  value: string;
  color: string;   // Current color for this text
  style: StyleType; // Current style for this text
}

interface EmoteNode extends BaseNode {
  type: "emote";
  emoteId: string;
  color: string;    // Maintain color context
  style: StyleType; // Maintain style context
}

interface RootNode extends BaseNode {
  type: "root";
  children: BaseNode[];
}

type ASTNode = RootNode | TextNode | EmoteNode;