// One password rule for staff and crew accounts (Alpha's PASSWORD_MIN): at least 10 characters with a
// letter and a number. Used by Settings > Change password and /api/admin/movers. Safe on both sides.

export const PASSWORD_MIN = 10;

/** Null when the password is acceptable, else the sentence to show. */
export function passwordProblem(password: string): string | null {
  if (password.length < PASSWORD_MIN) return `Use at least ${PASSWORD_MIN} characters.`;
  if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) return "Use at least one letter and one number.";
  return null;
}
