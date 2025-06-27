import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useRadioStore = create<RadioStore>()(
  persist(
    (set, get) => ({
      // Current radio and playback state
      current: null,
      playbackState: 'idle',
      volume: 0.7,
      isMuted: false,
      error: null,

      // Favorites
      favorites: [],

      // Search and filters
      searchQuery: '',
      selectedProvince: null,
      showFavoritesOnly: false,

      // Playback actions
      setCurrent: (radio) => {
        set({
          current: radio,
          playbackState: 'loading',
          error: null
        });
      },

      setPlaybackState: (state) => {
        set({ playbackState: state });
      },

      setVolume: (volume) => {
        set({ volume: Math.max(0, Math.min(1, volume)) });
      },

      toggleMute: () => {
        set((state) => ({ isMuted: !state.isMuted }));
      },

      setError: (error) => {
        set({ error, playbackState: 'error' });
      },

      clearError: () => {
        set({ error: null });
      },

      // Favorites actions
      addToFavorites: (radioId) => {
        set((state) => ({
          favorites: state.favorites.includes(radioId)
            ? state.favorites
            : [...state.favorites, radioId]
        }));
      },

      removeFromFavorites: (radioId) => {
        set((state) => ({
          favorites: state.favorites.filter(id => id !== radioId)
        }));
      },

      toggleFavorite: (radioId) => {
        const { favorites } = get();
        if (favorites.includes(radioId)) {
          get().removeFromFavorites(radioId);
        } else {
          get().addToFavorites(radioId);
        }
      },

      isFavorite: (radioId) => {
        return get().favorites.includes(radioId);
      },

      // Search and filter actions
      setSearchQuery: (query) => {
        set({ searchQuery: query });
      },

      setSelectedProvince: (province) => {
        set({ selectedProvince: province });
      },

      toggleShowFavoritesOnly: () => {
        set((state) => ({ showFavoritesOnly: !state.showFavoritesOnly }));
      },

      clearFilters: () => {
        set({
          searchQuery: '',
          selectedProvince: null,
          showFavoritesOnly: false
        });
      },
    }),
    {
      name: "radio-app-store",
      partialize: (state) => ({
        current: state.current,
        favorites: state.favorites,
        volume: state.volume,
        isMuted: state.isMuted,
      }),
    }
  )
);

// Legacy export for backward compatibility
export const useCurrentRadio = () => {
  const store = useRadioStore();
  return {
    current: store.current,
    setCurrent: store.setCurrent,
  };
};
