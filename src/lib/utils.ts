import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function generateRandomNumberString(length: number): string {
  if (length <= 0) {
    throw new Error('Length must be greater than 0');
  }

  const digits = '0123456789';
  let result = '';

  for (let i = 0; i < length; i++) {
    const randomDigit = digits[Math.floor(Math.random() * digits.length)];
    result += randomDigit;
  }

  return result;
}

export function formatNumberWithSuffix(num: number): string {
  const absNum = Math.abs(num);

  if (absNum >= 1e9) {
    return (num / 1e9).toFixed(1) + 'B';
  } else if (absNum >= 1e6) {
    return (num / 1e6).toFixed(1) + 'M';
  } else if (absNum >= 1e3) {
    return (num / 1e3).toFixed(1) + 'K';
  } else {
    return num.toString();
  }
}