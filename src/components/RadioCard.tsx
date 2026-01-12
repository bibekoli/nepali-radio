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
        "bg-white rounded-2xl border-2 border-gray-200 p-5 transition-all duration-300 hover:border-red-300 hover:shadow-red-lg",
        isCurrentRadio && "ring-2 ring-red-500 border-red-300 bg-gradient-to-br from-red-50 to-orange-50 shadow-red-lg"
      )}>
        <div className="flex items-center space-x-5">
          {/* Radio Logo */}
          <div className="relative w-20 h-20 flex-shrink-0">
            {/* Spinning border for currently playing */}
            {isCurrentRadio && (
              <motion.div
                className="absolute inset-0 rounded-2xl"
                style={{
                  background: 'linear-gradient(45deg, #ef4444, #f97316, #ef4444)',
                  backgroundSize: '200% 200%',
                }}
                animate={{
                  rotate: 360,
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                }}
                transition={{
                  rotate: { duration: 3, repeat: Infinity, ease: 'linear' },
                  backgroundPosition: { duration: 2, repeat: Infinity, ease: 'linear' },
                }}
              >
                <div className="absolute inset-[2px] rounded-2xl bg-white" />
              </motion.div>
            )}
            
            <div className={cn(
              "relative w-full h-full bg-gradient-to-br from-red-100 to-red-200 rounded-2xl flex items-center justify-center overflow-hidden shadow-md",
              isCurrentRadio ? "border-0" : "border-2 border-red-200"
            )}>
              <Image
                src={`/logo/${radio.id}.jpg`}
                alt={radio.name}
                fill
                className="object-cover rounded-2xl"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
              <Radio className="w-10 h-10 text-red-300" />
            </div>

            {/* Playing indicator */}
            {isCurrentRadio && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-2 -right-2 w-7 h-7 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-red-md z-10"
              >
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="w-2.5 h-2.5 bg-white rounded-full"
                />
              </motion.div>
            )}
          </div>

          {/* Radio Info */}
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-gray-900 truncate text-xl">
              {radio.name}
            </h3>
            <p className="text-base text-red-600 font-semibold mt-1">
              {formatFrequency(radio.frequency)}
            </p>
            <p className="text-sm text-gray-600 truncate mt-1">
              {radio.address}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            <button
              onClick={handleToggleFavorite}
              className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-md",
                isFav
                  ? "bg-gradient-to-br from-red-500 to-red-600 text-white shadow-red-lg"
                  : "bg-white border-2 border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-300"
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
                "px-6 py-3 rounded-full flex items-center space-x-2 transition-all duration-200 hover:scale-105 min-w-[120px] justify-center shadow-lg font-semibold",
                isCurrentRadio
                  ? "bg-gradient-to-br from-red-600 to-red-700 text-white shadow-red-xl"
                  : "bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-red-lg"
              )}
            >
              <Play className="w-5 h-5" />
              <span className="text-sm">
                {isCurrentRadio ? "Playing" : "Listen"}
              </span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
