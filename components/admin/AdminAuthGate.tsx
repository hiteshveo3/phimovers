"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Warning2 as AlertIcon } from "iconsax-reactjs";
import { Ico } from "@/kit/components/Ico";
import { BRAND } from "@/kit/site-facts";
import { useAdminAuth } from "./AdminAuthProvider";
import TwoStep from "./TwoStep";
import EnrolTwoStep from "./EnrolTwoStep";

export default function AdminAuthGate({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, configured, demo, needsTwoStep, needsEnrol } = useAdminAuth();
  const pathname = usePathname();
  const router = useRouter();
  const isLogin = pathname === "/admin/login";

  useEffect(() => {
    if (loading) return;
    if (!configured && !demo) return;
    if (!user && !isLogin) router.replace("/admin/login");
    if (user && isLogin) router.replace("/admin");
  }, [user, loading, configured, demo, isLogin, router]);

  if (loading) {
    return (
      <div className="as-page">
        <p className="ad-loading">Loading…</p>
      </div>
    );
  }

  if (!configured && !demo) {
    return (
      <div className="as-page">
        <div className="as-box">
          <div>
            <span className="as-brand">
              <b><img src="/brand/phi-movers-icon-192.png" alt="" width={26} height={26} style={{ display: 'inline-block', width: 26, height: 26, borderRadius: 8, marginRight: 8, verticalAlign: 'middle' }} />{BRAND}</b>
              <small>Staff</small>
            </span>
            <h1>Connect Firebase</h1>
            <p className="lead">
              Add the Firebase keys to <code>.env.local</code>, restart{" "}
              <code>npm run dev</code>, then switch on Email/Password and Google
              in Authentication.
            </p>
          </div>
          <div className="ad-card">
            <div className="ad-banner">
              <Ico icon={AlertIcon} size={20} />
              <p style={{ margin: 0 }}>
                Staff sign-in and live leads need Firebase. Nothing is stored
                until it is connected.
              </p>
            </div>
            <ol
              className="ad-muted"
              style={{ margin: "14px 0 0", paddingLeft: 20, lineHeight: 1.7, listStyle: "decimal" }}
            >
              <li>Firebase Console, Authentication: Email and Google on</li>
              <li>Add a staff user (or sign in with Google)</li>
              <li>Publish the Firestore rules for leads and invoices</li>
            </ol>
          </div>
        </div>
      </div>
    );
  }

  // Two-step sign-in is mandatory. No authenticator yet: set one up first. Its pass ran out: the code.
  // Nothing behind the gate (leads, bookings) mounts until then.
  if (user && !demo && needsEnrol) return <EnrolTwoStep />;
  if (user && !demo && needsTwoStep) return <TwoStep />;

  if (!user && !isLogin) return null;
  if (user && isLogin) return null;

  return <>{children}</>;
}
