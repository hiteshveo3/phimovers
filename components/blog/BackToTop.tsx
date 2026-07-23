"use client";

import { useEffect, useState } from "react";
import { Icon } from "../icons";

export default function BackToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      aria-label="Back to top"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={
        "fixed bottom-36 right-5 z-[70] grid h-11 w-11 place-items-center rounded-full bg-[#9fe870] text-[#163300] shadow-soft transition-all duration-300 hover:bg-[#86d957] hover:scale-105 lg:bottom-6 " +
        (show
          ? "translate-y-0 scale-100 opacity-100"
          : "pointer-events-none translate-y-4 scale-75 opacity-0")
      }
    >
      <Icon name="arrowUp" className="h-5 w-5" />
    </button>
  );
}
