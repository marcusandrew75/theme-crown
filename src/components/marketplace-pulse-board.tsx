"use client";

import { useState } from "react";
import { RankBadge } from "@/components/rank-badge";
import { DEMO_LEADERBOARDS } from "@/lib/demo-data";
import { computeMovements, TRACKED_TOP_N, type Movement } from "@/lib/marketplace-watch-diff";
import type { Category } from "@/lib/categories";
import type { CategorySnapshot } from "@/lib/marketplace-watch-store";

type Board = {
  category: Category;
  latest: CategorySnapshot | undefined;
  previous: CategorySnapshot | undefined;
  snapshotCount: number;
};

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
 * Category pill toggle for the pulse boards — same client-side-switch
 * pattern as HomeLeaderboard: every category's data is already fetched
 * server-side and handed over as props, so flipping between them never
 * re-navigates or re-fetches.
 */
export function MarketplacePulseBoard({ boards }: { boards: Board[] }) {
  const [activeSlug, setActiveSlug] = useState(boards[0]?.category.slug);
  const active = boards.find((b) => b.category.slug === activeSlug) ?? boards[0];
  if (!active) return null;

  const { category, latest, previous, snapshotCount } = active;

  return (
    <>
      <div className="relative mt-10 mb-6">
        <div className="no-scrollbar flex items-center gap-2 overflow-x-auto pb-1">
          {boards.map(({ category: c }) => {
            const isActive = c.slug === category.slug;
            return (
              <button
                key={c.slug}
                type="button"
                onClick={() => setActiveSlug(c.slug)}
                aria-pressed={isActive}
                className="shrink-0 rounded-full px-4 py-2 text-[13.5px] font-medium whitespace-nowrap transition-colors"
                style={
                  isActive
                    ? { background: "var(--accent)", color: "var(--accent-ink)" }
                    : { background: "var(--surface)", color: "var(--ink-soft)" }
                }
              >
                {c.name}
              </button>
            );
          })}
        </div>
        {/* Hints that the pill row scrolls further — sm:hidden because the
            row never overflows once there's room for all pills. */}
        <div
          className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-[var(--bg)] to-transparent sm:hidden"
          aria-hidden
        />
      </div>

      <h2 className="font-[family-name:var(--font-display)] text-[1.35rem] font-semibold sm:text-[1.6rem]">
        {category.name}
      </h2>

      <div className="mt-4">
        {!latest ? (
          <p className="text-[14px] text-[var(--ink-soft)]">No snapshot recorded yet.</p>
        ) : snapshotCount < 2 ? (
          <>
            <p className="text-[13px] text-[var(--ink-faint)]">
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
          <div className="flex flex-col gap-2">
            {computeMovements(previous, latest).map((movement) => (
              <MovementRow key={`${movement.slug}-${movement.kind}`} movement={movement} />
            ))}
          </div>
        )}
      </div>
    </>
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
