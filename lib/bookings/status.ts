// The one booking status table (Alpha's STATUS_MOVES), used by the dashboard UI and mirrored in
// firestore.rules (staffMoves() / moverMoves()). Change all three together, and the app's
// lib/features/bookings/booking_models.dart (statusAfterAssign, isValidMoverTransition) agrees with it.
//
//   staff: confirm, assign, mark progress for crew without the app, complete, cancel; a finished or
//          cancelled booking is only ever reopened as pending.
//   mover: the job steps, one at a time (confirmed → accepted → en route → in progress → completed).
//          `pending → accepted` stays allowed for jobs assigned before assigning confirmed them.

import type { BookingStatus } from "./types";

export const STAFF_MOVES: Record<BookingStatus, BookingStatus[]> = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["pending", "accepted", "en_route", "in_progress", "completed", "cancelled"],
  accepted: ["confirmed", "en_route", "in_progress", "completed", "cancelled"],
  en_route: ["in_progress", "completed", "cancelled"],
  in_progress: ["completed", "cancelled"],
  completed: ["pending"],
  cancelled: ["pending"],
};

export const MOVER_MOVES: Partial<Record<BookingStatus, BookingStatus[]>> = {
  pending: ["accepted"],
  confirmed: ["accepted"],
  accepted: ["en_route"],
  en_route: ["in_progress"],
  in_progress: ["completed"],
};

/** Staying where it is, or one of the moves in STAFF_MOVES. */
export const canStaffMove = (from: BookingStatus, to: BookingStatus) =>
  from === to || (STAFF_MOVES[from] ?? []).includes(to);

export const canMoverMove = (from: BookingStatus, to: BookingStatus) =>
  from === to || (MOVER_MOVES[from] ?? []).includes(to);

/** The sentence shown when a move is refused. */
export function statusMoveRefusal(from: BookingStatus): string {
  switch (from) {
    case "cancelled":
      return "This booking was cancelled. Reopen it first.";
    case "completed":
      return "This booking is already completed. Reopen it first.";
    case "in_progress":
      return "This job is under way. It can only be completed or cancelled.";
    default:
      return "This booking cannot be changed that way.";
  }
}

/** After assigning (or unassigning) crew: the app's statusAfterAssign. */
export const statusAfterAssign = (current: BookingStatus): BookingStatus =>
  current === "pending" || current === "accepted" ? "confirmed" : current;

/** Price changes after these need a second confirmation (AUDIT D11). */
export const priceLocked = (b: { status: BookingStatus; paymentStatus: string }) =>
  b.paymentStatus === "paid" || b.status === "completed" || b.status === "cancelled";

/** A paid (or refunded) booking is never hard-deleted, only archived (AUDIT D12); rules agree. */
export const canHardDelete = (b: { paymentStatus: string }) => b.paymentStatus === "unpaid";
