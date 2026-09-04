import "server-only";

import { CATEGORIES } from "@/lib/categories";
import { appendSnapshot } from "@/lib/marketplace-watch-store";

/**
 * A realistic desktop-Chrome header set — verified live to get a clean
 * 200 with the full rendered page from Framer's public category pages.
 * A bare curl/fetch with no User-Agent trips Vercel's bot-check instead.
 */
const REQUEST_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
  Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
  "Accept-Language": "en-US,en;q=0.9",
};

// Excludes the categories/ index links themselves, which match the same
// /marketplace/templates/<slug>/ shape.
const TEMPLATE_HREF_RE = /href="\/marketplace\/templates\/(?!categories\/)([a-z0-9-]+)\/"/gi;

// A bot-check page has none of these links — treat anything this thin as
// a failed fetch rather than a real (mass-drop) snapshot.
const MIN_PLAUSIBLE_ENTRIES = 5;

const DELAY_BETWEEN_REQUESTS_MS = 3000;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Fetches one Framer category page and extracts the ordered list of
 * template slugs as they appear in the server-rendered HTML. Each
 * template's card links to its own page from several elements (thumbnail,
 * title, ...), so the same href repeats several times in sequence —
 * de-duplicating by first occurrence recovers the true ranked order
 * without needing an HTML parser.
 */
async function fetchCategoryRanking(framerCategorySlug: string): Promise<string[] | null> {
  const url = `https://www.framer.com/marketplace/templates/categories/${framerCategorySlug}/`;
  let html: string;
  try {
    const res = await fetch(url, { headers: REQUEST_HEADERS, cache: "no-store" });
    if (!res.ok) return null;
    html = await res.text();
  } catch {
    return null;
  }

  const seen = new Set<string>();
  const ordered: string[] = [];
  for (const match of html.matchAll(TEMPLATE_HREF_RE)) {
    const slug = match[1].toLowerCase();
    if (!seen.has(slug)) {
      seen.add(slug);
      ordered.push(slug);
    }
  }
  return ordered.length >= MIN_PLAUSIBLE_ENTRIES ? ordered : null;
}

export type CollectionResult = {
  categorySlug: string;
  status: "recorded" | "skipped-no-mapping" | "fetch-failed";
  entryCount?: number;
};

/**
 * Snapshots every tracked category's Framer page, one request at a time
 * with a fixed delay between them — polite, not a hammer. `only`
 * restricts to a single category slug for manual/testing runs. A failed
 * fetch for one category never blocks the rest or overwrites that
 * category's last good snapshot.
 */
export async function collectSnapshots(only?: string): Promise<CollectionResult[]> {
  const targets = CATEGORIES.filter((c) => !only || c.slug === only);
  const results: CollectionResult[] = [];

  for (const category of targets) {
    if (!category.framerCategorySlug) {
      results.push({ categorySlug: category.slug, status: "skipped-no-mapping" });
      continue;
    }

    const ranking = await fetchCategoryRanking(category.framerCategorySlug);
    if (!ranking) {
      results.push({ categorySlug: category.slug, status: "fetch-failed" });
    } else {
      await appendSnapshot(
        category.slug,
        ranking.map((slug, i) => ({ slug, rank: i + 1 })),
      );
      results.push({ categorySlug: category.slug, status: "recorded", entryCount: ranking.length });
    }

    await sleep(DELAY_BETWEEN_REQUESTS_MS);
  }

  return results;
}
