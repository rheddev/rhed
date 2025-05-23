import { NextResponse } from "next/server";


// TTS Server URL
const TTS_SERVER_URL = process.env.SERVER_URL || "http://localhost:8080";
// AUTH_TOKEN =base64(ADMIN_USERNAME:ADMIN_PASSWORD)
// const AUTH_TOKEN = Buffer.from(`${process.env.ADMIN_USERNAME}:${process.env.ADMIN_PASSWORD}`).toString('base64');

export async function POST(request: Request) {
  try {
    const { session_id, name, amount, message } = await request.json();

    if (!name || !amount || !message || !session_id) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Send to TTS Server WebSocket endpoint
    try {
      const response = await fetch(`${TTS_SERVER_URL}/ws/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // "Authorization": `Bearer ${AUTH_TOKEN}`
        },
        body: JSON.stringify({
          session_id,
          name,
          amount,
          message,
          description: "Seductive, sensual, and erotic lady",
        }),
      });

      if (!response.ok) {

        // Session already exists
        if (response.status === 409) {
          return NextResponse.json(
            { error: "Session already exists" },
            { status: 409 }
          );
        }

        throw new Error(
          `Failed to send message to TTS server: ${response.statusText}`
        );
      }
    } catch (wsError) {
      console.error("Error sending message to TTS server:", wsError);
      return NextResponse.json(
        { error: "Failed to send message to TTS server" },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: "Message sent to TTS server" });
  } catch (error) {
    console.error("Error processing TTS message:", error);
    return NextResponse.json(
      { error: "Failed to process TTS message" },
      { status: 500 }
    );
  }
}
