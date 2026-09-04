import "server-only";

import { promises as fs } from "fs";
import path from "path";

/**
 * Persists marketplace-pulse snapshots (see marketplace-watch-collect.ts).
 * Same file-based-JSON-under-data/ approach as click-tracking.ts, for the
 * same reason: no Supabase project connected yet, and this only needs to
 * survive a single persistent-server deployment. Move to a real table
 * once Supabase is connected.
 */

const DATA_DIR = path.join(process.cwd(), "data");
const FILE = path.join(DATA_DIR, "marketplace-watch.json");

// ~a quarter of weekly snapshots — cheap headroom for a future trend
// view without the file growing unbounded.
const MAX_HISTORY_PER_CATEGORY = 12;

export type SnapshotEntry = { slug: string; rank: number };
export type CategorySnapshot = { capturedAt: string; entries: SnapshotEntry[] };

type Store = Record<string, CategorySnapshot[]>;

async function readStore(): Promise<Store> {
  try {
    const raw = await fs.readFile(FILE, "utf8");
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

export async function getHistory(categorySlug: string): Promise<CategorySnapshot[]> {
  const store = await readStore();
  return store[categorySlug] ?? [];
}

export async function appendSnapshot(
  categorySlug: string,
  entries: SnapshotEntry[],
): Promise<void> {
  const store = await readStore();
  const history = [
    ...(store[categorySlug] ?? []),
    { capturedAt: new Date().toISOString(), entries },
  ];
  store[categorySlug] = history.slice(-MAX_HISTORY_PER_CATEGORY);

  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(FILE, JSON.stringify(store, null, 2));
}
