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