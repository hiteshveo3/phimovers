"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useClientAuth } from "./ClientAuthProvider";
import { Icon } from "@/components/icons";

export default function ClientAuthGate({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, configured, needsProfile } = useClientAuth();
  const pathname = usePathname();
  const router = useRouter();
  const isLogin = pathname === "/client/login";
  const isComplete = pathname === "/client/complete-profile";

  useEffect(() => {
    if (loading) return;
    if (!configured) return;
    if (!user && !isLogin) router.replace("/client/login");
    if (user && isLogin) {
      router.replace(needsProfile ? "/client/complete-profile" : "/client");
    }
    if (user && needsProfile && !isComplete && !isLogin) {
      router.replace("/client/complete-profile");
    }
    if (user && !needsProfile && isComplete) {
      router.replace("/client");
    }
  }, [user, loading, configured, isLogin, isComplete, needsProfile, router]);

  if (!configured) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4">
        <div className="rounded-2xl border border-line bg-surface p-6">
          <Icon name="alert" className="h-6 w-6 text-[#163300]" />
          <h1 className="mt-3 text-xl font-extrabold">Almost ready</h1>
          <p className="mt-2 text-sm text-muted">
            Client portal needs Firebase config. Please try again shortly.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-sm text-muted">
        Loading…
      </div>
    );
  }

  if (!user && !isLogin) return null;
  if (user && isLogin) return null;
  if (user && needsProfile && !isComplete && !isLogin) return null;

  return <>{children}</>;
}
