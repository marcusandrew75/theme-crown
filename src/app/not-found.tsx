import Link from "next/link";
import { CATEGORIES } from "@/lib/categories";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-[560px] flex-col justify-center px-4 py-14 sm:px-6">
      <p className="mono mb-2 text-[12px] font-medium tracking-[0.08em] text-[var(--accent-deep)] uppercase">
        404
      </p>
      <h1 className="text-[1.9rem] font-semibold sm:text-[2.2rem]">
        This page doesn&apos;t exist.
      </h1>
      <p className="mt-2 max-w-[46ch] text-[14.5px] leading-relaxed text-[var(--ink-soft)]">
        The template, category, or link you followed isn&apos;t here — it may
        have been renamed or never existed.
      </p>

      <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2">
        <Link
          href="/"
          className="rounded-full px-6 py-3.5 text-[14.5px] font-medium shadow-[var(--shadow-accent)] transition-transform hover:-translate-y-px"
          style={{ background: "var(--accent)", color: "var(--accent-ink)" }}
        >
          Back to ThemeCrown
        </Link>
        <Link
          href={`/leaderboard/${CATEGORIES[0].slug}`}
          className="text-[13.5px] font-medium text-[var(--ink-faint)] hover:text-[var(--ink)]"
        >
          Browse leaderboards →
        </Link>
      </div>
    </main>
  );
}
