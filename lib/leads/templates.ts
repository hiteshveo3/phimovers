import type { Lead } from "./types";

export type MessageTemplate = {
  id: string;
  label: string;
  build: (lead: Lead) => string;
};

export const MESSAGE_TEMPLATES: MessageTemplate[] = [
  {
    id: "intro",
    label: "Intro + ask photos",
    build: (l) =>
      [
        `Hi ${l.name.split(" ")[0]},`,
        ``,
        `Thanks for your ${l.service} enquiry (${l.from} → ${l.to}).`,
        `Could you send a few photos of the main items / access (stairs, lift)?`,
        `We’ll confirm a fixed price usually within about an hour.`,
        ``,
        `— Phi Movers`,
      ].join("\n"),
  },
  {
    id: "quote",
    label: "Send quote",
    build: (l) =>
      [
        `Hi ${l.name.split(" ")[0]},`,
        ``,
        `Quote for your ${l.service}: ${l.quoteAmount || "[amount]"}`,
        `Route: ${l.from} → ${l.to}${l.date ? ` · Preferred ${l.date}` : ""}`,
        ``,
        `Fully insured. No obligation until you book.`,
        `Reply or call us if you’d like to lock the slot.`,
        ``,
        `— Phi Movers`,
      ].join("\n"),
  },
  {
    id: "confirm",
    label: "Booking confirm",
    build: (l) =>
      [
        `Hi ${l.name.split(" ")[0]},`,
        ``,
        `You’re booked for ${l.service}${l.date ? ` on ${l.date}` : ""}.`,
        `We’ll send the crew ETA the morning of the move.`,
        `Any parking / permit notes, just reply.`,
        ``,
        `— Phi Movers`,
      ].join("\n"),
  },
  {
    id: "followup",
    label: "Gentle follow-up",
    build: (l) =>
      [
        `Hi ${l.name.split(" ")[0]},`,
        ``,
        `Just checking in on your ${l.service} quote (${l.from} → ${l.to}).`,
        `Happy to adjust dates or van size if plans changed.`,
        ``,
        `— Phi Movers`,
      ].join("\n"),
  },
];

/** sms: link with a prefilled body (works on phones and most desktop messaging apps). */
export function smsHref(phone: string, text?: string) {
  const num = phone.replace(/[^d+]/g, "");
  return text ? `sms:${num}?&body=${encodeURIComponent(text)}` : `sms:${num}`;
}

export function mailtoHref(email: string, subject: string, body: string) {
  return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function templateSubject(lead: Lead) {
  return `Your ${lead.service} quote — Phi Movers`;
}
