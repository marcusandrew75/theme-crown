import type { Metadata } from "next";
import { RankBadge } from "@/components/rank-badge";
import { CATEGORIES } from "@/lib/categories";
import { DEMO_LEADERBOARDS } from "@/lib/demo-data";
import { getHistory } from "@/lib/marketplace-watch-store";
import { computeMovements, TRACKED_TOP_N, type Movement } from "@/lib/marketplace-watch-diff";

export const metadata: Metadata = { title: "Marketplace Pulse" };

const TRACKED_CATEGORIES = CATEGORIES.filter((c) => c.framerCategorySlug);

// Cross-reference titles we already know from the demo data; fall back to
// a humanized slug for the (many — marketplace churns fast) templates
// that showed up since.
const KNOWN_TITLES = new Map(
  Object.values(DEMO_LEADERBOARDS)
    .flat()
    .map((entry) => [entry.slug, entry.title] as const),
);

function displayTitle(slug: string): string {
  const known = KNOWN_TITLES.get(slug);
  if (known) return known;
  return slug
    .split("-")
    .map((word) => (word ? word[0].toUpperCase() + word.slice(1) : word))
    .join(" ");
}

function framerTemplateUrl(slug: string): string {
  return `https://www.framer.com/marketplace/templates/${slug}/`;
}

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

      <div className="mt-10 flex flex-col gap-12">
        {boards.map(({ category, latest, previous, snapshotCount }) => (
          <section key={category.slug}>
            <h2 className="text-[1.3rem] font-semibold">{category.name}</h2>

            {!latest ? (
              <p className="mt-3 text-[14px] text-[var(--ink-soft)]">
                No snapshot recorded yet.
              </p>
            ) : snapshotCount < 2 ? (
              <>
                <p className="mt-1 text-[13px] text-[var(--ink-faint)]">
                  First snapshot recorded — check back next week to see what
                  moved.
                </p>
                <div className="mt-4 flex flex-col gap-2">
                  {latest.entries.slice(0, TRACKED_TOP_N).map((entry) => (
                    <a
                      key={entry.slug}
                      href={framerTemplateUrl(entry.slug)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 rounded-2xl bg-[var(--surface)] px-4 py-2.5 shadow-[var(--shadow-xs)] transition-shadow hover:shadow-[var(--shadow-sm)]"
                    >
                      <RankBadge rank={entry.rank} />
                      <span className="truncate text-[14px] font-medium">
                        {displayTitle(entry.slug)}
                      </span>
                    </a>
                  ))}
                </div>
              </>
            ) : (
              <div className="mt-4 flex flex-col gap-2">
                {computeMovements(previous, latest).map((movement) => (
                  <MovementRow key={`${movement.slug}-${movement.kind}`} movement={movement} />
                ))}
              </div>
            )}
          </section>
        ))}
      </div>
    </main>
  );
}

function MovementRow({ movement }: { movement: Movement }) {
  const isDropped = movement.kind === "dropped-out";

  return (
    <a
      href={framerTemplateUrl(movement.slug)}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 rounded-2xl bg-[var(--surface)] px-4 py-2.5 shadow-[var(--shadow-xs)] transition-shadow hover:shadow-[var(--shadow-sm)]"
      style={isDropped ? { opacity: 0.6 } : undefined}
    >
      {isDropped ? (
        <div className="mono flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-[13px] font-medium text-[var(--ink-faint)]">
          —
        </div>
      ) : (
        <RankBadge rank={movement.rank} />
      )}

      <span className="min-w-0 flex-1 truncate text-[14px] font-medium">
        {displayTitle(movement.slug)}
      </span>

      <MovementTag movement={movement} />
    </a>
  );
}

function MovementTag({ movement }: { movement: Movement }) {
  switch (movement.kind) {
    case "new-entry":
      return (
        <span
          className="mono shrink-0 rounded-full px-2.5 py-1 text-[11px] font-medium tracking-[0.04em] uppercase"
          style={{ background: "var(--accent-soft)", color: "var(--accent-deep)" }}
        >
          New
        </span>
      );
    case "moved-up":
      return (
        <span
          className="mono tabular shrink-0 text-[13px] font-medium"
          style={{ color: "var(--accent-deep)" }}
        >
          ▲ {movement.delta}
        </span>
      );
    case "moved-down":
      return (
        <span
          className="mono tabular shrink-0 text-[13px] font-medium"
          style={{ color: "var(--secondary)" }}
        >
          ▼ {movement.delta}
        </span>
      );
    case "dropped-out":
      return (
        <span className="mono shrink-0 text-[12px] text-[var(--ink-faint)]">
          dropped out — was #{movement.previousRank}
        </span>
      );
    case "unchanged":
      return <span className="mono shrink-0 text-[13px] text-[var(--ink-faint)]">–</span>;
  }
}
