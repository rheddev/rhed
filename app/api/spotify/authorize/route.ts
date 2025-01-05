import { NextResponse } from 'next/server';
import { generateRandomString } from '@/lib/utils';

// These should be in your .env.local file
const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID!;
const REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI!;

// Define the required scopes
const SCOPES: string[] = [
    'user-read-currently-playing'
];

export async function GET() {
  try {
    // Generate a random state string for security
    const state = generateRandomString(16);
    
    // Create the authorization URL with query parameters
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: CLIENT_ID,
      scope: SCOPES.join(' '),
      redirect_uri: REDIRECT_URI,
      state: state,
    });

    // Store the state in a cookie or session for validation later
    const response = NextResponse.redirect(
      `https://accounts.spotify.com/authorize?${params.toString()}`
    );
    
    // Set a cookie to store the state
    response.cookies.set('spotify_auth_state', state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 3600, // 1 hour
    });

    return response;

  } catch (error) {
    console.error('Spotify authorization error:', error);
    return NextResponse.json(
      { error: 'Failed to initialize Spotify authorization' },
      { status: 500 }
    );
  }
}