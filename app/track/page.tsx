import { redirect } from "next/navigation";

/** Old track URL — clients now use the full portal. */
export default function TrackRedirectPage() {
  redirect("/client");
}
