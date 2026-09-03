import Link from "next/link";
import { CrownMark } from "@/components/crown-mark";
import { CrownLogomark } from "@/components/crown-logomark";
import { HomeLeaderboard } from "@/components/home-leaderboard";
import { CATEGORIES } from "@/lib/categories";
import { getLeaderboard } from "@/lib/leaderboard";

export default async function HomePage() {
  const boards = await Promise.all(
    CATEGORIES.map(async (category) => ({
      category,
      entries: (await getLeaderboard(category.slug)).entries,
    })),
  );

  return (
    <main>
      {/* ---------- hero copy ---------- */}
      <section className="mx-auto max-w-[1160px] px-4 pt-12 pb-6 sm:px-6 sm:pt-16 sm:pb-8">
        <span
          className="mono inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11.5px] font-medium tracking-[0.06em] text-[var(--accent-deep)] uppercase shadow-[var(--shadow-sm)]"
          style={{ background: "var(--surface-raised)" }}
        >
          <CrownMark className="h-3.5 w-3.5" />
          For Framer template authors
        </span>
        <h1 className="mt-8 max-w-[30ch] text-[2.2rem] leading-[1.08] font-semibold tracking-tight sm:mt-9 sm:text-[2.8rem]">
          A fairer way to get your template discovered.
        </h1>
        <p className="mt-4 max-w-[58ch] text-[16.5px] leading-relaxed text-[var(--ink-soft)]">
          Bid $1 or more to rank your template — small bids get a real shot,
          not just the biggest budgets.
        </p>
        <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2">
          <Link
            href="/submit"
            className="rounded-full px-6 py-3.5 text-[14.5px] font-medium shadow-[var(--shadow-accent)] transition-transform hover:-translate-y-px"
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
      <HomeLeaderboard boards={boards} />

      {/* ---------- how it works ---------- */}
      <section id="how-it-works" className="bg-[var(--surface-sunken)]">
        <div className="mx-auto max-w-[1160px] px-4 py-10 sm:px-6 sm:py-14">
          <h2 className="mono text-[11.5px] font-medium tracking-[0.08em] text-[var(--ink-faint)] uppercase">
            How it works
          </h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-3 sm:gap-5">
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
              <div
                key={step.title}
                className="rounded-2xl bg-[var(--surface-raised)] p-5 shadow-[var(--shadow-xs)]"
              >
                <h3 className="font-[family-name:var(--font-display)] text-[15px] font-semibold text-[var(--ink)]">
                  {step.title}
                </h3>
                <p className="mt-1.5 text-[13.5px] leading-relaxed text-[var(--ink-soft)]">
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
              className="flex items-center justify-between rounded-2xl bg-[var(--surface)] p-4 shadow-[var(--shadow-xs)] transition-shadow hover:shadow-[var(--shadow-md)]"
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
      <footer className="bg-[var(--surface-sunken)]">
        <div className="mx-auto flex max-w-[1160px] items-center gap-2 px-4 py-8 text-[13px] text-[var(--ink-faint)] sm:px-6">
          <CrownLogomark className="h-5 w-5" />
          ThemeCrown
        </div>
      </footer>
    </main>
  );
}
