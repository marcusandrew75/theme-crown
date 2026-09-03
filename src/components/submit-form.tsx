"use client";

import { useActionState } from "react";
import { submitTemplate } from "@/app/submit/actions";
import { CATEGORIES } from "@/lib/categories";

const inputClass =
  "rounded-[3px] border border-[var(--line-strong)] bg-[var(--surface)] px-3 py-2.5 text-[14.5px] text-[var(--ink)] outline-none focus:border-[var(--accent)]";

export function SubmitForm() {
  const [state, formAction, pending] = useActionState(
    submitTemplate,
    undefined,
  );

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1.5">
        <span className="text-[13.5px] font-medium text-[var(--ink)]">
          Title
        </span>
        <input
          type="text"
          name="title"
          required
          placeholder="Nimbus"
          className={inputClass}
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-[13.5px] font-medium text-[var(--ink)]">
          Category
        </span>
        <select name="category" required defaultValue="" className={inputClass}>
          <option value="" disabled>
            Choose one
          </option>
          {CATEGORIES.map((category) => (
            <option key={category.slug} value={category.slug}>
              {category.name}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-[13.5px] font-medium text-[var(--ink)]">
          Link to buy it
        </span>
        <input
          type="url"
          name="url"
          required
          placeholder="https://framer.com/marketplace/templates/..."
          className={inputClass}
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-[13.5px] font-medium text-[var(--ink)]">
          Thumbnail image URL{" "}
          <span className="font-normal text-[var(--ink-faint)]">
            (optional for now)
          </span>
        </span>
        <input
          type="url"
          name="thumbnail_url"
          placeholder="https://..."
          className={inputClass}
        />
      </label>

      <label className="flex items-start gap-2.5 text-[13.5px] text-[var(--ink-soft)]">
        <input
          type="checkbox"
          name="confirm"
          required
          className="mt-0.5 h-4 w-4 shrink-0"
        />
        I own this template&apos;s listing and I&apos;m allowed to submit it.
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
        {pending ? "Listing…" : "List template"}
      </button>
    </form>
  );
}
