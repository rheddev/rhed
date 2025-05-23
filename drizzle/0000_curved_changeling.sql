CREATE TABLE "tts_messages" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "tts_messages_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(255) NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"message" text NOT NULL,
	"with time zone" timestamp DEFAULT now() NOT NULL
);
