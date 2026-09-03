import { CrownMark } from "./crown-mark";

export function RankBadge({ rank }: { rank: number }) {
  const isFirst = rank === 1;
  const isPodium = rank <= 3;

  return (
    <div
      className="mono flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-[16px] font-medium tabular"
      style={
        isFirst
          ? {
              background: "var(--accent)",
              color: "var(--accent-ink)",
              boxShadow: "var(--shadow-accent)",
            }
          : isPodium
            ? { background: "var(--accent-soft)", color: "var(--accent-deep)" }
            : {
                background: "var(--surface-sunken)",
                color: "var(--ink-soft)",
              }
      }
      aria-label={`Rank ${rank}`}
    >
      {isFirst ? <CrownMark className="h-[18px] w-[18px]" /> : rank}
    </div>
  );
}
