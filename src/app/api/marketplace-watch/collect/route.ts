import { NextResponse, type NextRequest } from "next/server";
import { collectSnapshots } from "@/lib/marketplace-watch-collect";

// 4 polite, paced requests can take ~10-15s — headroom on hosts that
// enforce a function timeout (e.g. Vercel). Ignored elsewhere.
export const maxDuration = 60;

/**
 * Triggers a fresh marketplace-pulse snapshot. Deliberately trigger-
 * agnostic and GET (not POST) since Vercel Cron only calls GET — the
 * same handler also works from a GitHub Actions scheduled workflow or a
 * one-off manual/curl call while no scheduler is wired up yet. A
 * side-effecting GET is a standard, intentional exception for cron-style
 * endpoints, not an oversight.
 */
export async function GET(request: NextRequest) {
  const expected = process.env.CRON_SECRET;
  if (!expected) {
    return NextResponse.json({ error: "CRON_SECRET is not configured" }, { status: 503 });
  }

  const bearer = request.headers.get("authorization")?.match(/^Bearer\s+(.+)$/i)?.[1];
  const provided = bearer ?? request.nextUrl.searchParams.get("secret");
  if (provided !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const only = request.nextUrl.searchParams.get("category") ?? undefined;
  const results = await collectSnapshots(only);
  return NextResponse.json({ results });
}
