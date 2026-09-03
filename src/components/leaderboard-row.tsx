import Link from "next/link";
import { RankBadge } from "./rank-badge";
import { TemplateTile } from "./template-tile";
import type { LeaderboardEntry } from "@/lib/demo-data";

export function formatDollars(cents: number) {
  return cents % 100 === 0
    ? `$${cents / 100}`
    : `$${(cents / 100).toFixed(2)}`;
}

export function LeaderboardRow({ entry }: { entry: LeaderboardEntry }) {
  return (
    <Link
      href={`/t/${entry.slug}`}
      className="flex items-center gap-3 rounded-[3px] border border-[var(--line)] bg-[var(--surface)] p-3 transition-colors hover:border-[var(--line-strong)]"
    >
      <RankBadge rank={entry.rank} />

      <div className="min-w-0 flex-1">
        <div className="truncate font-[family-name:var(--font-display)] text-[15px] font-semibold">
          {entry.title}
        </div>
        <div className="truncate text-[12.5px] text-[var(--ink-faint)]">
          {entry.authorHandle}
        </div>
      </div>

      <div className="flex shrink-0 flex-col items-end gap-1">
        <span className="mono tabular text-[13px] text-[var(--ink-soft)]">
          {formatDollars(entry.totalBidCents)}
        </span>
        <span
          className="rounded-[3px] px-2 py-1 text-[11px] font-medium whitespace-nowrap"
          style={{ background: "var(--accent-soft)", color: "var(--accent-deep)" }}
        >
          Bid $1
        </span>
      </div>

      <TemplateTile
        title={entry.title}
        thumbnailUrl={entry.thumbnailUrl}
        className="h-16 w-20 text-[22px]"
      />
    </Link>
  );
}
