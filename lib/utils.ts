import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Combines multiple class names into a single string, merging Tailwind CSS classes properly
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format a date to a readable string
 */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date)
}

/**
 * Format a date to a short string (MM/DD/YYYY)
 */
export function formatShortDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US").format(date)
}

/**
 * Get a relative time string (e.g., "2 days ago")
 */
export function getRelativeTime(date: Date): string {
  const now = new Date()
  const diffInMs = now.getTime() - date.getTime()
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

  if (diffInDays === 0) {
    return "Today"
  } else if (diffInDays === 1) {
    return "Yesterday"
  } else if (diffInDays < 7) {
    return `${diffInDays} days ago`
  } else if (diffInDays < 30) {
    const weeks = Math.floor(diffInDays / 7)
    return `${weeks} ${weeks === 1 ? "week" : "weeks"} ago`
  } else {
    return formatShortDate(date)
  }
}

/**
 * Convert temperature between Fahrenheit and Celsius
 */
export function convertTemperature(temp: number, to: "F" | "C"): number {
  if (to === "F") {
    // Convert from C to F
    return Math.round(temp * 1.8 + 32)
  } else {
    // Convert from F to C
    return Math.round((temp - 32) / 1.8)
  }
}

