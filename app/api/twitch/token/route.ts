import { NextRequest, NextResponse } from 'next/server';

interface TwitchTokenResponse {
  access_token: string;
  token_type: string;
  scope: string[];
  expires_in: number;
  refresh_token?: string;
}

export async function GET(request: NextRequest) {
  try {
    // Get existing tokens
    const accessToken = request.cookies.get('twitch_access_token')?.value;
    const refreshToken = request.cookies.get('twitch_refresh_token')?.value;
    const tokenExpiry = request.cookies.get('twitch_token_expiry')?.value;

    // If we have a valid access token, return it
    if (accessToken && tokenExpiry && parseInt(tokenExpiry) > Date.now()) {
      return NextResponse.json({ access_token: accessToken });
    }

    // If no refresh token, user needs to authorize
    if (!refreshToken) {
      return NextResponse.json(
        { error: 'No refresh token found' },
        { status: 401 }
      );
    }

    // Get new access token using refresh token
    const clientId = process.env.NEXT_PUBLIC_TWITCH_CLIENT_ID!;
    const clientSecret = process.env.TWITCH_CLIENT_SECRET!;

    const response = await fetch('https://id.twitch.tv/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      })
    });

    if (!response.ok) {
      // If refresh fails, user needs to reauthorize
      return NextResponse.json(
        { error: 'Failed to refresh token' },
        { status: 401 }
      );
    }

    const tokenData: TwitchTokenResponse = await response.json();

    // Create response
    const apiResponse = NextResponse.json({ 
      access_token: tokenData.access_token 
    });

    // Update cookies
    apiResponse.cookies.set('twitch_access_token', tokenData.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: tokenData.expires_in
    });

    apiResponse.cookies.set('twitch_token_expiry', 
      (Date.now() + tokenData.expires_in * 1000).toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: tokenData.expires_in
    });

    // Update refresh token if a new one was provided
    if (tokenData.refresh_token) {
      apiResponse.cookies.set('twitch_refresh_token', tokenData.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 30 * 24 * 60 * 60 // 30 days
      });
    }

    return apiResponse;

  } catch (error) {
    console.error('Token error:', error);
    return NextResponse.json(
      { error: 'Failed to process token request' },
      { status: 500 }
    );
  }
}