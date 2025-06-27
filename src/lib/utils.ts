import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatFrequency(frequency: number | null): string {
  if (!frequency) return "Online Radio";
  return `${frequency} MHz`;
}

export function getProvinceNames(): Record<number, string> {
  return {
    1: "Province 1",
    2: "Madhesh Province", 
    3: "Bagmati Province",
    4: "Gandaki Province",
    5: "Lumbini Province",
    6: "Karnali Province",
    7: "Sudurpashchim Province"
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function formatError(error: unknown): string {
  if (typeof error === 'string') return error;
  if (error && typeof error === 'object' && 'message' in error) {
    return String((error as { message: unknown }).message);
  }
  return 'An unexpected error occurred';
}
