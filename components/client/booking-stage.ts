// The four-dot status line and the line of text under it, shared by the portal's booking list and detail.
// "On the day" is a confirmed booking whose (London) date has come. After Alpha's stageOf / STATUS_NOTICE.

import type { BookingStatus } from "@/lib/bookings/types";
import { DEPOSIT_TEXT } from "@/kit/site-facts";

export const STAGES = ["Received", "Confirmed", "On the day", "Done"] as const;

export function stageOf(status: BookingStatus, day: string, today: string): number {
  if (status === "cancelled") return -1;
  if (status === "completed") return 3;
  if (status === "en_route" || status === "in_progress") return 2;
  if (status === "pending") return 0;
  return day && day <= today ? 2 : 1;
}

/** What happens next, and what can still be changed, for every status. */
export const STATUS_NOTICE: Record<BookingStatus, string> = {
  pending: `We have your request and will call you to confirm the van, the crew, the time and the price. You can change or cancel it here until then. ${DEPOSIT_TEXT}`,
  confirmed: "Your booking is confirmed. Need another date, time or more help? Ask below and we will confirm whether we can do it.",
  accepted: "Your crew has accepted the job. Changes still go through the office: ask below or call us.",
  en_route: "Your crew is on the way.",
  in_progress: "Your move is under way. Call us if anything comes up.",
  completed: "All done. Thank you for moving with Phi Movers. If anything was damaged, report it below.",
  cancelled: "This booking is cancelled. Call us if that is a surprise, or book again any time.",
};

/** Today in London, "YYYY-MM-DD". */
export const londonToday = () => new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/London" }).format(new Date());
