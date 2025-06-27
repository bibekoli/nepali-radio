import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export function Card({ children, className, hover = false, onClick }: CardProps) {
  const Component = onClick ? motion.button : motion.div;
  
  return (
    <Component
      className={cn(
        "bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden",
        hover && "hover:shadow-lg hover:border-gray-200 transition-all duration-200",
        onClick && "cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
        className
      )}
      onClick={onClick}
      whileHover={hover ? { y: -2 } : undefined}
      transition={{ duration: 0.2 }}
    >
      {children}
    </Component>
  );
}

export function CardHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("p-6 pb-4", className)}>
      {children}
    </div>
  );
}

export function CardContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("p-6 pt-0", className)}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("p-6 pt-4 border-t border-gray-100", className)}>
      {children}
    </div>
  );
}
