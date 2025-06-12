// app/page.tsx
"use client";
import React, { useEffect } from "react";
import { useSpotify } from "@/hooks/use-spotify";

const SpotifyLogo = () => {
  return (
    <svg
      className="w-12 h-12 m-4 filter drop-shadow-glow-green"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
    </svg>
  );
};

export default function Home() {
  const {
    currentlyPlaying,
    error,
    isAuthenticated,
    login,
    refreshCurrentlyPlaying,
  } = useSpotify();

  // Auto-refresh handling
  useEffect(() => {
    if (currentlyPlaying?.item && !currentlyPlaying.is_playing) {
      const checkTimer = setTimeout(() => {
        refreshCurrentlyPlaying();
      }, 10000);

      return () => clearTimeout(checkTimer);
    }
  }, [currentlyPlaying, refreshCurrentlyPlaying]);

  // Login view - updated to match chat page style
  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen space-y-4 cyber-glass p-8">
        <h1 className="text-4xl font-bold text-red-500">Spotify Widget</h1>
        <p className="text-red-300 text-lg">
          Connect to display your currently playing track
        </p>
        <button
          onClick={login}
          className="flex items-center gap-2 px-6 py-3 bg-green-500/80 text-white rounded-md font-semibold 
              hover:bg-green-400 transform hover:scale-105 transition-all duration-300"
        >
          <SpotifyLogo />
          <span>CONNECT</span>
        </button>
      </div>
    );
  }

  // Error view - updated to match chat page style exactly
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="cyber-glass border border-red-500/30 rounded-lg p-6 max-w-md w-full shadow-neon-red">
          <div className="flex items-center gap-3 mb-4">
            <svg
              className="w-6 h-6 text-red-500 animate-pulse"
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
            <h2 className="text-xl font-semibold text-red-500">SYSTEM ERROR</h2>
          </div>
          <p className="text-gray-400 font-mono">{error}</p>
          <button
            onClick={login}
            className="mt-6 w-full px-4 py-2 bg-red-500/80 text-white rounded-md hover:bg-red-400 
                transition-colors duration-300 font-medium cyber-button shadow-neon-red"
          >
            RECONNECT
          </button>
        </div>
      </div>
    );
  }

  if (currentlyPlaying?.item) {
    const { item, is_playing } = currentlyPlaying;
    const songTitle = item.name;
    const artistName = item.artists.map((artist) => artist.name).join(", ");

    // Main widget display - optimized for stream overlay
    return (
      <div className="w-screen h-screen widget">
        <div className="w-full h-full">
          <div className="absolute inset-0 pointer-events-none rounded-lg opacity-20"></div>

          <div className="flex h-full items-center relative z-10">
            {/* Album art with play/pause indicator - square that fills height */}
            <div className="relative aspect-square h-full">
              <img
                src={item.album.images[0].url}
                alt="Album cover"
                className="h-full aspect-square object-cover shadow-inner transition-all duration-500"
                style={{
                  filter: !is_playing ? "brightness(0.8)" : "brightness(1)",
                }}
              />
            </div>

            {/* Track info */}
            <div className="text-white flex-1 flex flex-col py-4 h-full">
              <div className="flex items-center gap-2 w-full h-full">
                {/* <SpotifyLogo /> */}
                <div className="flex-1 w-full flex flex-col justify-center">
                  <div className="w-full">
                    <div className="overflow-hidden whitespace-nowrap">
                      <div className="w-full">
                        <p
                          className="font-ethnocentric font-bold inline-block text-glow chat-text animate-marquee-title"
                          style={{
                            fontSize: "300%",
                            textShadow: "0 0 10px white",
                          }}
                        >
                          {songTitle}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="w-full">
                    <div className="overflow-hidden whitespace-nowrap">
                      <div className="w-full">
                        <p
                          className="font-king-rimba text-gray-300 inline-block animate-marquee-artist"
                          style={{
                            fontSize: "150%",
                            textShadow: "0 0 10px #d1d5db",
                          }}
                        >
                          {artistName}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress bar */}
              {/* {currentlyPlaying.progress_ms > 0 && (
              <div className="w-full mt-1.5">
                <div className="relative w-full">
                  <div className="overflow-hidden h-[2vh] text-xs flex rounded bg-red-900/30">
                    <div
                      style={{
                        width: `${(currentlyPlaying.progress_ms / item.duration_ms) * 100}%`,
                        transition: 'width 2s linear'
                      }}
                      className={`shadow-none flex flex-col text-center whitespace-nowrap justify-center bg-red-500 
                  ${is_playing ? 'progress-glow' : ''}`}
                    ></div>
                  </div>
                </div>
              </div>
            )} */}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
