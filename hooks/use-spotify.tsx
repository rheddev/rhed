import { useState, useEffect, useCallback } from 'react';

interface SpotifyImage {
  url: string;
  height: number;
  width: number;
}

interface SpotifyArtist {
  external_urls: { spotify: string };
  name: string;
  id: string;
}

interface SpotifyAlbum {
  images: SpotifyImage[];
  name: string;
  id: string;
  artists: SpotifyArtist[];
}

interface SpotifyTrack {
  album: SpotifyAlbum;
  artists: SpotifyArtist[];
  name: string;
  id: string;
  duration_ms: number;
  preview_url: string | null;
}

interface CurrentlyPlayingData {
  is_playing: boolean;
  progress_ms: number;
  item: SpotifyTrack | null;
}

interface UseSpotifyReturn {
  currentlyPlaying: CurrentlyPlayingData | null;
  error: string | null;
  isAuthenticated: boolean;
  login: () => void;
  refreshCurrentlyPlaying: () => Promise<void>;
}

export function useSpotify(): UseSpotifyReturn {
  const [currentlyPlaying, setCurrentlyPlaying] = useState<CurrentlyPlayingData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('/api/spotify/token');
      const data = await response.json();
      const isAuthed = !data.error && !!data.access_token;
      setIsAuthenticated(isAuthed);
      return isAuthed;
    } catch {
      setIsAuthenticated(false);
      return false;
    }
  };

  const login = () => {
    window.location.href = '/api/spotify/authorize';
  };

  const refreshCurrentlyPlaying = useCallback(async () => {
    try {
      setError(null);

      const isAuthed = await checkAuthStatus();
      if (!isAuthed) {
        throw new Error('Not authenticated');
      }

      const response = await fetch('/api/spotify/currently-playing');
      
      if (response.status === 204) {
        setCurrentlyPlaying({ is_playing: false, progress_ms: 0, item: null });
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch currently playing track');
      }

      const data = await response.json();
      setCurrentlyPlaying(data);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      
      if (errorMessage === 'Not authenticated') {
        setIsAuthenticated(false);
      }
    }
  }, []);

  useEffect(() => {
    // Check URL for error parameters (from OAuth callback)
    const urlParams = new URLSearchParams(window.location.search);
    const err = urlParams.get('error');
    if (err) {
      setError(err);
      // Clean up URL
      window.history.replaceState({}, '', window.location.pathname);
    }

    // Initial auth check and data fetch
    checkAuthStatus().then(isAuthed => {
      if (isAuthed) {
        refreshCurrentlyPlaying();
      }
    });
  }, [refreshCurrentlyPlaying]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    const SECONDS = 2;
    if (isAuthenticated) {
      interval = setInterval(refreshCurrentlyPlaying, SECONDS * 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isAuthenticated, refreshCurrentlyPlaying]);

  return {
    currentlyPlaying,
    error,
    isAuthenticated,
    login,
    refreshCurrentlyPlaying,
  };
}