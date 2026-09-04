import "server-only";

import { readJsonBlob, writeJsonBlob } from "@/lib/blob-json-store";

/**
 * Counts outbound clicks per listing for the referrer pilot. Backed by
 * Vercel Blob (see blob-json-store.ts) rather than a database table —
 * there's no Supabase project connected yet, and this only needs to hold
 * a handful of counters for the few weeks of a pilot.
 */

const FILE = "clicks.json";

type ClickCounts = Record<string, number>;

export async function recordClick(slug: string): Promise<void> {
  const counts = await readJsonBlob<ClickCounts>(FILE, {});
  counts[slug] = (counts[slug] ?? 0) + 1;
  await writeJsonBlob(FILE, counts);
}

export async function getClickCounts(): Promise<ClickCounts> {
  return readJsonBlob<ClickCounts>(FILE, {});
}
