/**
 * Tags an outbound template URL so the author's own analytics (Framer
 * dashboard, GA, etc.) can see which visits came from ThemeCrown — the
 * whole point of the referrer pilot. utm_content carries the slug so
 * per-listing performance is visible on the author's side too, not just
 * in our own /pilot-stats counts.
 */
export function withPilotUtm(url: string, slug: string): string {
  try {
    const tagged = new URL(url);
    tagged.searchParams.set("utm_source", "themecrown");
    tagged.searchParams.set("utm_medium", "referral");
    tagged.searchParams.set("utm_campaign", "pilot");
    tagged.searchParams.set("utm_content", slug);
    return tagged.toString();
  } catch {
    return url;
  }
}
