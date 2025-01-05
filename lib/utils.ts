import { clsx, type ClassValue } from "clsx"
import { NextRequest } from "next/server";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateRandomString(length: number): string {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  return Array.from(
    { length }, 
    () => possible.charAt(Math.floor(Math.random() * possible.length))
  ).join('');
}

export function getSpotifyTokens(request: NextRequest) {
  const accessToken = request.cookies.get('spotify_access_token')?.value;
  const refreshToken = request.cookies.get('spotify_refresh_token')?.value;
  const tokenExpiry = request.cookies.get('spotify_token_expiry')?.value;

  return {
    accessToken,
    refreshToken,
    tokenExpiry: tokenExpiry ? parseInt(tokenExpiry) : null,
  };
}

export function getTwitchTokens(request: NextRequest) {
  const accessToken = request.cookies.get('twitch_access_token')?.value;
  const refreshToken = request.cookies.get('twitch_refresh_token')?.value;
  const tokenExpiry = request.cookies.get('twitch_token_expiry')?.value;

  return {
    accessToken,
    refreshToken,
    tokenExpiry: tokenExpiry ? parseInt(tokenExpiry) : null,
  };
}