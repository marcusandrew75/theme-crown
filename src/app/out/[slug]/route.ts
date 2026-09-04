import { NextResponse } from "next/server";
import { getTemplateBySlug } from "@/lib/template";
import { recordClick } from "@/lib/click-tracking";
import { withPilotUtm } from "@/lib/utm";

/**
 * Every "View template" link routes through here instead of linking
 * straight to the author's URL, so a click gets counted (see
 * /pilot-stats) before handing off, tagged with UTM params so it also
 * shows up in the author's own analytics as ThemeCrown referral traffic.
 */
export async function GET(
  request: Request,
  context: RouteContext<"/out/[slug]">,
) {
  const { slug } = await context.params;
  const found = await getTemplateBySlug(slug);

  if (!found?.entry.url) {
    return NextResponse.redirect(new URL(`/t/${slug}`, request.url));
  }

  await recordClick(slug);
  return NextResponse.redirect(withPilotUtm(found.entry.url, slug));
}
