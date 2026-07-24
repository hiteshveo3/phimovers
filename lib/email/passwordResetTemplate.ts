import { SITE_URL } from "@/lib/contact";

export function passwordResetHtml(input: {
  email: string;
  link: string;
  displayName?: string;
  audience: "client" | "staff";
}) {
  const hello = input.displayName?.trim()
    ? `Hi ${input.displayName.trim().split(/\s+/)[0]},`
    : "Hi,";
  const kind =
    input.audience === "staff" ? "staff admin account" : "Phi Movers account";

  return `<!DOCTYPE html>
<html>
  <body style="margin:0;padding:0;background:#f4f5f2;font-family:Arial,Helvetica,sans-serif;color:#163300;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f5f2;padding:32px 16px;">
      <tr>
        <td align="center">
          <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e5e7eb;">
            <tr>
              <td style="background:#163300;padding:20px 28px;">
                <p style="margin:0;font-size:18px;font-weight:700;color:#9fe870;">Phi Movers</p>
                <p style="margin:4px 0 0;font-size:12px;color:#c8e6a8;">Password reset</p>
              </td>
            </tr>
            <tr>
              <td style="padding:28px;">
                <h1 style="margin:0 0 12px;font-size:22px;line-height:1.3;">Reset your password</h1>
                <p style="margin:0 0 20px;font-size:15px;line-height:1.55;color:#374151;">
                  ${hello} we received a request to reset the password for your ${kind} (${input.email}).
                </p>
                <p style="margin:0 0 24px;">
                  <a href="${input.link}" style="display:inline-block;background:#9fe870;color:#163300;text-decoration:none;font-weight:700;font-size:15px;padding:14px 22px;border-radius:999px;">
                    Choose a new password
                  </a>
                </p>
                <p style="margin:0 0 12px;font-size:13px;line-height:1.5;color:#6b7280;">
                  This link expires soon. If you didn’t ask for a reset, you can ignore this email — your password stays the same.
                </p>
                <p style="margin:0;font-size:12px;line-height:1.5;color:#9ca3af;word-break:break-all;">
                  Or paste this link: ${input.link}
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:16px 28px 24px;border-top:1px solid #e5e7eb;font-size:12px;color:#9ca3af;">
                Phi Movers · London removals · <a href="${SITE_URL}" style="color:#163300;">phimovers.co.uk</a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}
