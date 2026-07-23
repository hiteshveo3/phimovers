"use client";

import { useState } from "react";
import { Icon } from "../icons";

export default function ShareRow({
  url,
  title,
}: {
  url: string;
  title: string;
}) {
  const [copied, setCopied] = useState(false);
  const enc = encodeURIComponent;

  const links = [
    { name: "twitter", href: `https://twitter.com/intent/tweet?url=${enc(url)}&text=${enc(title)}` },
    { name: "facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${enc(url)}` },
    { name: "linkedin", href: `https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}` },
    { name: "whatsapp", href: `https://wa.me/?text=${enc(title + " " + url)}` },
  ];

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {}
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="mr-1 text-sm font-semibold text-content">Share</span>
      {links.map((l) => (
        <a
          key={l.name}
          href={l.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Share on ${l.name}`}
          className="grid h-9 w-9 place-items-center rounded-full border border-line text-content transition-colors hover:border-[#163300] hover:bg-[#9fe870]/25 hover:text-[#163300]"
        >
          <Icon name={l.name} className="h-4 w-4" />
        </a>
      ))}
      <button
        onClick={copy}
        aria-label="Copy link"
        className="inline-flex h-9 items-center gap-1.5 rounded-full border border-line px-3 text-sm text-content transition-colors hover:border-[#163300] hover:bg-[#9fe870]/25 hover:text-[#163300]"
      >
        <Icon name={copied ? "check" : "link"} className="h-4 w-4" />
        {copied ? "Copied" : "Copy link"}
      </button>
    </div>
  );
}
