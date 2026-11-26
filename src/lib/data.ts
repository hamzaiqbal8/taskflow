import { format } from "date-fns";

/** Aaj ki tareekh "2026-11-16" shakal mein (user ke apne timezone mein). */
export function todayISO(): string {
  return format(new Date(), "yyyy-MM-dd");
}