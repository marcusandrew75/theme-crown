import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/login-form";
import { PersonaPicker } from "@/components/persona-picker";
import { getCurrentUser, isSupabaseConfigured } from "@/lib/auth";
import { getActivePersona } from "@/lib/demo-sandbox";

export const metadata: Metadata = { title: "Sign in" };

export default async function LoginPage(props: PageProps<"/login">) {
  const searchParams = await props.searchParams;
  const nextParam = searchParams?.next;
  const next = typeof nextParam === "string" ? nextParam : "/submit";

  const configured = isSupabaseConfigured();
  let activePersona = null;

  if (configured) {
    // Real auth: visiting /login while already signed in is redundant —
    // just send them where they were headed.
    const user = await getCurrentUser();
    if (user) redirect(next);
  } else {
    // Sandbox: re-visiting /login is how switching personas works, so
    // never auto-redirect away even if one is already active — otherwise
    // the header's "Switch" link would just bounce straight back.
    activePersona = await getActivePersona();
  }

  return (
    <main className="mx-auto max-w-[420px] px-4 py-14 sm:px-6 sm:py-20">
      <h1 className="text-[1.75rem] font-semibold">
        {configured ? "Sign in" : "Pick a dummy user"}
      </h1>
      <p className="mt-2 text-[14.5px] leading-relaxed text-[var(--ink-soft)]">
        {configured
          ? "We'll email you a link — no password to remember."
          : activePersona
            ? `Bidding and submitting as ${activePersona.name}. Pick someone else to switch.`
            : "Sandbox mode — no real account needed. Pick anyone to try submitting and bidding."}
      </p>

      <div className="mt-6">
        {configured ? (
          <LoginForm next={next} />
        ) : (
          <PersonaPicker next={next} />
        )}
      </div>
    </main>
  );
}
