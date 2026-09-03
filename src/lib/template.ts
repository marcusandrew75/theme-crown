import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/auth";
import { getLeaderboard } from "@/lib/leaderboard";
import { findSandboxEntry } from "@/lib/demo-sandbox";
import type { LeaderboardEntry } from "@/lib/demo-data";

export type TemplateLookup = {
  entry: LeaderboardEntry;
  categorySlug: string;
  isLive: boolean;
};

/**
 * Looks a template up by slug for the profile page — the sandbox (base demo
 * entries plus anything submitted/bid on locally) while Supabase isn't
 * configured, the real database once it is. A freshly submitted template
 * has no bids yet, but it still shows up here: both the sandbox and the
 * real `leaderboard` view include every template in its category at score 0.
 */
export async function getTemplateBySlug(
  slug: string,
): Promise<TemplateLookup | null> {
  if (!isSupabaseConfigured()) {
    const found = await findSandboxEntry(slug);
    return found ? { ...found, isLive: false } : null;
  }

  try {
    const supabase = await createClient();

    const { data: templateRow } = await supabase
      .from("templates")
      .select("category_id")
      .eq("slug", slug)
      .maybeSingle();
    if (!templateRow) return null;

    const { data: categoryRow } = await supabase
      .from("categories")
      .select("slug")
      .eq("id", templateRow.category_id)
      .maybeSingle();
    if (!categoryRow) return null;

    const { entries } = await getLeaderboard(categoryRow.slug);
    const entry = entries.find((e) => e.slug === slug);
    if (!entry) return null;

    return { entry, categorySlug: categoryRow.slug, isLive: true };
  } catch {
    return null;
  }
}
