import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTemplateBySlug } from "@/lib/template";
import { confirmDemoPayment } from "./actions";

export const metadata: Metadata = { title: "Sandbox checkout" };

function formatDollars(cents: number) {
  const dollars = cents / 100;
  return Number.isInteger(dollars) ? `$${dollars}` : `$${dollars.toFixed(2)}`;
}

export default async function DemoCheckoutPage(
  props: PageProps<"/demo-checkout">,
) {
  const searchParams = await props.searchParams;
  const slug = typeof searchParams?.slug === "string" ? searchParams.slug : "";
  const amountRaw = typeof searchParams?.amount === "string" ? searchParams.amount : "";
  const amountCents = Number.parseInt(amountRaw, 10);

  if (!slug || !Number.isFinite(amountCents) || amountCents < 100) notFound();

  const found = await getTemplateBySlug(slug);
  if (!found) notFound();

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-[420px] flex-col justify-center px-4 py-10 sm:px-6">
      <div
        className="mb-4 rounded-[3px] border p-3 text-center text-[13px] font-medium"
        style={{ borderColor: "var(--secondary)", background: "var(--secondary-soft)", color: "var(--secondary)" }}
      >
        🧪 Sandbox checkout — this simulates Stripe. No real payment happens.
      </div>

      <div className="rounded-[3px] border border-[var(--line)] bg-[var(--surface)] p-6">
        <p className="text-[12.5px] font-medium tracking-[0.06em] text-[var(--ink-faint)] uppercase">
          Bid on
        </p>
        <h1 className="mt-1 text-[1.4rem] font-semibold">{found.entry.title}</h1>

        <div className="mt-6 flex items-baseline justify-between border-t border-[var(--line)] pt-4">
          <span className="text-[14px] text-[var(--ink-soft)]">Amount</span>
          <span className="mono tabular text-[1.3rem] font-semibold">
            {formatDollars(amountCents)}
          </span>
        </div>

        <form action={confirmDemoPayment} className="mt-6 flex flex-col gap-2">
          <input type="hidden" name="slug" value={slug} />
          <input type="hidden" name="amount_cents" value={amountCents} />
          <button
            type="submit"
            className="w-full rounded-[3px] py-3 text-[14.5px] font-medium"
            style={{ background: "var(--accent)", color: "var(--accent-ink)" }}
          >
            Simulate successful payment
          </button>
        </form>

        <Link
          href={`/t/${slug}?bid=cancelled`}
          className="mt-3 block text-center text-[13px] text-[var(--ink-faint)] hover:text-[var(--ink)]"
        >
          Cancel
        </Link>
      </div>
    </main>
  );
}
