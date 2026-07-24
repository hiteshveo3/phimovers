"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/icons";
import { useLeads } from "./LeadsProvider";

export default function ConnectionBanner() {
  const pathname = usePathname();
  const { error } = useLeads();
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    const sync = () => setOffline(!navigator.onLine);
    sync();
    window.addEventListener("online", sync);
    window.addEventListener("offline", sync);
    return () => {
      window.removeEventListener("online", sync);
      window.removeEventListener("offline", sync);
    };
  }, []);

  if (pathname === "/admin/login") return null;
  if (!offline && !error) return null;

  return (
    <div className="mb-4 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5 text-sm text-amber-950">
      <Icon name="alert" className="mt-0.5 h-4 w-4 shrink-0" />
      <p>
        {offline
          ? "You’re offline — showing last loaded leads. Changes may fail until you’re back."
          : error}
      </p>
    </div>
  );
}
