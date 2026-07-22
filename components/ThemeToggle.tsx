"use client";

import { useEffect, useState } from "react";
import { Icon } from "./icons";

export default function ThemeToggle({ className = "" }: { className?: string }) {
  const [dark, setDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {}
  }

  return (
    <button
      aria-label="Toggle dark mode"
      onClick={toggle}
      className={
        "grid h-9 w-9 place-items-center rounded-lg border border-line text-content transition-colors hover:bg-cream " +
        className
      }
    >
      <Icon name={mounted && dark ? "sun" : "moon"} className="h-[18px] w-[18px]" />
    </button>
  );
}
