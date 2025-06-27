import { useRef, useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Toaster } from "react-hot-toast";
import Image from "next/image";
import { Heart, Radio as RadioIcon, Play, Pause, SkipBack, SkipForward } from "lucide-react";
import { radios } from "@/data/radios";
import { useRadioStore } from "@/data/zustand";
import { getProvinceNames, debounce } from "@/lib/utils";
import SearchInput from "@/components/ui/SearchInput";
import Button from "@/components/ui/Button";
import { LoadingState } from "@/components/ui/LoadingSpinner";
import RadioCard from "@/components/RadioCard";
import Spinner from "@/components/Spinner";

export default function Index() {
  const {
    current,
    setCurrent,
    searchQuery,
    selectedProvince,
    showFavoritesOnly,
    favorites,
    setSearchQuery,
    setSelectedProvince,
    toggleShowFavoritesOnly,
    clearFilters,
  } = useRadioStore();

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate initial loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Audio player logic
  useEffect(() => {
    if (audioRef.current) {
      setIsPlaying(!audioRef.current.paused);
    }
  }, []);

  const handleNext = () => {
    setIsBuffering(true);
    const currentIndex = radios.findIndex((radio) => radio.id === current?.id);
    const nextIndex = (currentIndex + 1) % radios.length;
    setCurrent(radios[nextIndex]);
  };

  const handlePrev = () => {
    setIsBuffering(true);
    const currentIndex = radios.findIndex((radio) => radio.id === current?.id);
    const prevIndex = (currentIndex - 1 + radios.length) % radios.length;
    setCurrent(radios[prevIndex]);
  };

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Debounced search
  const debouncedSetSearch = useMemo(
    () => debounce((query: string) => setSearchQuery(query), 300),
    [setSearchQuery]
  );

  // Filter radios based on search and filters
  const filteredRadios = useMemo(() => {
    let filtered = radios;

    // Search filter
    if (searchQuery && searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(radio =>
        (radio.name && radio.name.toLowerCase().includes(query)) ||
        (radio.address && radio.address.toLowerCase().includes(query)) ||
        (radio.frequency && radio.frequency.toString().includes(query))
      );
    }

    // Province filter
    if (selectedProvince !== null) {
      filtered = filtered.filter(radio => radio.province === selectedProvince);
    }

    // Favorites filter
    if (showFavoritesOnly) {
      filtered = filtered.filter(radio => favorites.includes(radio.id));
    }

    return filtered;
  }, [searchQuery, selectedProvince, showFavoritesOnly, favorites]);

  const provinceNames = getProvinceNames();
  const activeFiltersCount = [selectedProvince !== null, showFavoritesOnly].filter(Boolean).length;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <LoadingState message="Loading radio stations..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Toaster position="top-right" toastOptions={{
        style: {
          background: '#1e293b',
          color: '#f1f5f9',
          border: '1px solid #334155'
        }
      }} />

      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-slate-800/90 backdrop-blur-lg border-b border-slate-700 sticky top-0 z-40"
      >
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="flex items-center space-x-3"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-sky-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                <RadioIcon className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-sky-400 to-orange-400 bg-clip-text text-transparent">
                  BiTunes v2
                </h1>
                <p className="text-sm text-slate-300">Nepali Radio Stations</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex-1 max-w-md mx-8"
            >
              <SearchInput
                value={searchQuery}
                onChange={debouncedSetSearch}
                placeholder="Search stations, frequency, or location..."
              />
            </motion.div>

            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex items-center space-x-2"
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleShowFavoritesOnly}
                className={`text-slate-300 hover:text-orange-400 ${showFavoritesOnly ? "text-orange-400" : ""}`}
              >
                <Heart className={`w-4 h-4 mr-2 ${showFavoritesOnly ? 'fill-current' : ''}`} />
                Favorites {favorites.length > 0 && `(${favorites.length})`}
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.header>

      {/* Filters */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="max-w-7xl mx-auto px-4 py-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-semibold text-white">
              Radio Stations
              <span className="ml-2 text-sm font-normal text-slate-400">
                ({filteredRadios.length} stations)
              </span>
            </h2>

            {activeFiltersCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-slate-400 hover:text-sky-400"
              >
                Clear filters ({activeFiltersCount})
              </Button>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <select
              value={selectedProvince || ''}
              onChange={(e) => setSelectedProvince(e.target.value ? Number(e.target.value) : null)}
              className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="">All Provinces</option>
              {Object.entries(provinceNames).map(([id, name]) => (
                <option key={id} value={id}>{name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Radio Stations Grid */}
        <div className="space-y-3 pb-32">
          <AnimatePresence mode="popLayout">
            {filteredRadios.length > 0 ? (
              filteredRadios.map((radio, index) => (
                <RadioCard
                  key={radio.id}
                  radio={radio}
                  index={index}
                />
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <RadioIcon className="w-16 h-16 text-slate-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">No stations found</h3>
                <p className="text-slate-400 mb-4">
                  {searchQuery ? `No stations match "${searchQuery}"` : 'No stations match your filters'}
                </p>
                <Button variant="ghost" onClick={clearFilters} className="text-slate-400 hover:text-sky-400">
                  Clear all filters
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Player Controls */}
      {current && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-slate-800/95 to-slate-900/95 backdrop-blur-lg border-t border-slate-700 z-50"
        >
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              {/* Current Radio Info */}
              <div className="flex items-center space-x-4 flex-1 min-w-0">
                <div className="relative w-14 h-14 flex-shrink-0">
                  <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-800 rounded-lg flex items-center justify-center overflow-hidden border border-slate-600">
                    <Image
                      src={`/logo/${current.id}.jpg`}
                      alt={current.name}
                      fill
                      className="object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                    <RadioIcon className="w-6 h-6 text-slate-400" />
                  </div>

                  {/* Status indicator */}
                  {isPlaying && (
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-sky-500 to-orange-500 rounded-full"
                    />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-white truncate">
                    {current.name}
                  </h3>
                  <p className="text-sm text-slate-400 truncate">
                    {current.frequency ? `${current.frequency} MHz` : "Online Radio"} • {current.address}
                  </p>
                </div>
              </div>

              {/* Player Controls */}
              <div className="flex items-center space-x-3 mx-8">
                <button
                  onClick={handlePrev}
                  className="w-10 h-10 bg-slate-700 hover:bg-slate-600 text-white rounded-full flex items-center justify-center transition-all duration-200 hover:scale-105"
                >
                  <SkipBack className="w-5 h-5" />
                </button>

                <button
                  onClick={togglePlayPause}
                  className="w-12 h-12 bg-gradient-to-r from-sky-500 to-orange-500 hover:from-sky-600 hover:to-orange-600 text-white rounded-full flex items-center justify-center transition-all duration-200 hover:scale-105 shadow-lg"
                >
                  {isBuffering ? (
                    <Spinner className="w-6 h-6 animate-spin" />
                  ) : isPlaying ? (
                    <Pause className="w-6 h-6" />
                  ) : (
                    <Play className="w-6 h-6 ml-0.5" />
                  )}
                </button>

                <button
                  onClick={handleNext}
                  className="w-10 h-10 bg-slate-700 hover:bg-slate-600 text-white rounded-full flex items-center justify-center transition-all duration-200 hover:scale-105"
                >
                  <SkipForward className="w-5 h-5" />
                </button>
              </div>

              {/* Volume placeholder */}
              <div className="flex-1 flex justify-end">
                <div className="text-xs text-slate-400">
                  {isPlaying ? 'Now Playing' : isBuffering ? 'Connecting...' : 'Paused'}
                </div>
              </div>
            </div>
          </div>

          <audio
            ref={audioRef}
            src={current.streamUrl}
            autoPlay
            hidden
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onPlaying={() => setIsBuffering(false)}
            onWaiting={() => setIsBuffering(true)}
            onLoadStart={() => setIsBuffering(true)}
          />
        </motion.div>
      )}
    </div>
  );
}
