import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  color?: 'primary' | 'white' | 'gray';
}

export default function LoadingSpinner({ 
  size = 'md', 
  className,
  color = 'primary' 
}: LoadingSpinnerProps) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  const colors = {
    primary: 'border-sky-500',
    white: 'border-white',
    gray: 'border-slate-400'
  };

  return (
    <motion.div
      className={cn(
        "border-2 border-t-transparent rounded-full",
        sizes[size],
        colors[color],
        className
      )}
      animate={{ rotate: 360 }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: "linear"
      }}
    />
  );
}

interface LoadingStateProps {
  message?: string;
  className?: string;
}

export function LoadingState({ message = "Loading...", className }: LoadingStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={cn("flex flex-col items-center justify-center p-8 min-h-screen", className)}
    >
      <LoadingSpinner size="lg" color="primary" />
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-4 text-slate-300 text-sm"
      >
        {message}
      </motion.p>
    </motion.div>
  );
}
