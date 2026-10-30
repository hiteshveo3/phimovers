import type { Metadata } from "next";
import TrackClient from "./TrackClient";

/** Public lookup: a booking or quote request by reference + phone (no account needed). */
export const metadata: Metadata = {
  title: "Track a booking or quote | Phi Movers",
  description: "Find your Phi Movers booking or quote request with its reference and your phone number.",
  robots: { index: false, follow: false },
};

export default function TrackPage() {
  return <TrackClient />;
}
