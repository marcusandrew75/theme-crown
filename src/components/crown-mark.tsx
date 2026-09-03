/** Decorative crown glyph — used inside already-labeled contexts (e.g.
 * RankBadge's "Rank 1"), so it stays out of the accessibility tree itself. */
export function CrownMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M3 8 L7 13 L12 6 L17 13 L21 8 L19 18 L5 18 Z" />
      <line x1="5" y1="20" x2="19" y2="20" />
    </svg>
  );
}
