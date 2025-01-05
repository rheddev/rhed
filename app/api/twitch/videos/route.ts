import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    let accessToken = request.cookies.get("twitch_app_access_token")?.value;
    let tokenExpiry = request.cookies.get("twitch_app_token_expiry")?.value;

    // Get new token if needed
    if (!(accessToken && tokenExpiry && parseInt(tokenExpiry) > Date.now())) {
      const tokenResponse = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/twitch/token`,
        { method: "POST" }
      );

      const { access_token, expires_in } = await tokenResponse.json();
      if (!access_token) {
        return NextResponse.json(
          { error: "Failed to get access token" },
          { status: 401 }
        );
      }

      accessToken = access_token;
      tokenExpiry = expires_in;
    }

    const headers = {
      Authorization: `Bearer ${accessToken}`,
      "Client-Id": process.env.NEXT_PUBLIC_TWITCH_CLIENT_ID!,
    };

    // Get user ID
    const userUrl = new URL("https://api.twitch.tv/helix/users");
    userUrl.searchParams.append("login", "rheddev");
    const userResponse = await fetch(userUrl, { headers });
    const userData = await userResponse.json();

    if (!userData.data?.[0]?.id) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get videos
    const videosUrl = new URL("https://api.twitch.tv/helix/videos");
    videosUrl.searchParams.append("user_id", userData.data[0].id);
    videosUrl.searchParams.append("first", "3");

    const videosResponse = await fetch(videosUrl, { headers });
    const videosData = await videosResponse.json();

    return NextResponse.json<TwitchVideo[]>(videosData.data);
  } catch (error) {
    console.error("Error fetching videos:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
