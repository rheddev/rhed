export const ANSI_COLORS = {
  WHITE: "\x1b[0m",
  RED: "\x1b[31m",
  GREEN: "\x1b[32m",
  YELLOW: "\x1b[33m",
  BLUE: "\x1b[34m",
  MAGENTA: "\x1b[35m",
  CYAN: "\x1b[36m",
};

export const ANSI_EMPHASIS = {
  BOLD: "\x1b3m",
  ITALIC: "\x1b[3m",
}

export const ANSI_COLOR_VALUES = Object.entries(ANSI_COLORS).reduce(
  (acc, [key, value]) => ({ ...acc, [value]: key }),
  {} as Record<string, string>
);

export const ANSI_EMPHASIS_VALUES = Object.entries(ANSI_EMPHASIS).reduce(
  (acc, [key, value]) => ({ ...acc, [value]: key }),
  {} as Record<string, string>
);
