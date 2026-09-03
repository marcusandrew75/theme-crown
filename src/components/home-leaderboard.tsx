"use client";

import { useState } from "react";
import Link from "next/link";
import { CrownMark } from "@/components/crown-mark";
import { LeaderboardRow, formatDollars } from "@/components/leaderboard-row";
import { TemplateTile } from "@/components/template-tile";
import type { Category } from "@/lib/categories";
import type { LeaderboardEntry } from "@/lib/demo-data";

type Board = { category: Category; entries: LeaderboardEntry[] };

/** Homepage leaderboard preview — a pill per category switches which
 * board's spotlight + rows are shown, all client-side (every category's
 * entries are already fetched server-side and handed over as props), so
 * flipping between boards never re-navigates or re-fetches. */
export function HomeLeaderboard({ boards }: { boards: Board[] }) {
  const [activeSlug, setActiveSlug] = useState(boards[0]?.category.slug);
  const active = boards.find((b) => b.category.slug === activeSlug) ?? boards[0];
  if (!active) return null;

  const [topEntry, ...restEntries] = active.entries.slice(0, 5);

  return (
    <section className="mx-auto max-w-[1160px] px-4 pb-16 sm:px-6 sm:pb-24">
      <div className="relative">
        <div className="no-scrollbar flex items-center gap-2 overflow-x-auto pb-1">
          {boards.map(({ category }) => {
            const isActive = category.slug === active.category.slug;
            return (
              <button
                key={category.slug}
                type="button"
                onClick={() => setActiveSlug(category.slug)}
                aria-pressed={isActive}
                className="shrink-0 rounded-full px-4 py-2 text-[13.5px] font-medium whitespace-nowrap transition-colors"
                style={
                  isActive
                    ? { background: "var(--accent)", color: "var(--accent-ink)" }
                    : { background: "var(--surface)", color: "var(--ink-soft)" }
                }
              >
                {category.name}
              </button>
            );
          })}
        </div>
        {/* Hints that the pill row scrolls further — sm:hidden because the
            row never overflows once there's room for all 5 pills. */}
        <div
          className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-[var(--bg)] to-transparent sm:hidden"
          aria-hidden
        />
      </div>

      <div className="mt-6 flex flex-wrap items-baseline justify-between gap-2">
        <span className="font-[family-name:var(--font-display)] text-[1.35rem] font-semibold sm:text-[1.6rem]">
          {active.category.name} — this week
        </span>
        <span className="mono text-[12px] text-[var(--ink-faint)] whitespace-nowrap">
          resets Mon 00:00 UTC
        </span>
      </div>

      {!topEntry ? (
        <p className="mt-10 text-[14.5px] text-[var(--ink-soft)]">
          No templates listed in {active.category.name} yet.
        </p>
      ) : (
        <>
          <Link
            href={`/t/${topEntry.slug}`}
            className="mt-5 flex flex-col items-start gap-6 rounded-3xl p-6 transition-transform hover:-translate-y-px sm:flex-row sm:items-center sm:p-9"
            style={{ background: "var(--accent-soft)", boxShadow: "var(--shadow-accent)" }}
          >
            <TemplateTile
              title={topEntry.title}
              thumbnailUrl={topEntry.thumbnailUrl}
              className="h-32 w-32 shrink-0 text-[40px] sm:h-44 sm:w-44 sm:text-[52px]"
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <CrownMark className="h-4 w-4 text-[var(--accent-deep)]" />
                <span
                  className="mono text-[12px] font-medium tracking-[0.06em] uppercase"
                  style={{ color: "var(--accent-deep)" }}
                >
                  Currently #1
                </span>
              </div>
              <div className="mt-2 truncate font-[family-name:var(--font-display)] text-[2rem] font-semibold sm:text-[2.5rem]">
                {topEntry.title}
              </div>
              {topEntry.tagline && (
                <div className="mt-1 truncate text-[15px] text-[var(--ink-soft)]">
                  {topEntry.tagline}
                </div>
              )}
              <div className="mt-1.5 text-[13.5px] text-[var(--ink-faint)]">
                {topEntry.authorHandle}
              </div>
            </div>
            <div className="flex shrink-0 flex-col items-start gap-1.5 sm:items-end">
              <span
                className="mono tabular text-[1.4rem] font-semibold"
                style={{ color: "var(--accent-deep)" }}
              >
                {formatDollars(topEntry.totalBidCents)}
              </span>
              <span
                className="rounded-full px-3.5 py-1.5 text-[12.5px] font-medium"
                style={{ background: "var(--accent)", color: "var(--accent-ink)" }}
              >
                Bid →
              </span>
            </div>
          </Link>

          <div className="mt-3 flex flex-col gap-2">
            {restEntries.map((entry) => (
              <LeaderboardRow key={entry.slug} entry={entry} />
            ))}
          </div>

          <Link
            href={`/leaderboard/${active.category.slug}`}
            className="mt-5 inline-block text-[14px] font-medium"
            style={{ color: "var(--accent-deep)" }}
          >
            See the full {active.category.name} board →
          </Link>
        </>
      )}
    </section>
  );
}
