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
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50">
        <LoadingState message="Loading radio stations..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50">
      <Toaster position="top-right" toastOptions={{
        style: {
          background: '#ffffff',
          color: '#1f2937',
          border: '1px solid #fecaca',
          boxShadow: '0 4px 12px rgba(220, 38, 38, 0.1)'
        }
      }} />

      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white/80 backdrop-blur-xl border-b border-red-100 sticky top-0 z-40 shadow-lg"
      >
        <div className="max-w-7xl mx-auto px-4 py-5">
          <div className="flex items-center justify-between">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="flex items-center space-x-4"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-red-lg">
                <RadioIcon className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold gradient-text">
                  BiTunes
                </h1>
                <p className="text-sm text-gray-600 font-medium">Listen Nepali Radio</p>
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
                className={`text-gray-600 hover:text-red-600 transition-colors ${showFavoritesOnly ? "text-red-600 bg-red-50" : ""}`}
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
        className="max-w-7xl mx-auto px-4 py-8"
      >
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <h2 className="text-2xl font-bold text-gray-900">
              Radio Stations
              <span className="ml-3 text-sm font-normal text-gray-500 bg-red-50 px-3 py-1 rounded-full">
                {filteredRadios.length} stations
              </span>
            </h2>

            {activeFiltersCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-gray-500 hover:text-red-600 hover:bg-red-50"
              >
                Clear filters ({activeFiltersCount})
              </Button>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <select
              value={selectedProvince || ''}
              onChange={(e) => setSelectedProvince(e.target.value ? Number(e.target.value) : null)}
              className="px-4 py-2.5 bg-white border-2 border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all hover:border-red-300 shadow-sm"
            >
              <option value="">All Provinces</option>
              {Object.entries(provinceNames).map(([id, name]) => (
                <option key={id} value={id}>{name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Radio Stations Grid */}
        <div className="space-y-4 pb-32">
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
                className="text-center py-20"
              >
                <div className="bg-white rounded-3xl p-12 shadow-lg max-w-md mx-auto border border-red-100">
                  <RadioIcon className="w-20 h-20 text-red-300 mx-auto mb-6" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">No stations found</h3>
                  <p className="text-gray-600 mb-6">
                    {searchQuery ? `No stations match "${searchQuery}"` : 'No stations match your filters'}
                  </p>
                  <Button 
                    variant="ghost" 
                    onClick={clearFilters} 
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    Clear all filters
                  </Button>
                </div>
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
          className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-red-100 z-50 shadow-2xl"
        >
          <div className="max-w-7xl mx-auto px-4 py-5">
            <div className="flex items-center justify-between">
              {/* Current Radio Info */}
              <div className="flex items-center space-x-4 flex-1 min-w-0">
                <div className="relative w-16 h-16 flex-shrink-0">
                  <div className="w-full h-full bg-gradient-to-br from-red-100 to-red-200 rounded-2xl flex items-center justify-center overflow-hidden border-2 border-red-200 shadow-lg">
                    <Image
                      src={`/logo/${current.id}.jpg`}
                      alt={current.name}
                      fill
                      className="object-cover rounded-2xl"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                    <RadioIcon className="w-8 h-8 text-red-400" />
                  </div>

                  {/* Status indicator */}
                  {isPlaying && (
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-red-500 to-red-600 rounded-full shadow-red-lg"
                    />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-gray-900 truncate text-lg">
                    {current.name}
                  </h3>
                  <p className="text-sm text-gray-600 truncate font-medium">
                    {current.frequency ? `${current.frequency} MHz` : "Online Radio"} • {current.address}
                  </p>
                </div>
              </div>

              {/* Player Controls */}
              <div className="flex items-center space-x-4 mx-8">
                <button
                  onClick={handlePrev}
                  className="w-11 h-11 bg-white hover:bg-red-50 text-red-600 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-md border border-red-100"
                >
                  <SkipBack className="w-5 h-5" />
                </button>

                <button
                  onClick={togglePlayPause}
                  className="w-14 h-14 bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-red-xl"
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
                  className="w-11 h-11 bg-white hover:bg-red-50 text-red-600 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-md border border-red-100"
                >
                  <SkipForward className="w-5 h-5" />
                </button>
              </div>

              {/* Status */}
              <div className="flex-1 flex justify-end">
                <div className={`text-sm font-semibold px-4 py-2 rounded-full ${
                  isPlaying 
                    ? 'text-red-700 bg-red-100' 
                    : isBuffering 
                    ? 'text-orange-700 bg-orange-100' 
                    : 'text-gray-600 bg-gray-100'
                }`}>
                  {isPlaying ? '● Now Playing' : isBuffering ? 'Connecting...' : 'Paused'}
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
