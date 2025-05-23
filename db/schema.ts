import { integer, pgTable, varchar, numeric, text, timestamp } from "drizzle-orm/pg-core";

export const ttsMessagesTable = pgTable("tts_messages", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  session_id: varchar({ length: 255 }).notNull(),
  name: varchar({ length: 255 }).notNull(),
  amount: numeric({ precision: 10, scale: 2 }).notNull(),
  message: text().notNull(),
  description: text().default("Seductive, sensual, and erotic lady"),
  created_at: timestamp({withTimezone: true}).defaultNow().notNull(),
});
