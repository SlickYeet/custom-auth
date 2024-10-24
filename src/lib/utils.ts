import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateOTP(): string {
  const MIN = 100000
  const MAX = 999999
  const totp = (Math.floor(Math.random() * (MAX - MIN + 1)) + MIN).toString()
  return totp
}
