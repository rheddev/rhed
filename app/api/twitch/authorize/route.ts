import { NextResponse } from "next/server";
import { randomBytes } from "crypto";

export async function GET() {
  try {
    // Generate a random state parameter for CSRF protection
    const state = randomBytes(32).toString("hex");

    // Get environment variables
    const clientId = process.env.NEXT_PUBLIC_TWITCH_CLIENT_ID;
    const redirectUri = process.env.TWITCH_REDIRECT_URI;

    // Ensure required environment variables are present
    if (!clientId || !redirectUri) {
      return NextResponse.json(
        { error: "Missing required environment variables" },
        { status: 500 }
      );
    }

    // Define the scopes your app needs (modify as needed)
    const scopes = [
      "chat:read",
      "moderator:read:followers",
      "channel:read:subscriptions",
    ].join(" ");

    // Construct the authorization URL
    const authUrl = new URL("https://id.twitch.tv/oauth2/authorize");
    authUrl.searchParams.append("client_id", clientId);
    authUrl.searchParams.append("redirect_uri", redirectUri);
    authUrl.searchParams.append("response_type", "code");
    authUrl.searchParams.append("scope", scopes);
    authUrl.searchParams.append("state", state);
    authUrl.searchParams.append("force_verify", "false");

    // Return the authorization URL
    // Next.js will automatically redirect to this URL
    return NextResponse.redirect(authUrl.toString());
  } catch (error) {
    console.error("Authorization error:", error);
    return NextResponse.json(
      { error: "Failed to initialize authorization" },
      { status: 500 }
    );
  }
}
