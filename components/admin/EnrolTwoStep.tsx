"use client";

import { ShieldTick as ShieldIcon } from "iconsax-reactjs";
import { Ico } from "@/kit/components/Ico";
import { BRAND } from "@/kit/site-facts";
import { useAdminAuth } from "./AdminAuthProvider";
import SecurityPanel from "./SecurityPanel";

// First sign-in of a staff account without an authenticator app: two-step sign-in is mandatory, so this
// screen comes before the dashboard (Alpha's office enrolment). It never blocks enrolling: the 2FA route
// accepts begin/confirm without a pass while the account has no app yet. Signing out is always possible.

export default function EnrolTwoStep() {
  const { user, logout } = useAdminAuth();
  return (
    <div className="as-page">
      <div className="as-box" style={{ maxWidth: 520 }}>
        <div>
          <span className="as-brand">
            <b><img src="/brand/phi-movers-icon-192.png" alt="" width={26} height={26} style={{ display: 'inline-block', width: 26, height: 26, borderRadius: 8, marginRight: 8, verticalAlign: 'middle' }} />{BRAND}</b>
            <small>Staff</small>
          </span>
          <h1>One more step</h1>
          <p className="lead">
            Install Google Authenticator, Microsoft Authenticator or 1Password on your phone, then follow the steps below.
          </p>
        </div>
        <SecurityPanel enrol />
        <p className="as-foot">
          <Ico icon={ShieldIcon} size={16} />
          Signed in as {user?.email}.{" "}
          <button type="button" className="ad-link" style={{ minHeight: 0 }} onClick={() => void logout()}>
            Sign out
          </button>
        </p>
      </div>
    </div>
  );
}
