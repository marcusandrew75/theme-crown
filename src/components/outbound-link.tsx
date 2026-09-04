"use client";

import type { CSSProperties, ReactNode } from "react";

/**
 * A plain, honest link to the author's real marketplace URL (already
 * UTM-tagged by the caller) — hovering or copying it shows the real
 * destination, nothing local. The click is still counted for /pilot-stats,
 * via a non-blocking beacon that never delays or replaces the navigation.
 */
export function OutboundLink({
  href,
  slug,
  className,
  style,
  children,
}: {
  href: string;
  slug: string;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      style={style}
      onClick={() => {
        try {
          navigator.sendBeacon(`/api/click/${slug}`);
        } catch {
          // best-effort only — never block the actual navigation
        }
      }}
    >
      {children}
    </a>
  );
}
