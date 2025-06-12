import {
  integer,
  pgTable,
  varchar,
  numeric,
  text,
  timestamp,
  bigint,
  check,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const ttsMessagesTable = pgTable("tts_messages", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  session_id: varchar({ length: 255 }).notNull(),
  name: varchar({ length: 255 }).notNull(),
  amount: numeric({ precision: 10, scale: 2 }).notNull(),
  message: text().notNull(),
  description: text().default("Seductive, sensual, and erotic lady"),
  created_at: timestamp({ withTimezone: true }).defaultNow().notNull(),
});

export const twitchDiscordLinksTable = pgTable(
  "twitch_discord_links",
  {
    twitch_user_id: text().primaryKey(),
    discord_user_id: bigint({ mode: "bigint" }).notNull().unique(),
  },
  (table) => [
    check("discord_user_id_check", sql`${table.discord_user_id} BETWEEN 0 AND 9223372036854775807`)
  ]
);
