"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Warning2 as AlertIcon } from "iconsax-reactjs";
import { Ico } from "@/kit/components/Ico";
import { useAdminAuth } from "./AdminAuthProvider";
import { useLeads } from "./LeadsProvider";

export default function ConnectionBanner() {
  const pathname = usePathname();
  const { error } = useLeads();
  const { demo } = useAdminAuth();
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

  return (
    <div style={{ display: "grid", gap: 10, marginBottom: offline || error || demo ? 16 : 0 }}>
      {demo && (
        <div className="ad-banner info" role="status">
          <Ico icon={AlertIcon} size={20} />
          <p style={{ margin: 0 }}>
            Demo mode: sample data held in this browser tab. Nothing is saved.
          </p>
        </div>
      )}
      {(offline || error) && (
        <div className="ad-banner" role="alert">
          <Ico icon={AlertIcon} size={20} />
          <p style={{ margin: 0 }}>
            {offline
              ? "You are offline, so these are the last loaded leads. Changes may fail until you are back."
              : error}
          </p>
        </div>
      )}
    </div>
  );
}
