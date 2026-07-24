"use client";

import { useState } from "react";
import { Icon } from "@/components/icons";

export default function CopyPhoneButton({
  phone,
  className = "",
  label = "Copy",
  iconOnly = false,
}: {
  phone: string;
  className?: string;
  label?: string;
  iconOnly?: boolean;
}) {
  const [copied, setCopied] = useState(false);

  async function onCopy(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(phone);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* ignore */
    }
  }

  return (
    <button
      type="button"
      onClick={onCopy}
      className={
        className ||
        "inline-flex items-center gap-1 rounded-pill border border-line bg-surface px-2.5 py-1 text-xs font-bold text-[#163300]"
      }
      aria-label={copied ? "Copied" : `Copy ${phone}`}
      title={copied ? "Copied" : "Copy number"}
    >
      <Icon name={copied ? "check" : "copy"} className="h-3.5 w-3.5" />
      {!iconOnly && (copied ? "Copied" : label)}
    </button>
  );
}
