import "server-only";

import { promises as fs } from "fs";
import path from "path";

/**
 * Counts outbound clicks per listing for the referrer pilot. Plain JSON
 * file on disk rather than a database table — there's no Supabase project
 * connected yet, and this only needs to survive a single persistent-server
 * deployment (a VPS/Railway/Fly-style host) for the few weeks of a pilot.
 * On serverless hosts (Vercel, Netlify functions) each instance has its own
 * disk, so counts won't add up across instances or survive a redeploy —
 * move this to a `clicks` table once Supabase is connected instead.
 */

const DATA_DIR = path.join(process.cwd(), "data");
const FILE = path.join(DATA_DIR, "clicks.json");

type ClickCounts = Record<string, number>;

async function readCounts(): Promise<ClickCounts> {
  try {
    const raw = await fs.readFile(FILE, "utf8");
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

export async function recordClick(slug: string): Promise<void> {
  const counts = await readCounts();
  counts[slug] = (counts[slug] ?? 0) + 1;
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(FILE, JSON.stringify(counts, null, 2));
}

export async function getClickCounts(): Promise<ClickCounts> {
  return readCounts();
}
