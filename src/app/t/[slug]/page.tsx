import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { RankBadge } from "@/components/rank-badge";
import { TemplateTile } from "@/components/template-tile";
import { BidForm } from "@/components/bid-form";
import { categoryBySlug } from "@/lib/categories";
import { getTemplateBySlug } from "@/lib/template";
import { getCurrentUser, isSupabaseConfigured } from "@/lib/auth";
import { isStripeConfigured } from "@/lib/stripe";
import { getActivePersona } from "@/lib/demo-sandbox";

export async function generateMetadata(
  props: PageProps<"/t/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const found = await getTemplateBySlug(slug);
  return { title: found ? found.entry.title : "Template" };
}

export default async function TemplatePage(props: PageProps<"/t/[slug]">) {
  const { slug } = await props.params;
  const searchParams = await props.searchParams;
  const bidResult = searchParams?.bid;
  const justListed = searchParams?.listed === "success";
  const wasRenamed = searchParams?.renamed === "1";

  const found = await getTemplateBySlug(slug);
  if (!found) notFound();

  const { entry, categorySlug } = found;
  const category = categoryBySlug(categorySlug);
  const configured = isSupabaseConfigured();
  const user = configured ? await getCurrentUser() : null;
  const persona = configured ? null : await getActivePersona();

  return (
    <main className="mx-auto max-w-[560px] px-4 py-10 sm:px-6 sm:py-14">
      <Link
        href={`/leaderboard/${categorySlug}`}
        className="mono text-[13px] text-[var(--ink-faint)]"
      >
        ← {category?.name ?? "leaderboard"}
      </Link>

      <div className="mt-5 flex items-center gap-4">
        <TemplateTile
          title={entry.title}
          thumbnailUrl={entry.thumbnailUrl}
          className="h-16 w-16 text-[22px]"
        />
        <div>
          <h1 className="text-[1.6rem] font-semibold">{entry.title}</h1>
          {entry.tagline && (
            <p className="mt-0.5 text-[14px] text-[var(--ink-soft)]">
              {entry.tagline}
            </p>
          )}
          <p className="mt-0.5 text-[14px] text-[var(--ink-faint)]">
            {entry.authorHandle}
          </p>
          <p className="mono mt-0.5 text-[12px] text-[var(--ink-faint)]">
            /t/{slug}
          </p>
        </div>
      </div>

      {entry.url && (
        <a
          href={`/out/${slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-[13.5px] font-medium shadow-[var(--shadow-xs)] transition-shadow hover:shadow-[var(--shadow-sm)]"
          style={{ background: "var(--surface)", color: "var(--ink)" }}
        >
          View template ↗
        </a>
      )}

      <div className="mt-6 flex items-center gap-3">
        <RankBadge rank={entry.rank} />
        <div>
          <div className="mono tabular text-[14px] font-medium">
            {entry.rank === 1 ? "Currently #1" : `Currently #${entry.rank}`} in{" "}
            {category?.name}
          </div>
          <div className="mono tabular text-[12.5px] text-[var(--ink-faint)]">
            ${entry.totalBidCents / 100} bid this round
          </div>
        </div>
      </div>

      {justListed && (
        <div
          className="mt-8 rounded-2xl p-4"
          style={{ background: "var(--spotlight-bg)", boxShadow: "var(--spotlight-shadow)" }}
        >
          <p className="text-[14px] leading-relaxed" style={{ color: "var(--accent-deep)" }}>
            🎉 {entry.title} is live in {category?.name} at /t/{slug}
            {wasRenamed &&
              " — another listing already used that title, so we added a suffix to your URL"}
            . Currently #{entry.rank} with $0 bid this round — place the
            first bid below to start climbing.
          </p>
        </div>
      )}
      {bidResult === "success" && (
        <div
          className="mt-8 rounded-2xl p-4"
          style={{ background: "var(--spotlight-bg)", boxShadow: "var(--spotlight-shadow)" }}
        >
          <p className="text-[14px] leading-relaxed" style={{ color: "var(--accent-deep)" }}>
            {configured
              ? "Payment received — your bid will show up here in a moment once it's confirmed."
              : "Bid recorded in the sandbox — see it reflected in the rank above."}
          </p>
        </div>
      )}
      {bidResult === "cancelled" && (
        <div className="mt-8 rounded-2xl bg-[var(--surface)] p-4 shadow-[var(--shadow-xs)]">
          <p className="text-[14px] leading-relaxed text-[var(--ink-soft)]">
            Checkout was cancelled — no charge was made.
          </p>
        </div>
      )}

      <div className="mt-8 rounded-2xl bg-[var(--surface)] p-4 shadow-[var(--shadow-xs)]">
        {!configured ? (
          persona ? (
            <BidForm slug={slug} />
          ) : (
            <>
              <p className="text-[14px] leading-relaxed text-[var(--ink-soft)]">
                Pick a dummy user to bid on {entry.title} in sandbox mode.
              </p>
              <Link
                href={`/login?next=/t/${slug}`}
                className="mt-4 inline-block rounded-full px-6 py-3.5 text-[14.5px] font-medium shadow-[var(--shadow-accent)]"
                style={{ background: "var(--accent)", color: "var(--accent-ink)" }}
              >
                Choose a dummy user
              </Link>
            </>
          )
        ) : !isStripeConfigured() ? (
          <p className="text-[14px] leading-relaxed text-[var(--ink-soft)]">
            Bidding isn&apos;t live yet — this is where you&apos;ll be able to
            put $1 or more behind {entry.title} and watch its rank move in
            real time.
          </p>
        ) : !user ? (
          <>
            <p className="text-[14px] leading-relaxed text-[var(--ink-soft)]">
              Sign in to bid on {entry.title}.
            </p>
            <Link
              href={`/login?next=/t/${slug}`}
              className="mt-4 inline-block rounded-full px-6 py-3.5 text-[14.5px] font-medium shadow-[var(--shadow-accent)]"
              style={{ background: "var(--accent)", color: "var(--accent-ink)" }}
            >
              Sign in
            </Link>
          </>
        ) : (
          <BidForm slug={slug} />
        )}
      </div>
    </main>
  );
}
