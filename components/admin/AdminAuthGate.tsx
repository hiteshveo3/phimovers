"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAdminAuth } from "./AdminAuthProvider";
import { Icon } from "@/components/icons";

export default function AdminAuthGate({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, configured } = useAdminAuth();
  const pathname = usePathname();
  const router = useRouter();
  const isLogin = pathname === "/admin/login";

  useEffect(() => {
    if (loading) return;
    if (!configured) return;
    if (!user && !isLogin) router.replace("/admin/login");
    if (user && isLogin) router.replace("/admin");
  }, [user, loading, configured, isLogin, router]);

  if (!configured) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-10">
        <div className="rounded-2xl border border-line bg-surface p-6">
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-[#9fe870] text-[#163300]">
            <Icon name="alert" className="h-5 w-5" />
          </span>
          <h1 className="mt-4 text-xl font-extrabold">Connect Firebase</h1>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Add Firebase keys to{" "}
            <code className="text-content">.env.local</code>, restart{" "}
            <code className="text-content">npm run dev</code>, then enable
            Email/Password + Google in Authentication.
          </p>
          <ol className="mt-4 list-decimal space-y-1 pl-5 text-sm text-muted">
            <li>Firebase Console → Authentication → Email & Google ON</li>
            <li>Add a staff user (or sign in with Google)</li>
            <li>Firestore rules published for <code>leads</code></li>
          </ol>
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

  return <>{children}</>;
}
