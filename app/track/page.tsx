import type { Metadata } from "next";
import TrackClient from "./TrackClient";

export const metadata: Metadata = {
  title: "Track your quote — Phi Movers",
  description:
    "Check the status of your Phi Movers quote with your tracking code and phone number.",
};

export default function TrackPage() {
  return <TrackClient />;
}
