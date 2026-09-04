import "server-only";

import { get, put } from "@vercel/blob";

/**
 * Shared read-modify-write helper for the small JSON files this app keeps
 * (click counts, marketplace-watch snapshots). Backed by Vercel Blob, not
 * the local filesystem — Vercel's production servers are read-only outside
 * /tmp, so a plain fs.writeFile crashes there even though it works fine
 * under `npm run dev`. Auth resolves automatically from whichever env vars
 * the connected Blob store injected (OIDC or BLOB_READ_WRITE_TOKEN) — no
 * token handling needed here.
 */

export async function readJsonBlob<T>(pathname: string, fallback: T): Promise<T> {
  const blob = await get(pathname, { access: "private", useCache: false });
  if (!blob) return fallback;

  try {
    const text = await new Response(blob.stream).text();
    return JSON.parse(text) as T;
  } catch {
    return fallback;
  }
}

export async function writeJsonBlob(pathname: string, data: unknown): Promise<void> {
  await put(pathname, JSON.stringify(data, null, 2), {
    access: "private",
    allowOverwrite: true,
    contentType: "application/json",
  });
}
