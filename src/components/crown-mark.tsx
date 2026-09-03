import { CrownLogomark } from "./crown-logomark";

/** Decorative crown glyph — used inside already-labeled contexts (e.g.
 * RankBadge's "Rank 1"), so it stays out of the accessibility tree itself.
 * Same glyph as the brand logomark (public/crown.svg), just reused at
 * smaller sizes for in-UI "you're #1" moments. */
export function CrownMark({ className }: { className?: string }) {
  return <CrownLogomark className={className} />;
}
