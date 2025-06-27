import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { Heart, Play, Radio } from 'lucide-react';
import { useRadioStore } from '@/data/zustand';
import { formatFrequency } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface RadioCardProps {
  radio: RadioItem;
  index: number;
}

export default function RadioCard({ radio, index }: RadioCardProps) {
  const {
    current,
    setCurrent,
    isFavorite,
    toggleFavorite
  } = useRadioStore();

  const isCurrentRadio = current?.id === radio.id;
  const isFav = isFavorite(radio.id);

  const handlePlay = () => {
    setCurrent(radio);
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    const wasFavorite = isFav;
    toggleFavorite(radio.id);

    if (wasFavorite) {
      toast.success(`Removed ${radio.name} from favorites`);
    } else {
      toast.success(`Added ${radio.name} to favorites`);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <div className={cn(
        "bg-gradient-to-r from-slate-800/50 to-slate-700/50 backdrop-blur-sm rounded-xl border border-slate-600/50 p-4 transition-all duration-300 hover:from-slate-700/60 hover:to-slate-600/60 hover:border-slate-500/60 hover:shadow-lg hover:shadow-sky-500/10",
        isCurrentRadio && "ring-2 ring-sky-500 bg-gradient-to-r from-sky-900/20 to-orange-900/20"
      )}>
        <div className="flex items-center space-x-4">
          {/* Radio Logo */}
          <div className="relative w-16 h-16 flex-shrink-0">
            <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-800 rounded-xl flex items-center justify-center overflow-hidden border border-slate-600">
              <Image
                src={`/logo/${radio.id}.jpg`}
                alt={radio.name}
                fill
                className="object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
              <Radio className="w-8 h-8 text-slate-400" />
            </div>

            {/* Playing indicator */}
            {isCurrentRadio && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-sky-500 to-orange-500 rounded-full flex items-center justify-center"
              >
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="w-2 h-2 bg-white rounded-full"
                />
              </motion.div>
            )}
          </div>

          {/* Radio Info */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-white truncate text-lg">
              {radio.name}
            </h3>
            <p className="text-sm text-slate-300 mt-1">
              {formatFrequency(radio.frequency)}
            </p>
            <p className="text-xs text-slate-400 truncate mt-1">
              {radio.address}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            <button
              onClick={handleToggleFavorite}
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-105",
                isFav
                  ? "bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg"
                  : "bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white"
              )}
            >
              <Heart
                className={cn(
                  "w-5 h-5 transition-all duration-200",
                  isFav && "fill-current"
                )}
              />
            </button>

            <button
              onClick={handlePlay}
              className={cn(
                "px-4 py-2 rounded-full flex items-center space-x-2 transition-all duration-200 hover:scale-105 min-w-[100px] justify-center",
                isCurrentRadio
                  ? "bg-gradient-to-r from-sky-600 to-orange-600 text-white shadow-lg"
                  : "bg-gradient-to-r from-sky-500 to-orange-500 hover:from-sky-600 hover:to-orange-600 text-white shadow-lg"
              )}
            >
              <Play className="w-4 h-4" />
              <span className="text-sm font-medium">
                {isCurrentRadio ? "Playing" : "Listen"}
              </span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
