"use client";

import Link from "next/link";
import { Sms as MailIcon } from "iconsax-reactjs";
import { Ico, type IconType } from "@/kit/components/Ico";

export default function EmptyState({
  title,
  body,
  actionHref,
  actionLabel,
  onAction,
  icon = MailIcon,
}: {
  title: string;
  body: string;
  actionHref?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: IconType;
}) {
  return (
    <div className="ad-empty">
      <i>
        <Ico icon={icon} size={26} />
      </i>
      <b>{title}</b>
      <p>{body}</p>
      {actionHref && actionLabel && (
        <Link href={actionHref} className="ad-btn lime">
          {actionLabel}
        </Link>
      )}
      {onAction && actionLabel && !actionHref && (
        <button type="button" onClick={onAction} className="ad-btn lime">
          {actionLabel}
        </button>
      )}
    </div>
  );
}
