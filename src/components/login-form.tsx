"use client";

import { useActionState } from "react";
import { requestMagicLink } from "@/app/login/actions";

export function LoginForm({ next }: { next: string }) {
  const [state, formAction, pending] = useActionState(
    requestMagicLink,
    undefined,
  );

  if (state?.sent) {
    return (
      <div className="rounded-[3px] border border-[var(--line)] bg-[var(--surface)] p-5">
        <p className="text-[14.5px] leading-relaxed text-[var(--ink-soft)]">
          Check your email — we sent a sign-in link. It expires shortly, so
          use it soon.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <input type="hidden" name="next" value={next} />
      <label className="flex flex-col gap-1.5">
        <span className="text-[13.5px] font-medium text-[var(--ink)]">
          Email
        </span>
        <input
          type="email"
          name="email"
          required
          placeholder="you@example.com"
          className="rounded-[3px] border border-[var(--line-strong)] bg-[var(--surface)] px-3 py-2.5 text-[14.5px] text-[var(--ink)] outline-none focus:border-[var(--accent)]"
        />
      </label>

      {state?.error && (
        <p
          className="rounded-[3px] px-3 py-2 text-[13.5px]"
          style={{ background: "var(--secondary-soft)", color: "var(--secondary)" }}
        >
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="mt-1 rounded-[3px] px-5 py-3 text-[14.5px] font-medium disabled:opacity-60"
        style={{ background: "var(--accent)", color: "var(--accent-ink)" }}
      >
        {pending ? "Sending…" : "Send sign-in link"}
      </button>
    </form>
  );
}
