import { format, parseISO } from "date-fns";

/** Aaj ki tareekh "2026-11-16" shakal mein (user ke apne timezone mein). */
export function todayISO(): string {
  return format(new Date(), "yyyy-MM-dd");
}

/** "2026-11-16" -> "16 Nov 2026" */
export function formatDue(iso: string): string {
  return format(parseISO(iso), "d MMM yyyy");
}