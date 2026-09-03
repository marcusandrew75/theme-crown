import type { Metadata } from "next";
import Link from "next/link";
import { SubmitForm } from "@/components/submit-form";
import { getCurrentUser, isSupabaseConfigured } from "@/lib/auth";
import { getActivePersona } from "@/lib/demo-sandbox";

export const metadata: Metadata = { title: "Submit a template" };

export default async function SubmitPage() {
  const configured = isSupabaseConfigured();
  const user = configured ? await getCurrentUser() : null;
  const persona = configured ? null : await getActivePersona();

  return (
    <main className="mx-auto max-w-[520px] px-4 py-10 sm:px-6 sm:py-14">
      <h1 className="text-[1.9rem] font-semibold sm:text-[2.2rem]">
        Submit a template
      </h1>
      <p className="mt-2 text-[14.5px] leading-relaxed text-[var(--ink-soft)]">
        Free to list — bidding is what pays for visibility, not the listing
        itself.
      </p>

      <div className="mt-8">
        {configured && !user ? (
          <div className="rounded-2xl bg-[var(--surface)] p-5 shadow-[var(--shadow-xs)]">
            <p className="text-[14.5px] leading-relaxed text-[var(--ink-soft)]">
              Sign in first so we know who to credit as the author.
            </p>
            <Link
              href="/login?next=/submit"
              className="mt-4 inline-block rounded-full px-6 py-3.5 text-[14.5px] font-medium shadow-[var(--shadow-accent)]"
              style={{ background: "var(--accent)", color: "var(--accent-ink)" }}
            >
              Sign in
            </Link>
          </div>
        ) : !configured && !persona ? (
          <div className="rounded-2xl bg-[var(--surface)] p-5 shadow-[var(--shadow-xs)]">
            <p className="text-[14.5px] leading-relaxed text-[var(--ink-soft)]">
              Pick a dummy user to try the submit flow in sandbox mode.
            </p>
            <Link
              href="/login?next=/submit"
              className="mt-4 inline-block rounded-full px-6 py-3.5 text-[14.5px] font-medium shadow-[var(--shadow-accent)]"
              style={{ background: "var(--accent)", color: "var(--accent-ink)" }}
            >
              Choose a dummy user
            </Link>
          </div>
        ) : (
          <SubmitForm />
        )}
      </div>
    </main>
  );
}
