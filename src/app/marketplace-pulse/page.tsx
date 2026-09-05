import type { Metadata } from "next";
import { CATEGORIES } from "@/lib/categories";
import { getHistory } from "@/lib/marketplace-watch-store";
import { MarketplacePulseBoard } from "@/components/marketplace-pulse-board";

export const metadata: Metadata = { title: "Marketplace Pulse" };

const TRACKED_CATEGORIES = CATEGORIES.filter((c) => c.framerCategorySlug);

/**
 * A weekly, factual record of Framer's own public marketplace category
 * pages — deliberately named/branded away from "Framer" and framed as
 * plain reporting (see the disclaimer below), not an editorialized
 * "gotcha" campaign against the platform our authors depend on.
 */
export default async function MarketplacePulsePage() {
  const boards = await Promise.all(
    TRACKED_CATEGORIES.map(async (category) => {
      const history = await getHistory(category.slug);
      const latest = history.at(-1);
      const previous = history.length > 1 ? history.at(-2) : undefined;
      return { category, latest, previous, snapshotCount: history.length };
    }),
  );

  return (
    <main className="mx-auto max-w-[1160px] px-4 py-10 sm:px-6 sm:py-14">
      <p className="mono mb-1.5 text-[11.5px] font-medium tracking-[0.08em] text-[var(--ink-faint)] uppercase">
        Independent report
      </p>
      <h1 className="text-[1.9rem] font-semibold sm:text-[2.2rem]">Marketplace Pulse</h1>
      <p className="mt-2 max-w-[62ch] text-[14.5px] text-[var(--ink-soft)]">
        A weekly snapshot of Framer&apos;s own public marketplace category
        pages — who moved up, who moved down, who&apos;s new.
      </p>

      <div className="mt-5 rounded-2xl bg-[var(--surface-sunken)] p-4">
        <p className="text-[13px] leading-relaxed text-[var(--ink-soft)]">
          ThemeCrown is not affiliated with, endorsed by, or operated by
          Framer. This page reports what publicly appeared on Framer&apos;s
          own marketplace category pages at each snapshot — the same pages
          anyone can browse without an account — not a claim about how or
          why that order changes.
        </p>
      </div>

      <MarketplacePulseBoard boards={boards} />
    </main>
  );
}
