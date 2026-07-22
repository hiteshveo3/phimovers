"use client";

import { useState } from "react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  return (
    <section className="container-page">
      <div className="relative isolate overflow-hidden rounded-[24px] bg-gradient-to-tr from-[#7ed155] via-[#9fe870] to-[#c8f6a6] px-6 py-12 text-center text-ink md:px-12">
        <div
          aria-hidden
          className="pointer-events-none absolute -left-16 -top-16 -z-10 h-64 w-64 rounded-full bg-white/40 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-24 right-16 -z-10 h-64 w-64 rounded-full bg-[#163300]/15 blur-3xl"
        />
        <h2 className="mx-auto max-w-xl text-2xl font-bold md:text-3xl">
          Get a free moving quote in 60 seconds
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-sm text-ink/70">
          Enter your email and our friendly team will send a tailored,
          no-obligation quote for your move.
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (email) setSent(true);
          }}
          className="mx-auto mt-7 flex max-w-md flex-col gap-3 sm:flex-row"
        >
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full rounded-pill border border-ink/15 bg-surface px-5 py-3 text-sm text-content outline-none focus:border-ink/50"
          />
          <button
            type="submit"
            className="btn shrink-0 bg-[#163300] text-[#9fe870] hover:bg-[#1e4600]"
          >
            {sent ? "Quote on its way ✓" : "Get My Quote"}
          </button>
        </form>
      </div>
    </section>
  );
}
