import type { CategorySnapshot } from "@/lib/marketplace-watch-store";

export const TRACKED_TOP_N = 20;

export type Movement =
  | { slug: string; kind: "new-entry"; rank: number }
  | { slug: string; kind: "moved-up"; rank: number; previousRank: number; delta: number }
  | { slug: string; kind: "moved-down"; rank: number; previousRank: number; delta: number }
  | { slug: string; kind: "unchanged"; rank: number }
  | { slug: string; kind: "dropped-out"; previousRank: number };

/**
 * Compares the latest snapshot to the immediately-previous one, bounded
 * to the tracked top N — a move from #45 to #38 isn't reported, only
 * movement within (or into/out of) the tracked range. "new-entry" means
 * new to the tracked top N, not necessarily new to Framer's marketplace
 * as a whole — callers shouldn't word this as "brand new template!",
 * which this data can't actually verify.
 */
export function computeMovements(
  previous: CategorySnapshot | undefined,
  latest: CategorySnapshot,
): Movement[] {
  const previousRankBySlug = new Map(
    (previous?.entries ?? [])
      .filter((e) => e.rank <= TRACKED_TOP_N)
      .map((e) => [e.slug, e.rank] as const),
  );
  const currentTop = latest.entries.filter((e) => e.rank <= TRACKED_TOP_N);
  const currentSlugs = new Set(currentTop.map((e) => e.slug));

  const movements: Movement[] = currentTop.map((entry) => {
    const prevRank = previousRankBySlug.get(entry.slug);
    if (prevRank === undefined) {
      return { slug: entry.slug, kind: "new-entry", rank: entry.rank };
    }
    if (prevRank === entry.rank) {
      return { slug: entry.slug, kind: "unchanged", rank: entry.rank };
    }
    const delta = prevRank - entry.rank;
    return delta > 0
      ? { slug: entry.slug, kind: "moved-up", rank: entry.rank, previousRank: prevRank, delta }
      : { slug: entry.slug, kind: "moved-down", rank: entry.rank, previousRank: prevRank, delta: -delta };
  });

  const droppedOut: Movement[] = [...previousRankBySlug.entries()]
    .filter(([slug]) => !currentSlugs.has(slug))
    .sort((a, b) => a[1] - b[1])
    .map(([slug, previousRank]) => ({ slug, kind: "dropped-out", previousRank }));

  return [...movements, ...droppedOut];
}
