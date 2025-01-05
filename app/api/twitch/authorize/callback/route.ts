import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    // const state = searchParams.get('state');
    const error = searchParams.get('error');
    const errorDescription = searchParams.get('error_description');

    if (error) {
      return NextResponse.json({
        error,
        error_description: errorDescription
      }, { status: 400 });
    }

    if (!code) {
      return NextResponse.json({
        error: 'Missing authorization code'
      }, { status: 400 });
    }

    const clientId = process.env.TWITCH_CLIENT_ID;
    const clientSecret = process.env.TWITCH_CLIENT_SECRET;
    const redirectUri = process.env.TWITCH_REDIRECT_URI;

    if (!clientId || !clientSecret || !redirectUri) {
      return NextResponse.json({
        error: 'Missing required environment variables'
      }, { status: 500 });
    }

    const response = await fetch('https://id.twitch.tv/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        code: code,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json({
        error: 'Failed to exchange code for tokens',
        details: errorData
      }, { status: response.status });
    }

    const tokens = await response.json();

    // Calculate token expiry timestamp
    const expiryTimestamp = Date.now() + (tokens.expires_in * 1000);

    // Create response with redirect
    const redirectUrl = new URL('/', request.url);
    const nextResponse = NextResponse.redirect(redirectUrl);

    // Set cookies
    nextResponse.cookies.set('twitch_access_token', tokens.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: tokens.expires_in
    });

    nextResponse.cookies.set('twitch_refresh_token', tokens.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      // Set a long expiry for refresh token (e.g., 30 days)
      maxAge: 30 * 24 * 60 * 60
    });

    nextResponse.cookies.set('twitch_token_expiry', expiryTimestamp.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: tokens.expires_in
    });

    return nextResponse;

  } catch (error) {
    console.error('Token exchange error:', error);
    return NextResponse.json({
      error: 'Failed to process authorization callback'
    }, { status: 500 });
  }
}