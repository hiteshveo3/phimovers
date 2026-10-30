"use client";

import { useState } from "react";
import { Copy as CopyIcon, TickCircle as TickIcon } from "iconsax-reactjs";
import { Ico } from "@/kit/components/Ico";

export default function CopyPhoneButton({
  phone,
  label = "Copy",
  iconOnly = false,
}: {
  phone: string;
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
      /* clipboard blocked */
    }
  }

  return (
    <button
      type="button"
      onClick={onCopy}
      className={iconOnly ? "ad-icon-btn" : "ad-mini"}
      aria-label={copied ? "Copied" : `Copy ${phone}`}
      title={copied ? "Copied" : "Copy number"}
    >
      <Ico icon={copied ? TickIcon : CopyIcon} size={16} />
      {!iconOnly && (copied ? "Copied" : label)}
    </button>
  );
}
