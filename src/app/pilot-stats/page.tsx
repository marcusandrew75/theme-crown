import type { Metadata } from "next";
import { getClickCounts } from "@/lib/click-tracking";
import { getTemplateBySlug } from "@/lib/template";
import { categoryBySlug } from "@/lib/categories";

export const metadata: Metadata = { title: "Pilot stats" };

/**
 * Internal-only view of the referrer pilot's outbound click counts (see
 * /out/[slug] and src/lib/click-tracking.ts) — not linked from anywhere
 * in the site nav, just a URL to check manually while the pilot runs.
 */
export default async function PilotStatsPage() {
  const counts = await getClickCounts();
  const slugs = Object.keys(counts).sort((a, b) => counts[b] - counts[a]);

  const rows = await Promise.all(
    slugs.map(async (slug) => {
      const found = await getTemplateBySlug(slug);
      return {
        slug,
        clicks: counts[slug],
        title: found?.entry.title ?? slug,
        category: found ? categoryBySlug(found.categorySlug)?.name : undefined,
      };
    }),
  );

  return (
    <main className="mx-auto max-w-[720px] px-4 py-10 sm:px-6 sm:py-14">
      <p className="mono mb-1.5 text-[11.5px] font-medium tracking-[0.08em] text-[var(--ink-faint)] uppercase">
        Referrer pilot
      </p>
      <h1 className="text-[1.9rem] font-semibold sm:text-[2.2rem]">
        Outbound clicks
      </h1>
      <p className="mt-3 text-[14.5px] text-[var(--ink-soft)]">
        Every &ldquo;View template&rdquo; click is counted here and tagged
        with utm_source=themecrown before handing off — cross-check these
        numbers against what each author sees on their own analytics.
      </p>

      {rows.length === 0 ? (
        <p className="mt-10 text-[14.5px] text-[var(--ink-soft)]">
          No outbound clicks recorded yet.
        </p>
      ) : (
        <div className="mt-8 flex flex-col gap-2">
          {rows.map((row) => (
            <div
              key={row.slug}
              className="flex items-center justify-between gap-4 rounded-2xl bg-[var(--surface)] px-4 py-3 shadow-[var(--shadow-xs)]"
            >
              <div className="min-w-0">
                <div className="truncate text-[14.5px] font-medium">
                  {row.title}
                </div>
                <div className="mono mt-0.5 text-[12px] text-[var(--ink-faint)]">
                  /t/{row.slug}
                  {row.category ? ` · ${row.category}` : ""}
                </div>
              </div>
              <span
                className="mono tabular shrink-0 text-[1.1rem] font-semibold"
                style={{ color: "var(--accent-deep)" }}
              >
                {row.clicks}
              </span>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
