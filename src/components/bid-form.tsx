"use client";

import { useActionState, useState } from "react";
import { createBidCheckout } from "@/app/t/[slug]/actions";

const QUICK_AMOUNTS = [100, 500, 1000]; // cents: $1, $5, $10

function formatDollars(cents: number) {
  const dollars = cents / 100;
  return Number.isInteger(dollars) ? `$${dollars}` : `$${dollars.toFixed(2)}`;
}

export function BidForm({ slug }: { slug: string }) {
  const [state, formAction, pending] = useActionState(
    createBidCheckout,
    undefined,
  );
  const [selected, setSelected] = useState<number>(100);
  const [custom, setCustom] = useState("");

  const customCents = custom ? Math.round(Number.parseFloat(custom) * 100) : NaN;
  const amount = custom ? customCents : selected;
  const isValid = Number.isFinite(amount) && amount >= 100;

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <input type="hidden" name="slug" value={slug} />
      <input
        type="hidden"
        name="amount_cents"
        value={Number.isFinite(amount) ? amount : ""}
      />

      <div className="flex flex-wrap items-center gap-2">
        {QUICK_AMOUNTS.map((cents) => {
          const active = !custom && selected === cents;
          return (
            <button
              key={cents}
              type="button"
              onClick={() => {
                setSelected(cents);
                setCustom("");
              }}
              className="rounded-[3px] border px-4 py-2 text-[14px] font-medium"
              style={
                active
                  ? {
                      background: "var(--accent)",
                      color: "var(--accent-ink)",
                      borderColor: "var(--accent)",
                    }
                  : {
                      borderColor: "var(--line-strong)",
                      color: "var(--ink)",
                      background: "var(--surface)",
                    }
              }
            >
              {formatDollars(cents)}
            </button>
          );
        })}
        <label className="flex items-center gap-1 rounded-[3px] border border-[var(--line-strong)] bg-[var(--surface)] px-3 py-2">
          <span className="text-[14px] text-[var(--ink-faint)]">$</span>
          <input
            type="number"
            min={1}
            step={1}
            placeholder="Custom"
            value={custom}
            onChange={(event) => setCustom(event.target.value)}
            className="w-16 bg-transparent text-[14px] text-[var(--ink)] outline-none"
          />
        </label>
      </div>

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
        disabled={pending || !isValid}
        className="w-full rounded-[3px] py-3 text-[14.5px] font-medium disabled:opacity-60"
        style={{ background: "var(--accent)", color: "var(--accent-ink)" }}
      >
        {pending
          ? "Redirecting to checkout…"
          : isValid
            ? `Bid ${formatDollars(amount)}`
            : "Enter an amount"}
      </button>
    </form>
  );
}
