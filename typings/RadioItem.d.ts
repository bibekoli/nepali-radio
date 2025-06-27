type RadioItem = {
  id: string;
  name: string;
  streamUrl: string;
  frequency: number | null;
  address: string;
  province?: number;
};

type PlaybackState = 'idle' | 'loading' | 'playing' | 'paused' | 'error';

type AudioError = {
  message: string;
  code?: string;
  timestamp: number;
};

type RadioStore = {
  // Current radio and playback
  current: RadioItem | null;
  playbackState: PlaybackState;
  volume: number;
  isMuted: boolean;
  error: AudioError | null;

  // Favorites
  favorites: string[];

  // Search and filters
  searchQuery: string;
  selectedProvince: number | null;
  showFavoritesOnly: boolean;

  // Actions
  setCurrent: (radio: RadioItem) => void;
  setPlaybackState: (state: PlaybackState) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  setError: (error: AudioError | null) => void;
  clearError: () => void;

  // Favorites actions
  addToFavorites: (radioId: string) => void;
  removeFromFavorites: (radioId: string) => void;
  toggleFavorite: (radioId: string) => void;
  isFavorite: (radioId: string) => boolean;

  // Search and filter actions
  setSearchQuery: (query: string) => void;
  setSelectedProvince: (province: number | null) => void;
  toggleShowFavoritesOnly: () => void;
  clearFilters: () => void;
};