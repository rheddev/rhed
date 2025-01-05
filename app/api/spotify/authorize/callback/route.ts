import { NextRequest, NextResponse } from 'next/server';

interface TokenResponse {
  access_token: string;
  token_type: string;
  scope: string;
  expires_in: number;
  refresh_token: string;
}

export async function GET(request: NextRequest) {
  try {
    // Get code and state from URL params
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    
    // Get stored state from cookie
    const storedState = request.cookies.get('spotify_auth_state')?.value;

    if (!state || state !== storedState) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_BASE_URL}/now-playing?error=state_mismatch`
      );
    }

    if (!code) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_BASE_URL}/now-playing?error=no_code`
      );
    }

    // Exchange code for token
    const clientId = process.env.SPOTIFY_CLIENT_ID!;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET!;
    const redirectUri = process.env.SPOTIFY_REDIRECT_URI!;
    
    const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${basicAuth}`
      },
      body: new URLSearchParams({
        code,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code'
      })
    });

    if (!response.ok) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_BASE_URL}/now-playing?error=token_error`
      );
    }

    const tokenData: TokenResponse = await response.json();

    // Create response that redirects back to the app
    const apiResponse = NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL}/now-playing`
    );

    // Store tokens in cookies
    apiResponse.cookies.set('spotify_access_token', tokenData.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: tokenData.expires_in
    });

    apiResponse.cookies.set('spotify_refresh_token', tokenData.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 365 * 24 * 60 * 60 // 1 year
    });

    apiResponse.cookies.set('spotify_token_expiry', 
      (Date.now() + tokenData.expires_in * 1000).toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: tokenData.expires_in
    });

    return apiResponse;

  } catch (error) {
    console.error('Callback error:', error);
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL}?error=server_error`
    );
  }
}