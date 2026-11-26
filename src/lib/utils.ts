import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Tailwind classes ko safely jodta hai (conflicts khud hal karta hai). */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}