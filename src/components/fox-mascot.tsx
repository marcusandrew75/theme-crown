/** Decorative — always paired with visible "ThemeCrown" text, so it
 * stays out of the accessibility tree. One silhouette, single fill,
 * reads as pointed fox ears and a crown at once. */
export function FoxMascot({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="currentColor" className={className} aria-hidden="true">
      <path d="M4,28 L22,6 L32,20 L42,6 L60,28 L32,60 Z" />
    </svg>
  );
}
