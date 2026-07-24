"use client";

import Link from "next/link";
import { Icon } from "@/components/icons";

export default function EmptyState({
  title,
  body,
  actionHref,
  actionLabel,
  onAction,
}: {
  title: string;
  body: string;
  actionHref?: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <div className="px-4 py-12 text-center">
      <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-[#9fe870]/40 text-[#163300]">
        <Icon name="mail" className="h-6 w-6" />
      </div>
      <p className="mt-4 text-base font-bold text-[#163300]">{title}</p>
      <p className="mx-auto mt-1 max-w-xs text-sm text-muted">{body}</p>
      {actionHref && actionLabel && (
        <Link
          href={actionHref}
          className="btn mt-5 inline-flex justify-center bg-[#9fe870] px-5 py-2.5 text-[#163300]"
        >
          {actionLabel}
        </Link>
      )}
      {onAction && actionLabel && !actionHref && (
        <button
          type="button"
          onClick={onAction}
          className="btn mt-5 inline-flex justify-center bg-[#9fe870] px-5 py-2.5 text-[#163300]"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
