import "server-only";

import { readJsonBlob, writeJsonBlob } from "@/lib/blob-json-store";

/**
 * Persists marketplace-pulse snapshots. Backed by Vercel Blob (see
 * blob-json-store.ts) rather than a database table — there's no Supabase
 * project connected yet, and this only needs to hold a handful of weekly
 * snapshots per category.
 */

const FILE = "marketplace-watch.json";

// ~a quarter of weekly snapshots — cheap headroom for a future trend
// view without the blob growing unbounded.
const MAX_HISTORY_PER_CATEGORY = 12;

export type SnapshotEntry = { slug: string; rank: number };
export type CategorySnapshot = { capturedAt: string; entries: SnapshotEntry[] };

type Store = Record<string, CategorySnapshot[]>;

export async function getHistory(categorySlug: string): Promise<CategorySnapshot[]> {
  const store = await readJsonBlob<Store>(FILE, {});
  return store[categorySlug] ?? [];
}

export async function appendSnapshot(
  categorySlug: string,
  entries: SnapshotEntry[],
): Promise<void> {
  const store = await readJsonBlob<Store>(FILE, {});
  const history = [
    ...(store[categorySlug] ?? []),
    { capturedAt: new Date().toISOString(), entries },
  ];
  store[categorySlug] = history.slice(-MAX_HISTORY_PER_CATEGORY);
  await writeJsonBlob(FILE, store);
}
