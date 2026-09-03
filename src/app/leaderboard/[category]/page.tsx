import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CrownMark } from "@/components/crown-mark";
import { LeaderboardRow, formatDollars } from "@/components/leaderboard-row";
import { TemplateTile } from "@/components/template-tile";
import { categoryBySlug, CATEGORIES } from "@/lib/categories";
import { getLeaderboard } from "@/lib/leaderboard";

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ category: c.slug }));
}

export async function generateMetadata(
  props: PageProps<"/leaderboard/[category]">,
): Promise<Metadata> {
  const { category: slug } = await props.params;
  const category = categoryBySlug(slug);
  return { title: category ? category.name : "Leaderboard" };
}

export default async function LeaderboardPage(
  props: PageProps<"/leaderboard/[category]">,
) {
  const { category: slug } = await props.params;
  const category = categoryBySlug(slug);
  if (!category) notFound();

  const { entries } = await getLeaderboard(slug);
  const [topEntry, ...restEntries] = entries;

  return (
    <main className="mx-auto max-w-[1160px] px-4 py-10 sm:px-6 sm:py-14">
      <p className="mono text-[11.5px] font-medium tracking-[0.08em] text-[var(--ink-faint)] uppercase">
        {category.tagline}
      </p>
      <h1 className="mt-1.5 text-[1.9rem] font-semibold sm:text-[2.2rem]">
        {category.name}
      </h1>

      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-[var(--ink-faint)]">
        <span className="mono">resets every Monday, 00:00 UTC</span>
      </div>

      {!topEntry ? (
        <p className="mt-10 text-[14.5px] text-[var(--ink-soft)]">
          No templates listed in {category.name} yet.
        </p>
      ) : (
        <>
          <Link
            href={`/t/${topEntry.slug}`}
            className="mt-8 flex flex-col items-start gap-6 rounded-3xl p-6 transition-transform hover:-translate-y-px sm:flex-row sm:items-center sm:p-9"
            style={{ background: "var(--accent-soft)", boxShadow: "var(--shadow-accent)" }}
          >
            <TemplateTile
              title={topEntry.title}
              thumbnailUrl={topEntry.thumbnailUrl}
              className="h-28 w-28 shrink-0 text-[38px] sm:h-40 sm:w-40 sm:text-[48px]"
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
              <div className="mt-2 truncate font-[family-name:var(--font-display)] text-[1.8rem] font-semibold sm:text-[2.2rem]">
                {topEntry.title}
              </div>
              {topEntry.tagline && (
                <div className="mt-1 truncate text-[14.5px] text-[var(--ink-soft)]">
                  {topEntry.tagline}
                </div>
              )}
              <div className="mt-1.5 text-[13.5px] text-[var(--ink-faint)]">
                {topEntry.authorHandle}
              </div>
            </div>
            <div className="flex shrink-0 flex-col items-start gap-1.5 sm:items-end">
              <span
                className="mono tabular text-[1.3rem] font-semibold"
                style={{ color: "var(--accent-deep)" }}
              >
                {formatDollars(topEntry.totalBidCents)}
              </span>
              <span
                className="rounded-full px-3.5 py-1.5 text-[12.5px] font-medium"
                style={{ background: "var(--accent)", color: "var(--accent-ink)" }}
              >
                Bid $1
              </span>
            </div>
          </Link>

          <div className="mt-3 flex flex-col gap-2">
            {restEntries.map((entry) => (
              <LeaderboardRow key={entry.slug} entry={entry} />
            ))}
          </div>
        </>
      )}
    </main>
  );
}
