import { getTwitchTokens } from '@/lib/utils';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Get tokens from cookies
    const { accessToken, tokenExpiry } = getTwitchTokens(request);

    // If no access token or token is expired, user is not authenticated
    if (!accessToken || (tokenExpiry && tokenExpiry < Date.now())) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    // Get user data from Twitch API
    const response = await fetch('https://api.twitch.tv/helix/users', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Client-Id': process.env.NEXT_PUBLIC_TWITCH_CLIENT_ID!
      }
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch user data' },
        { status: response.status }
      );
    }

    const data = await response.json();
    const user = data.data[0];

    return NextResponse.json({
      authenticated: true,
      user: {
        id: user.id,
        login: user.login,
        displayName: user.display_name,
        profileImageUrl: user.profile_image_url,
      }
    });

  } catch (error) {
    console.error('Error fetching current user:', error);
    return NextResponse.json(
      { error: 'Failed to fetch current user' },
      { status: 500 }
    );
  }
}