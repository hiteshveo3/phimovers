// Crew slot clash check (Alpha's slot-cells.ts, simplified to Phi's data): a mover already on another
// open job the same day. Same time slot is a hard clash; same day another slot is a warning.

import type { Booking } from "./types";

const open = (b: Booking) => b.status !== "cancelled" && b.status !== "completed" && !b.archived;
const dayOf = (iso: string) => iso.slice(0, 10);

export type Clash = { booking: Booking; sameSlot: boolean };

/** Other open jobs of `moverId` on the day of `b`, same time slot first. */
export function slotClashes(b: Booking, moverId: string, all: Booking[]): Clash[] {
  const day = dayOf(b.scheduledDate);
  return all
    .filter((x) => x.id !== b.id && x.moverId === moverId && open(x) && dayOf(x.scheduledDate) === day)
    .map((x) => ({ booking: x, sameSlot: Boolean(b.scheduledTime) && x.scheduledTime === b.scheduledTime }))
    .sort((a, c) => Number(c.sameSlot) - Number(a.sameSlot));
}
