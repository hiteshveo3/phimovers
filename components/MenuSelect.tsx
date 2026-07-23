"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Icon } from "./icons";

type Option = { value: string; label: string };

export default function MenuSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: Option[];
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();
  const current = options.find((o) => o.value === value) ?? options[0];

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative inline-flex items-center gap-2 text-sm">
      <span className="font-semibold text-content">{label}</span>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1.5 rounded-pill border border-line bg-surface px-3.5 py-1.5 font-semibold text-content transition-colors hover:bg-[#9fe870]/25"
      >
        {current?.label}
        <Icon
          name="chevronDown"
          className={
            "h-4 w-4 text-muted transition-transform " + (open ? "rotate-180" : "")
          }
        />
      </button>

      {open && (
        <ul
          id={listId}
          role="listbox"
          className="absolute left-0 top-full z-40 mt-1.5 min-w-[11rem] overflow-hidden rounded-2xl border border-line bg-surface py-1"
        >
          {options.map((o) => {
            const active = o.value === value;
            return (
              <li key={o.value} role="option" aria-selected={active}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(o.value);
                    setOpen(false);
                  }}
                  className={
                    "flex w-full items-center px-3.5 py-2 text-left text-sm font-medium transition-colors " +
                    (active
                      ? "bg-[#9fe870] text-[#163300]"
                      : "text-content hover:bg-[#9fe870]/25")
                  }
                >
                  {o.label}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
