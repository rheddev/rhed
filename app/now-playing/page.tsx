/* eslint-disable @next/next/no-img-element */
// app/page.tsx
"use client";

import { useSpotify } from "@/hooks/use-spotify";

const SpotifyLogo = () => {
  return (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
    </svg>
  );
};

export default function Home() {
  const { currentlyPlaying, error, isAuthenticated, login } = useSpotify();

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-white mb-4">Spotify Player</h1>
          <p className="text-gray-400 text-lg">
            View your currently playing track
          </p>
        </div>
        <button
          onClick={login}
          className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-full font-semibold 
              hover:bg-green-400 transform hover:scale-105 transition-all duration-300 shadow-lg"
        >
          <SpotifyLogo />
          Connect to Spotify
        </button>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6 max-w-md w-full">
          <div className="flex items-center gap-3 mb-4">
            <svg
              className="w-6 h-6 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h2 className="text-xl font-semibold text-red-500">
              Error Occurred
            </h2>
          </div>
          <p className="text-gray-400">{error}</p>
          <button
            onClick={login}
            className="mt-6 w-full px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-400 
                transition-colors duration-300 font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!currentlyPlaying?.item) {
    return null;
  }

  const { item } = currentlyPlaying;

  return (
    <div className="flex items-center justify-center min-h-screen">
      {/* Main container with blurred background */}
      <div className="relative overflow-hidden rounded-lg">
        {/* Blurred background image */}
        <div className="relative inset-0">
          <img
            src={item.album.images[0].url}
            alt="Background blur"
            className="object-cover object-center blur-md brightness-50 w-[600px] h-[200px] transition-all duration-700 ease-in-out"
          />
        </div>

        {/* Content container */}
        <div className="absolute inset-0 flex items-center p-6 z-10">
          {/* Album cover */}
          <div className="flex-shrink-0">
            <img
              src={item.album.images[0].url}
              alt="Album cover"
              width={150}
              height={150}
              className="rounded-md shadow-lg transition-all duration-700 ease-in-out transform hover:scale-105"
            />
          </div>

          {/* Song information */}
          <div className="ml-6 text-white transition-opacity duration-500 ease-in-out space-y-1">
            <h2 key={item.name} className="text-2xl font-bold animate-fade-in">
              {item.name}
            </h2>
            <p
              key={item.artists.map((artist) => artist.name).join()}
              className="text-gray-300 text-lg animate-fade-in"
            >
              {item.artists.map((artist) => artist.name).join(", ")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
