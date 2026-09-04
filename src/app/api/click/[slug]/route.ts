import { NextResponse } from "next/server";
import { recordClick } from "@/lib/click-tracking";

/**
 * Hit via navigator.sendBeacon from OutboundLink's onClick — fire-and-forget
 * so it never delays or interferes with the real navigation, which goes
 * straight to the author's tagged URL (see src/components/outbound-link.tsx).
 */
export async function POST(
  _request: Request,
  context: RouteContext<"/api/click/[slug]">,
) {
  const { slug } = await context.params;
  await recordClick(slug);
  return NextResponse.json({ ok: true });
}
