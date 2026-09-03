import Link from "next/link";
import { CrownMark } from "@/components/crown-mark";
import { FoxMascot } from "@/components/fox-mascot";
import { LeaderboardRow, formatDollars } from "@/components/leaderboard-row";
import { TemplateTile } from "@/components/template-tile";
import { CATEGORIES } from "@/lib/categories";
import { getLeaderboard } from "@/lib/leaderboard";

export default async function HomePage() {
  const { entries } = await getLeaderboard("saas");
  const [topEntry, ...restEntries] = entries.slice(0, 5);

  return (
    <main>
      {/* ---------- hero copy ---------- */}
      <section className="mx-auto max-w-[1160px] px-4 pt-10 pb-6 sm:px-6 sm:pt-14 sm:pb-8">
        <p className="mono mb-4 text-[12px] font-medium tracking-[0.1em] text-[var(--accent-deep)] uppercase">
          For Framer template authors
        </p>
        <h1 className="max-w-[30ch] text-[2.1rem] leading-[1.08] font-semibold tracking-tight sm:text-[2.6rem]">
          A fairer way to get your template discovered.
        </h1>
        <p className="mt-4 max-w-[58ch] text-[16.5px] leading-relaxed text-[var(--ink-soft)]">
          Bid $1 or more to rank your template — small bids get a real shot,
          not just the biggest budgets.
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2">
          <Link
            href="/submit"
            className="rounded-[3px] px-5 py-3 text-[14.5px] font-medium"
            style={{ background: "var(--accent)", color: "var(--accent-ink)" }}
          >
            Submit your template
          </Link>
          <a
            href="#how-it-works"
            className="text-[13.5px] font-medium text-[var(--ink-faint)] hover:text-[var(--ink)]"
          >
            How it works →
          </a>
        </div>
      </section>

      {/* ---------- leaderboard showcase ---------- */}
      {topEntry && (
        <section className="mx-auto max-w-[1160px] px-4 pb-16 sm:px-6 sm:pb-24">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <span className="font-[family-name:var(--font-display)] text-[1.35rem] font-semibold sm:text-[1.6rem]">
              SaaS — this week
            </span>
            <span className="mono text-[12px] text-[var(--ink-faint)] whitespace-nowrap">
              resets Mon 00:00 UTC
            </span>
          </div>

          <Link
            href={`/t/${topEntry.slug}`}
            className="mt-5 flex flex-col items-start gap-5 rounded-[4px] border p-5 transition-opacity hover:opacity-90 sm:flex-row sm:items-center sm:p-7"
            style={{ borderColor: "var(--accent)", background: "var(--accent-soft)" }}
          >
            <TemplateTile
              title={topEntry.title}
              thumbnailUrl={topEntry.thumbnailUrl}
              className="h-24 w-24 shrink-0 text-[34px] sm:h-32 sm:w-32 sm:text-[42px]"
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
              <div className="mt-1.5 truncate font-[family-name:var(--font-display)] text-[1.7rem] font-semibold sm:text-[2.1rem]">
                {topEntry.title}
              </div>
              <div className="mt-1 text-[14px] text-[var(--ink-soft)]">
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
                className="rounded-[3px] px-3 py-1.5 text-[12.5px] font-medium"
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

          <Link
            href="/leaderboard/saas"
            className="mt-5 inline-block text-[14px] font-medium"
            style={{ color: "var(--accent-deep)" }}
          >
            See the full SaaS board →
          </Link>
        </section>
      )}

      {/* ---------- how it works ---------- */}
      <section
        id="how-it-works"
        className="border-t border-[var(--line)] bg-[var(--surface)]"
      >
        <div className="mx-auto max-w-[1160px] px-4 py-8 sm:px-6 sm:py-10">
          <h2 className="mono text-[11.5px] font-medium tracking-[0.08em] text-[var(--ink-faint)] uppercase">
            How it works
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-3 sm:gap-6">
            {[
              {
                title: "Submit once",
                body: "List your template — free, and you're eligible to be ranked right away.",
              },
              {
                title: "Bid $1 or more",
                body: "Boost your own, or back a favorite. Diminishing returns mean a $1 bid still counts.",
              },
              {
                title: "Rank resets weekly",
                body: "Every Monday 00:00 UTC, every board resets to zero — a fresh shot at #1.",
              },
            ].map((step) => (
              <div key={step.title}>
                <h3 className="text-[14.5px] font-semibold text-[var(--ink)]">
                  {step.title}
                </h3>
                <p className="mt-1 text-[13.5px] leading-relaxed text-[var(--ink-soft)]">
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- categories ---------- */}
      <section className="mx-auto max-w-[1160px] px-4 py-14 sm:px-6 sm:py-20">
        <h2 className="text-[1.5rem] font-semibold sm:text-[1.75rem]">
          Launch categories
        </h2>
        <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((category) => (
            <Link
              key={category.slug}
              href={`/leaderboard/${category.slug}`}
              className="flex items-center justify-between rounded-[3px] border border-[var(--line)] bg-[var(--surface)] p-4 transition-colors hover:border-[var(--line-strong)]"
            >
              <div>
                <div className="font-[family-name:var(--font-display)] text-[15.5px] font-semibold">
                  {category.name}
                </div>
                <div className="mono mt-0.5 text-[11.5px] text-[var(--ink-faint)] uppercase tracking-[0.04em]">
                  {category.tagline}
                </div>
              </div>
              <span className="mono text-[13px] text-[var(--accent-deep)]">→</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ---------- footer ---------- */}
      <footer className="border-t border-[var(--line)]">
        <div className="mx-auto flex max-w-[1160px] items-center gap-2 px-4 py-8 text-[13px] text-[var(--ink-faint)] sm:px-6">
          <FoxMascot className="h-5 w-5" />
          ThemeCrown
        </div>
      </footer>
    </main>
  );
}
