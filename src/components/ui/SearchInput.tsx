import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  debounceMs?: number;
}

export default function SearchInput({ 
  value, 
  onChange, 
  placeholder = "Search...", 
  className,
  debounceMs = 300 
}: SearchInputProps) {
  const [localValue, setLocalValue] = useState(value);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (localValue !== value) {
        onChange(localValue);
      }
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [localValue, onChange, value, debounceMs]);

  const handleClear = () => {
    setLocalValue('');
    onChange('');
  };

  return (
    <motion.div 
      className={cn(
        "relative flex items-center",
        className
      )}
      animate={{ scale: isFocused ? 1.02 : 1 }}
      transition={{ duration: 0.2 }}
    >
      <div className="relative w-full">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
        <input
          type="text"
          value={localValue}
          onChange={(e) => setLocalValue(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className={cn(
            "w-full pl-10 pr-10 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white",
            "focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent",
            "transition-all duration-200 placeholder-slate-400",
            isFocused && "shadow-lg bg-slate-700/70"
          )}
        />
        <AnimatePresence>
          {localValue && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={handleClear}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
