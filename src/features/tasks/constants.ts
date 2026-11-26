import type { Category, Priority } from "./lib/schema";

export const CATEGORY_LABELS: Record<Category, string> = {
  work: "Work",
  personal: "Personal",
  study: "Study",
  health: "Health",
  other: "Other",
};

export const PRIORITY_LABELS: Record<Priority, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
};

export const PRIORITY_STYLES: Record<Priority, string> = {
  high: "bg-red-500/10 text-red-700 dark:text-red-400",
  medium: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
  low: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
};