import { integer, pgTable, varchar, numeric, text, timestamp } from "drizzle-orm/pg-core";

export const ttsMessagesTable = pgTable("tts_messages", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  amount: numeric({ precision: 10, scale: 2 }).notNull(),
  message: text().notNull(),
  created_at: timestamp('with time zone').defaultNow().notNull(),
});
