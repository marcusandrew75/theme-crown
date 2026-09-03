import { CrownMark } from "./crown-mark";

export function RankBadge({ rank }: { rank: number }) {
  const isFirst = rank === 1;
  const isPodium = rank <= 3;

  return (
    <div
      className="mono flex h-11 w-11 shrink-0 items-center justify-center rounded-[3px] text-[16px] font-medium tabular"
      style={
        isFirst
          ? { background: "var(--accent)", color: "var(--accent-ink)" }
          : isPodium
            ? { background: "var(--accent-soft)", color: "var(--accent-deep)" }
            : {
                background: "var(--surface)",
                color: "var(--ink-soft)",
                border: "1px solid var(--line)",
              }
      }
      aria-label={`Rank ${rank}`}
    >
      {isFirst ? <CrownMark className="h-[18px] w-[18px]" /> : rank}
    </div>
  );
}
